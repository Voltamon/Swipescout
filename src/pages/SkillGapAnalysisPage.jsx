import React, { useState, useEffect } from 'react';
import { analyzeSkillGaps, getAllJobs } from '../services/analysisApi';
import { Briefcase, Target, TrendingUp, Loader, AlertTriangle, BookOpen, Zap } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';

const SkillGapAnalysisPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();
        setJobs(response.data);
      } catch (err) {
        setError('Failed to fetch jobs list.');
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedJob) {
      setError('Please select a job to analyze.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Authentication token is automatically included via interceptor
      const response = await analyzeSkillGaps(selectedJob);
      setAnalysis(response.data);
      setError(null);
    } catch (err) {
      console.error('Error analyzing skill gaps:', err);
      setError('Failed to perform skill gap analysis. Please ensure the backend server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Skill Gap Analysis</h1>
          </div>
          <p className="text-gray-600">
            Identify the skills you need to develop for your target job and create a plan to bridge the gap.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Select a Job to Analyze</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={jobs.length === 0}
              >
                <option value="">-- Select a Job --</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedJob}
              className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center disabled:bg-purple-400"
            >
              {loading ? <Loader className="animate-spin mr-2" /> : <Zap className="mr-2" />}
              Analyze
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-center text-red-600">
              <AlertTriangle className="mr-2" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {analysis && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Analysis for: <span className="text-purple-700">{jobs.find(j => j.id === parseInt(selectedJob))?.title}</span>
            </h2>
            
            <div className="space-y-6">
              {analysis.map(gap => (
                <div key={gap.skill.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <h3 className="font-bold text-xl text-gray-800">{gap.skill.name}</h3>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(gap.priority)}`}>
                      {gap.priority} Priority
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Required Level</p>
                      <p className="font-bold text-lg text-gray-800">{gap.required_level}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Your Level</p>
                      <p className="font-bold text-lg text-blue-600">{gap.user_level}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-red-500">Skill Gap</p>
                      <p className="font-bold text-lg text-red-700">{gap.gap_size}</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                    <h4 className="font-semibold text-gray-800 flex items-center mb-2">
                      <BookOpen className="mr-2 text-purple-600" />
                      Development Plan
                    </h4>
                    <p className="text-gray-600 mb-2">{gap.development_plan.description}</p>
                    <p className="text-sm text-gray-500 mb-2">Estimated learning time: {gap.estimated_learning_time} hours</p>
                    <h5 className="font-medium text-gray-700 mt-3">Suggested Resources:</h5>
                    <ul className="list-disc list-inside text-blue-600 space-y-1 mt-1">
                      {gap.learning_resources.map((res, index) => (
                        <li key={index}>
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {res.name} ({res.type})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
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

export default SkillGapAnalysisPage;
