import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import localize from '../utils/localize';
import { analyzeUserPersonality, findCompatibleJobs } from '../services/analysisApi';
import { BarChart, Briefcase, CheckCircle, Loader, User, Zap } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';

// Mock assessment questions (in a real app, fetch this from the backend)
const assessmentQuestions = [
    { id: 'q1', text: 'When making decisions, you rely more on:', options: ['Logic and facts', 'Feelings and intuition'] },
    { id: 'q2', text: 'At a social event, you are more likely to:', options: ['Interact with many people', 'Interact with a few people you know'] },
    { id: 'q3', text: 'You prefer to have a day that is:', options: ['Planned and organized', 'Spontaneous and flexible'] },
    { id: 'q4', text: 'When working on a project, you enjoy:', options: ['Focusing on the details and practical aspects', 'Exploring ideas and possibilities'] },
    { id: 'q5', text: 'You feel more energized by:', options: ['Spending time alone', 'Spending time with others'] },
];

const PersonalityTestPage = () => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [compatibleJobs, setCompatibleJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  // localize helper is imported from ../utils/localize

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < assessmentQuestions.length) {
      setError('Please answer all questions.');
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    setCompatibleJobs([]);

    try {
      // Authentication token is automatically included via interceptor
      const response = await analyzeUserPersonality(answers);
      setResults(response.data);
      setError(null);
    } catch (err) {
      console.error('Error analyzing personality:', err);
      // If user is not authenticated, prompt to login
      if (err?.response?.status === 401) {
        setError('Please log in to take the personality assessment.');
      } else if (err?.response?.status === 400) {
        setError(err?.response?.data?.error || 'Invalid assessment data. Please review your answers.');
      } else {
        setError('Failed to analyze personality. Please ensure the backend server is running and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFindJobs = async () => {
    setLoadingJobs(true);
    try {
        // Authentication token is automatically included via interceptor
        const response = await findCompatibleJobs();
        // Some backends may return 204 No Content when there are no matches.
        // Normalize that to an empty array and show a friendly message.
        if (response.status === 204 || !response.data) {
          setCompatibleJobs([]);
          setError('No compatible jobs found for your profile yet.');
        } else {
          console.log('Compatible jobs response:', response.data);
          setCompatibleJobs(response.data || []);
          setError(null);
        }
  } catch (err) {
    console.error('Error fetching compatible jobs:', err);
    if (err?.response?.status === 401) {
      setError('Please log in to view compatible jobs.');
    } else if (err?.response?.status === 404) {
      setError('No compatible jobs found. Try updating your profile or take the assessment first.');
    } else {
      setError('Failed to fetch compatible jobs. Please try again later.');
    }
  } finally {
        setLoadingJobs(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <User className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Personality Assessment</h1>
          </div>
          <p className="text-gray-600">
            Understand your personality to discover career paths that align with your natural strengths and preferences.
          </p>
        </div>

        {!results ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Assessment Questions</h2>
            {assessmentQuestions.map((q, index) => (
              <div key={q.id} className="mb-6">
                <p className="font-medium text-gray-800 mb-2">{index + 1}. {q.text}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {q.options.map(option => (
                    <label key={option} className="flex-1 p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-50 has-[:checked]:bg-blue-100 has-[:checked]:border-blue-500">
                      <input
                        type="radio"
                        name={q.id}
                        value={option}
                        onChange={() => handleAnswerChange(q.id, option)}
                        className="sr-only"
                        required
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-400"
            >
              <span className="inline-flex items-center">
                {loading ? <Loader className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />}
              </span>
              Submit & Analyze
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Personality Profile</h2>
            {results && results.personality_type ? (
              <>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                    <div className="flex items-center">
                        <BarChart className="h-10 w-10 text-blue-600 mr-4"/>
                        <div>
                            <p className="font-bold text-2xl text-blue-800">{String(localize(results.personality_type.name))} ({results.personality_type.code})</p>
                            <p className="text-gray-600">{String(localize(results.personality_type.description))}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">Strengths</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
      {Array.isArray(results.personality_type.strengths) ? results.personality_type.strengths.map((s, i) => <li key={`strength-${i}-${JSON.stringify(s)}`}>{String(localize(s))}</li>) : <li key="strength-single">{String(localize(results.personality_type.strengths))}</li>}
        </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">Areas for Growth</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {Array.isArray(results.personality_type.weaknesses) ? results.personality_type.weaknesses.map((w, i) => <li key={`weakness-${i}-${JSON.stringify(w)}`}>{String(localize(w))}</li>) : <li key="weakness-single">{String(localize(results.personality_type.weaknesses))}</li>}
            </ul>
                    </div>
                </div>
              </>
            ) : (
              <p className="text-red-600">Error loading personality profile data.</p>
            )}
            
            <div className="text-center">
                <button
                    onClick={handleFindJobs}
                    disabled={loadingJobs}
                    className="bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center disabled:bg-purple-400 mx-auto"
                >
                    <span className="inline-flex items-center">
                      {loadingJobs ? <Loader className="animate-spin mr-2" /> : <Zap className="mr-2" />}
                    </span>
                    Find Compatible Jobs
                </button>
            </div>
          </div>
        )}

        {compatibleJobs.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recommended Career Paths</h2>
                <div className="space-y-4">
                    {compatibleJobs.map((jobMatch, index) => {
                      // Extract job name from various possible locations
                      const jobName = jobMatch.jobCategory?.name || 
                                     jobMatch.jobCategory?.title || 
                                     jobMatch.job?.name || 
                                     jobMatch.job?.title ||
                                     'Career Opportunity';
                      
                      const jobDescription = jobMatch.jobCategory?.description || 
                                            jobMatch.job?.description || 
                                            '';
                      
                      return (
                        <div key={jobMatch.jobCategory?.id || jobMatch.job?.id || `job-${index}`} className="border p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center">
                                <Briefcase className="mr-2 text-blue-500"/>
                                {String(localize(jobName))}
                            </h3>
                            
                            {jobDescription && (
                              <p className="text-sm text-gray-600 mb-2 italic">{String(localize(jobDescription))}</p>
                            )}
                            
                            <div className="flex gap-4 mb-2">
                              <p className="text-sm text-gray-500">
                                <span className="font-semibold">Compatibility:</span> {jobMatch.compatibilityScore || 0}%
                              </p>
                              {jobMatch.satisfactionPrediction && (
                                <p className="text-sm text-gray-500">
                                  <span className="font-semibold">Satisfaction:</span> {jobMatch.satisfactionPrediction}%
                                </p>
                              )}
                              {jobMatch.performancePrediction && (
                                <p className="text-sm text-gray-500">
                                  <span className="font-semibold">Performance:</span> {jobMatch.performancePrediction}%
                                </p>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-3">{String(localize(jobMatch.compatibilityReason))}</p>
                            
                            {/* Matching Factors */}
                            {jobMatch.matchingFactors && (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-3 text-xs">
                                {jobMatch.matchingFactors.workStyleMatch !== undefined && (
                                  <div className="bg-blue-50 p-2 rounded">
                                    <p className="text-gray-600">Work Style</p>
                                    <p className="font-semibold text-blue-700">{jobMatch.matchingFactors.workStyleMatch}%</p>
                                  </div>
                                )}
                                {jobMatch.matchingFactors.skillsAlignment !== undefined && (
                                  <div className="bg-green-50 p-2 rounded">
                                    <p className="text-gray-600">Skills</p>
                                    <p className="font-semibold text-green-700">{jobMatch.matchingFactors.skillsAlignment}%</p>
                                  </div>
                                )}
                                {jobMatch.matchingFactors.interestsAlignment !== undefined && (
                                  <div className="bg-purple-50 p-2 rounded">
                                    <p className="text-gray-600">Interests</p>
                                    <p className="font-semibold text-purple-700">{jobMatch.matchingFactors.interestsAlignment}%</p>
                                  </div>
                                )}
                                {jobMatch.matchingFactors.valuesAlignment !== undefined && (
                                  <div className="bg-yellow-50 p-2 rounded">
                                    <p className="text-gray-600">Values</p>
                                    <p className="font-semibold text-yellow-700">{jobMatch.matchingFactors.valuesAlignment}%</p>
                                  </div>
                                )}
                                {jobMatch.matchingFactors.environmentMatch !== undefined && (
                                  <div className="bg-pink-50 p-2 rounded">
                                    <p className="text-gray-600">Environment</p>
                                    <p className="font-semibold text-pink-700">{jobMatch.matchingFactors.environmentMatch}%</p>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Success Factors */}
                            {jobMatch.successFactors && jobMatch.successFactors.length > 0 && (
                              <div className="mt-3 p-2 bg-green-50 rounded">
                                <p className="text-xs font-semibold text-green-800 mb-1">✓ Success Factors:</p>
                                <ul className="text-xs text-green-700 list-disc list-inside">
                                  {jobMatch.successFactors.slice(0, 3).map((factor, i) => (
                                    <li key={`success-${index}-${i}`}>{factor}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      );
                    })}
                </div>
            </div>
        )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PersonalityTestPage;
