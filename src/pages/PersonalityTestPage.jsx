import React, { useState } from 'react';
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
      setError('Failed to analyze personality. Please ensure you have completed all questions and the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFindJobs = async () => {
    setLoadingJobs(true);
    try {
        // Authentication token is automatically included via interceptor
        const response = await findCompatibleJobs();
        setCompatibleJobs(response.data);
        setError(null);
    } catch (err) {
        console.error('Error fetching compatible jobs:', err);
        setError('Failed to fetch compatible jobs. Please try again later.');
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
              {loading ? <Loader className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />}
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
                            <p className="font-bold text-2xl text-blue-800">{results.personality_type.name} ({results.personality_type.code})</p>
                            <p className="text-gray-600">{results.personality_type.description}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">Strengths</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {Array.isArray(results.personality_type.strengths) ? results.personality_type.strengths.map((s, i) => <li key={i}>{s}</li>) : <li>{results.personality_type.strengths}</li>}
                        </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">Areas for Growth</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {Array.isArray(results.personality_type.weaknesses) ? results.personality_type.weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>{results.personality_type.weaknesses}</li>}
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
                    {loadingJobs ? <Loader className="animate-spin mr-2" /> : <Zap className="mr-2" />}
                    Find Compatible Jobs
                </button>
            </div>
          </div>
        )}

        {compatibleJobs.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recommended Career Paths</h2>
                <div className="space-y-4">
                    {compatibleJobs.map(jobMatch => (
                        <div key={jobMatch.job.id} className="border p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center">
                                <Briefcase className="mr-2 text-blue-500"/>
                                {jobMatch.job.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">Compatibility Score: {jobMatch.compatibility_score}%</p>
                            <p className="text-gray-600">{jobMatch.detailed_analysis}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default PersonalityTestPage;
