import React, { useContext, useState, useEffect  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  FileText, 
  Video, 
  Clock, 
  User, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Share,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Languages,
  MessageSquare,
  Star,
  Target,
  Brain,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';

const TemplateAnalysisPage = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [templateResponse, setTemplateResponse] = useState(null);
  const [transcriptionStatus, setTranscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'ط§ظ„ط¹ط±ط¨ظٹط©' },
    { code: 'zh', name: 'ن¸­و–‡' },
    { code: 'es', name: 'Espaأ±ol' },
    { code: 'fr', name: 'Franأ§ais' }
  ];

  useEffect(() => {
    fetchTemplateResponse();
    fetchTranscriptionStatus();
  }, [responseId]);

  useEffect(() => {
    let interval;
    if (autoRefresh && transcriptionStatus && !transcriptionStatus.is_complete) {
      interval = setInterval(() => {
        fetchTranscriptionStatus();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, transcriptionStatus]);

  const fetchTemplateResponse = async () => {
    try {
      const response = await fetch(`/api/ai/templates/responses/${responseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplateResponse(data.data);
      }
    } catch (error) {
      console.error('Error fetching template response:', error);
    }
  };

  const fetchTranscriptionStatus = async () => {
    try {
      const response = await fetch(`/api/ai/transcription/template-responses/${responseId}/transcription-status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTranscriptionStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching transcription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTranscription = async () => {
    try {
      setAutoRefresh(true);
      const response = await fetch(`/api/ai/transcription/template-responses/${responseId}/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        fetchTranscriptionStatus();
      }
    } catch (error) {
      console.error('Error starting transcription:', error);
    }
  };

  const generateAnalysis = async () => {
    try {
      setIsGeneratingAnalysis(true);
      const response = await fetch(`/api/ai/transcription/template-responses/${responseId}/generate-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        await fetchTemplateResponse();
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  const translateResponse = async (responseId, languages) => {
    try {
      const response = await fetch(`/api/ai/transcription/responses/${responseId}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ languages })
      });
      
      if (response.ok) {
        await fetchTemplateResponse();
      }
    } catch (error) {
      console.error('Error translating response:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <TrendingUp className="w-4 h-4" />;
    if (score >= 60) return <Target className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!templateResponse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('analysis.responseNotFound')}
          </h2>
          <button
            onClick={() => navigate('/templates')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('analysis.backToTemplates')}
          </button>
        </div>
      </div>
    );
  }

  const overallAnalysis = templateResponse.ai_analysis || {};
  const questionResponses = templateResponse.question_responses || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('analysis.interviewAnalysis')}
              </h1>
              <p className="text-gray-600">
                {templateResponse.template?.title}
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    templateResponse.status === 'reviewed' ? 'bg-green-500' : 
                    templateResponse.status === 'submitted' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {t(`analysis.status.${templateResponse.status}`)}
                  </span>
                </div>
                
                {transcriptionStatus && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>
                      {t('analysis.transcribed')}: {transcriptionStatus.transcribed_count}/{transcriptionStatus.total_video_responses}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {transcriptionStatus && !transcriptionStatus.is_complete && (
                  <button
                    onClick={startTranscription}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t('analysis.startTranscription')}
                  </button>
                )}
                
                {transcriptionStatus?.is_complete && !overallAnalysis.comprehensive_analysis_completed && (
                  <button
                    onClick={generateAnalysis}
                    disabled={isGeneratingAnalysis}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                  >
                    {isGeneratingAnalysis ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    {t('analysis.generateAnalysis')}
                  </button>
                )}

                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`p-2 rounded-lg transition-colors ${
                    autoRefresh ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Progress Bars */}
            {transcriptionStatus && (
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{t('analysis.transcriptionProgress')}</span>
                    <span>{Math.round(transcriptionStatus.transcription_progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${transcriptionStatus.transcription_progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{t('analysis.analysisProgress')}</span>
                    <span>{Math.round(transcriptionStatus.analysis_progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${transcriptionStatus.analysis_progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overall Analysis */}
        {overallAnalysis.comprehensive_analysis_completed && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('analysis.overallPerformance')}</h2>
            
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { key: 'overall_score', label: t('analysis.overallScore'), icon: BarChart3 },
                { key: 'communication_score', label: t('analysis.communicationScore'), icon: MessageSquare },
                { key: 'technical_score', label: t('analysis.technicalScore'), icon: Brain },
                { key: 'completeness_score', label: t('analysis.completenessScore'), icon: CheckCircle }
              ].map(({ key, label, icon: Icon }) => {
                const score = overallAnalysis[key] || 0;
                return (
                  <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
                        {getScoreIcon(score)}
                        <span>{Math.round(score)}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Analysis Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{t('analysis.strengths')}</h3>
                </div>
                <ul className="space-y-2">
                  {(overallAnalysis.strengths || []).map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{t('analysis.areasForImprovement')}</h3>
                </div>
                <ul className="space-y-2">
                  {(overallAnalysis.weaknesses || []).map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            {overallAnalysis.recommendations && overallAnalysis.recommendations.length > 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">{t('analysis.recommendations')}</h3>
                </div>
                <ul className="space-y-2">
                  {overallAnalysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-blue-800">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Question-by-Question Analysis */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('analysis.questionByQuestion')}</h2>
          
          <div className="space-y-6">
            {questionResponses.map((response, index) => (
              <div key={response.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {t('analysis.question')} {index + 1}
                        </span>
                        {response.response_type === 'video' ? (
                          <Video className="w-4 h-4 text-blue-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-600" />
                        )}
                        {response.question?.is_required && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {response.question?.question_text}
                      </h3>
                    </div>
                    
                    {response.ai_analysis?.score && (
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(response.ai_analysis.score)}`}>
                        {getScoreIcon(response.ai_analysis.score)}
                        <span>{Math.round(response.ai_analysis.score)}</span>
                      </div>
                    )}
                  </div>

                  {/* Response Content */}
                  <div className="mb-4">
                    {response.response_type === 'video' ? (
                      <div>
                        {response.video_url && (
                          <div className="mb-4">
                            <video 
                              controls 
                              className="w-full max-w-md rounded-lg"
                              poster={response.video_thumbnail}
                            >
                              <source src={response.video_url} type="video/webm" />
                              <source src={response.video_url} type="video/mp4" />
                              {t('analysis.videoNotSupported')}
                            </video>
                          </div>
                        )}
                        
                        {response.video_transcript && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{t('analysis.transcript')}</h4>
                              <div className="flex items-center gap-2">
                                <select
                                  value={selectedLanguage}
                                  onChange={(e) => setSelectedLanguage(e.target.value)}
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                >
                                  {languages.map(lang => (
                                    <option key={lang.code} value={lang.code}>
                                      {lang.name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => translateResponse(response.id, [selectedLanguage])}
                                  className="text-blue-600 hover:text-blue-700 p-1"
                                >
                                  <Languages className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {response.translation_data?.translations?.[selectedLanguage]?.transcript || response.video_transcript}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{t('analysis.textResponse')}</h4>
                        <p className="text-gray-700 leading-relaxed">
                          {response.text_response}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI Analysis */}
                  {response.ai_analysis && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">{t('analysis.aiAnalysis')}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Communication Quality */}
                        {response.ai_analysis.communication_quality && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">{t('analysis.communicationQuality')}</h5>
                            <div className="space-y-1">
                              {Object.entries(response.ai_analysis.communication_quality).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-1">
                                      <div 
                                        className="bg-blue-600 h-1 rounded-full"
                                        style={{ width: `${(value / 10) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-gray-700 font-medium">{value}/10</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Keywords Found */}
                        {response.ai_analysis.keywords_found && response.ai_analysis.keywords_found.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">{t('analysis.keywordsFound')}</h5>
                            <div className="flex flex-wrap gap-1">
                              {response.ai_analysis.keywords_found.map((keyword, idx) => (
                                <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Improvement Suggestions */}
                      {response.ai_analysis.improvement_suggestions && response.ai_analysis.improvement_suggestions.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">{t('analysis.improvementSuggestions')}</h5>
                          <ul className="space-y-1">
                            {response.ai_analysis.improvement_suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Lightbulb className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateAnalysisPage;

