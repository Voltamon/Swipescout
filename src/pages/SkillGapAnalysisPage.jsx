import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { analyzeSkillGaps, getAllJobs } from '../services/analysisApi';
import { Briefcase, Target, TrendingUp, Loader, AlertTriangle, BookOpen, Zap } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import localize from '../utils/localize';

// Stable icon component wrapper to prevent React reconciliation errors
const IconWrapper = React.memo(({ children, className = '' }) => (
  <span className={`inline-flex items-center justify-center ${className}`}>
    {children}
  </span>
));

// Use a stable mounted ref and regular state for loading.
// This is simpler and avoids timing-related DOM insertion issues.

const SkillGapAnalysisPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mounted ref to avoid state updates after unmount
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
  let isFetchActive = true;
    
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();
        // Backend may return different shapes, commonly:
        // { jobs: [...] } or { message: '..', jobs: [...] } or an array directly
        const data = response?.data;
        
  // Only update state if component is still mounted
  if (!isFetchActive || !isMountedRef.current) return;
        
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else if (data && Array.isArray(data.data)) {
          setJobs(data.data);
        } else {
          // Unexpected shape (possibly an error object like { message: 'Unauthorized' })
          console.warn('Unexpected jobs response shape:', data);
          setJobs([]);
          if (data && data.message) setError(data.message);
        }
      } catch (err) {
  if (!isFetchActive || !isMountedRef.current) return;
        setError('Failed to fetch jobs list.');
        console.error(err);
      }
    };
    
    fetchJobs();
    
    // Cleanup function to cancel pending state updates
    return () => {
      isFetchActive = false;
    };
  }, []);

  const handleAnalyze = async () => {
    console.log('🔍 Analyze clicked! Selected job:', selectedJob);
    console.log('🔍 isMountedRef.current:', isMountedRef.current);
    
    if (!selectedJob) {
      console.log('❌ No job selected');
      setError('Please select a job to analyze.');
      return;
    }
    
    // avoid doing work if component unmounted
    if (!isMountedRef.current) {
      console.log('❌ Component unmounted, aborting');
      return;
    }

    console.log('✅ Starting analysis request for job ID:', selectedJob);
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Authentication token is automatically included via interceptor
      console.log('📡 Calling analyzeSkillGaps API...');
      const response = await analyzeSkillGaps(selectedJob);
      console.log('✅ Analysis response received:', response.data);

      // Only update state if component is still mounted
      if (!isMountedRef.current) return;

      // sanitize analysis data to avoid showing '[object Object]' when templates
      // accidentally concatenated objects into strings on the backend
      const sanitizeAnalysis = (raw) => {
        if (!raw) return raw;
        // deep clone to avoid mutating original
        const a = JSON.parse(JSON.stringify(raw));
        if (Array.isArray(a.gaps)) {
          a.gaps = a.gaps.map((gap) => {
            try {
              const skillName = localize(gap?.skill?.name) || '';

              // development_plan.description may contain the literal '[object Object]'
              if (gap.development_plan && typeof gap.development_plan.description === 'string') {
                gap.development_plan.description = gap.development_plan.description.split('[object Object]').join(skillName);
              }

              // learning_resources: fix names and urls that include the placeholder
              if (Array.isArray(gap.learning_resources)) {
                gap.learning_resources = gap.learning_resources.map((res) => {
                  if (res && typeof res.name === 'string' && res.name.includes('[object Object]')) {
                    res.name = res.name.split('[object Object]').join(skillName);
                  }
                  if (res && typeof res.url === 'string' && res.url.includes('%5Bobject%20Object%5D')) {
                    // replace encoded [object Object] with encoded skill name
                    const encoded = encodeURIComponent(skillName);
                    res.url = res.url.split('%5Bobject%20Object%5D').join(encoded);
                  }
                  return res;
                });
              }

              // milestones: titles sometimes contain the placeholder
              if (Array.isArray(gap.milestones)) {
                gap.milestones = gap.milestones.map((m) => {
                  if (m && typeof m.title === 'string' && m.title.includes('[object Object]')) {
                    m.title = m.title.split('[object Object]').join(skillName);
                  }
                  return m;
                });
              }

            } catch (e) {
              // swallow – do best-effort sanitization
              console.warn('Sanitize gap failed', e);
            }
            return gap;
          });
        }
        return a;
      };

      const sanitized = sanitizeAnalysis(response.data);
      setAnalysis(sanitized);
      setError(null);
    } catch (err) {
      if (!isMountedRef.current) return;

      console.error('❌ Error analyzing skill gaps:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError('Failed to perform skill gap analysis. Please ensure the backend server is running and try again.');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600 text-white';
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
                disabled={!Array.isArray(jobs) || jobs.length === 0}
              >
                <option value="">-- Select a Job --</option>
                {Array.isArray(jobs) && jobs.map(job => (
                  <option key={job.id} value={job.id}>{String(localize(job.title))}</option>
                ))}
              </select>
            </div>
            <button
              key="analyze-button"
              onClick={handleAnalyze}
              disabled={loading || !selectedJob}
              className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center disabled:bg-purple-400 disabled:cursor-not-allowed"
            >
              <IconWrapper className="mr-2">
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" key="loader-icon" />
                ) : (
                  <Zap className="w-5 h-5" key="zap-icon" />
                )}
              </IconWrapper>
              <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
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
              Analysis for: <span className="text-purple-700">{String(localize(analysis.job?.title || (Array.isArray(jobs) && jobs.find(j => j.id === selectedJob)?.title)))}</span>
            </h2>
            
            {/* Summary Section */}
            {analysis.summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Gaps</p>
                  <p className="text-2xl font-bold text-blue-600">{analysis.summary.total_gaps}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{analysis.summary.critical_gaps}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Readiness</p>
                  <p className="text-2xl font-bold text-green-600">{analysis.summary.readiness_score}%</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Est. Time</p>
                  <p className="text-2xl font-bold text-purple-600">{analysis.summary.total_estimated_time}h</p>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {(analysis.gaps || []).map(gap => (
                <div key={gap.skill.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <h3 className="font-bold text-xl text-gray-800">{String(localize(gap.skill.name))}</h3>
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
                    <p className="text-gray-600 mb-2">{String(localize(gap.development_plan.description))}</p>
                    <p className="text-sm text-gray-500 mb-2">Estimated learning time: {gap.estimated_learning_time} hours</p>
                    <h5 className="font-medium text-gray-700 mt-3">Suggested Resources:</h5>
                    <ul className="list-disc list-inside text-blue-600 space-y-1 mt-1">
                            {gap.learning_resources.map((res, index) => (
                        <li key={index}>
                          <a href={res.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {String(localize(res.name))} ({res.type})
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
