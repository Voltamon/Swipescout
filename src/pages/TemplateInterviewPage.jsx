import React, { useContext, useState, useEffect, useRef  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Send, 
  Clock, 
  Video, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const TemplateInterviewPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [template, setTemplate] = useState(null);
  const [templateResponse, setTemplateResponse] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [responses, setResponses] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const questionTimerRef = useRef(null);

  useEffect(() => {
    fetchTemplate();
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai/templates/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplate(data.data);
        
        // Initialize responses object
        const initialResponses = {};
        data.data.questions.forEach(question => {
          initialResponses[question.id] = null;
        });
        setResponses(initialResponses);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/ai/templates/users/${userId}/templates/${templateId}/responses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplateResponse(data.data);
        setInterviewStarted(true);
        
        // Start overall timer if template has time limit
        if (template.settings?.timeLimit) {
          setTimeRemaining(template.settings.timeLimit * 60);
          timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
              if (prev <= 1) {
                handleSubmitInterview();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      return false;
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      const cameraReady = await setupCamera();
      if (!cameraReady) return;
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        setHasRecorded(true);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start recording timer
      const recordingTimer = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          const currentQuestion = template.questions[currentQuestionIndex];
          if (currentQuestion.time_limit && newTime >= currentQuestion.time_limit) {
            stopRecording();
            clearInterval(recordingTimer);
          }
          return newTime;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const retakeRecording = () => {
    setRecordedBlob(null);
    setHasRecorded(false);
    setRecordingTime(0);
    setShowPreview(false);
  };

  const saveQuestionResponse = async () => {
    try {
      setIsSubmitting(true);
      const currentQuestion = template.questions[currentQuestionIndex];
      
      let responseData = {
        question_id: currentQuestion.id,
        template_response_id: templateResponse.id,
        response_type: currentQuestion.question_type
      };

      if (currentQuestion.question_type === 'video' && recordedBlob) {
        // Upload video file
        const formData = new FormData();
        formData.append('video', recordedBlob, `response_${currentQuestion.id}.webm`);
        formData.append('questionId', currentQuestion.id);
        formData.append('templateResponseId', templateResponse.id);
        
        const uploadResponse = await fetch('/api/upload/video-response', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          responseData.video_url = uploadData.videoUrl;
          responseData.duration = recordingTime;
        }
      } else if (currentQuestion.question_type === 'text') {
        responseData.text_response = textResponse;
      }

      const response = await fetch('/api/ai/templates/responses/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(responseData)
      });

      if (response.ok) {
        const data = await response.json();
        setResponses(prev => ({
          ...prev,
          [currentQuestion.id]: data.data
        }));
        
        // Move to next question or finish
        if (currentQuestionIndex < template.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          resetQuestionState();
        } else {
          // All questions answered, submit interview
          await handleSubmitInterview();
        }
      }
    } catch (error) {
      console.error('Error saving response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitInterview = async () => {
    try {
      if (templateResponse) {
        const response = await fetch(`/api/ai/templates/responses/${templateResponse.id}/submit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          navigate('/interview-complete', { 
            state: { 
              templateId, 
              responseId: templateResponse.id,
              templateTitle: template.title 
            } 
          });
        }
      }
    } catch (error) {
      console.error('Error submitting interview:', error);
    }
  };

  const resetQuestionState = () => {
    setRecordedBlob(null);
    setHasRecorded(false);
    setRecordingTime(0);
    setShowPreview(false);
    setTextResponse('');
    setIsRecording(false);
    setIsPaused(false);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      resetQuestionState();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('interview.templateNotFound')}
          </h2>
          <button
            onClick={() => navigate('/templates')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('interview.backToTemplates')}
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = template.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / template.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {!interviewStarted ? (
        // Interview Introduction
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {template.title}
              </h1>
              {template.description && (
                <p className="text-gray-600 text-lg mb-6">
                  {template.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {template.questions.length} {t('interview.questions')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('interview.questionsToAnswer')}
                </p>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {template.settings?.timeLimit || 30} {t('interview.minutes')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('interview.totalTime')}
                </p>
              </div>
              <div className="text-center">
                <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('interview.videoResponses')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('interview.recordYourAnswers')}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h4 className="font-semibold text-blue-900 mb-2">
                {t('interview.instructions')}
              </h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>â€¢ {t('interview.instruction1')}</li>
                <li>â€¢ {t('interview.instruction2')}</li>
                <li>â€¢ {t('interview.instruction3')}</li>
                <li>â€¢ {t('interview.instruction4')}</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={startInterview}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                {t('interview.startInterview')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Interview Interface
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {template.title}
                </h1>
                <p className="text-gray-600">
                  {t('interview.question')} {currentQuestionIndex + 1} {t('interview.of')} {template.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {timeRemaining !== null && (
                  <div className="flex items-center gap-2 text-red-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-semibold">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">
                    {t('interview.progress')}
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {currentQuestion.question_type === 'video' ? (
                    <Video className="w-5 h-5 text-blue-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {t(`interview.${currentQuestion.question_type}Question`)}
                  </span>
                  {currentQuestion.is_required && (
                    <span className="text-red-500 text-sm">*</span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentQuestion.question_text}
                </h2>
                {currentQuestion.time_limit && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {t('interview.timeLimit')}: {currentQuestion.time_limit} {t('interview.seconds')}
                    </span>
                  </div>
                )}
              </div>

              {/* Text Response */}
              {currentQuestion.question_type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('interview.yourAnswer')}
                  </label>
                  <textarea
                    value={textResponse}
                    onChange={(e) => setTextResponse(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('interview.typeYourAnswer')}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('interview.previous')}
                </button>

                <button
                  onClick={saveQuestionResponse}
                  disabled={
                    isSubmitting || 
                    (currentQuestion.question_type === 'video' && !hasRecorded) ||
                    (currentQuestion.question_type === 'text' && !textResponse.trim())
                  }
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {currentQuestionIndex === template.questions.length - 1 
                        ? t('interview.submitInterview') 
                        : t('interview.nextQuestion')
                      }
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Video Recording Panel */}
            {currentQuestion.question_type === 'video' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('interview.recordYourResponse')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t('interview.recordingInstructions')}
                  </p>
                </div>

                {/* Video Preview */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                  )}

                  {/* Preview Controls */}
                  {hasRecorded && showPreview && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center">
                        <button
                          onClick={() => setShowPreview(false)}
                          className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {t('interview.backToCamera')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recording Controls */}
                <div className="flex justify-center gap-3 mb-4">
                  {!isRecording && !hasRecorded && (
                    <button
                      onClick={startRecording}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Video className="w-5 h-5" />
                      {t('interview.startRecording')}
                    </button>
                  )}

                  {isRecording && !isPaused && (
                    <>
                      <button
                        onClick={pauseRecording}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                      >
                        <Pause className="w-4 h-4" />
                        {t('interview.pause')}
                      </button>
                      <button
                        onClick={stopRecording}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <Square className="w-4 h-4" />
                        {t('interview.stop')}
                      </button>
                    </>
                  )}

                  {isRecording && isPaused && (
                    <>
                      <button
                        onClick={resumeRecording}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        {t('interview.resume')}
                      </button>
                      <button
                        onClick={stopRecording}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <Square className="w-4 h-4" />
                        {t('interview.stop')}
                      </button>
                    </>
                  )}

                  {hasRecorded && (
                    <>
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPreview ? t('interview.hidePreview') : t('interview.preview')}
                      </button>
                      <button
                        onClick={retakeRecording}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        {t('interview.retake')}
                      </button>
                    </>
                  )}
                </div>

                {/* Recording Status */}
                {hasRecorded && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        {t('interview.recordingComplete')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {t('interview.duration')}: {formatTime(recordingTime)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateInterviewPage;

