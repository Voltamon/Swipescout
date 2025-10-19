import React, { useContext, useState, useEffect  } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Settings, 
  Video, 
  FileText, 
  Clock, 
  Users,
  BarChart3,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  Save,
  X
} from 'lucide-react';

const TemplateManagementPage = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedTemplate, setExpandedTemplate] = useState(null);

  // Form states
  const [templateForm, setTemplateForm] = useState({
    title: '',
    description: '',
    category: 'general',
    is_public: false,
    settings: {
      timeLimit: 30,
      allowRetakes: true,
      randomizeQuestions: false
    },
    questions: []
  });

  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    question_type: 'text',
    is_required: true,
    time_limit: 120,
    settings: {
      allowMultipleAttempts: true,
      expectedDuration: 60
    },
    ai_analysis_criteria: {
      keywords: [],
      topics: [],
      skills: [],
      weight: 1
    }
  });

  const categories = [
    { value: 'general', label: t('templates.categories.general') },
    { value: 'technical', label: t('templates.categories.technical') },
    { value: 'behavioral', label: t('templates.categories.behavioral') },
    { value: 'custom', label: t('templates.categories.custom') }
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/ai/templates/users/${userId}/templates`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/ai/templates/users/${userId}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(templateForm)
      });

      if (response.ok) {
        await fetchTemplates();
        setShowCreateModal(false);
        resetTemplateForm();
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleUpdateTemplate = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/ai/templates/${selectedTemplate.id}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(templateForm)
      });

      if (response.ok) {
        await fetchTemplates();
        setShowEditModal(false);
        setSelectedTemplate(null);
        resetTemplateForm();
      }
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm(t('templates.confirmDelete'))) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/ai/templates/${templateId}/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          await fetchTemplates();
        }
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleAddQuestion = () => {
    setTemplateForm(prev => ({
      ...prev,
      questions: [...prev.questions, { ...questionForm, order_index: prev.questions.length }]
    }));
    resetQuestionForm();
  };

  const handleRemoveQuestion = (index) => {
    setTemplateForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      title: '',
      description: '',
      category: 'general',
      is_public: false,
      settings: {
        timeLimit: 30,
        allowRetakes: true,
        randomizeQuestions: false
      },
      questions: []
    });
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      question_text: '',
      question_type: 'text',
      is_required: true,
      time_limit: 120,
      settings: {
        allowMultipleAttempts: true,
        expectedDuration: 60
      },
      ai_analysis_criteria: {
        keywords: [],
        topics: [],
        skills: [],
        weight: 1
      }
    });
  };

  const openEditModal = (template) => {
    setSelectedTemplate(template);
    setTemplateForm({
      title: template.title,
      description: template.description,
      category: template.category,
      is_public: template.is_public,
      settings: template.settings || {
        timeLimit: 30,
        allowRetakes: true,
        randomizeQuestions: false
      },
      questions: template.questions || []
    });
    setShowEditModal(true);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('templates.title')}
          </h1>
          <p className="text-gray-600">
            {t('templates.subtitle')}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('templates.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('templates.allCategories')}</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('templates.createNew')}
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                {/* Template Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {template.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                      {t(`templates.status.${template.status}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => openEditModal(template)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Template Description */}
                {template.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>
                )}

                {/* Template Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{template.question_count || 0} {t('templates.questions')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{template.usage_count || 0} {t('templates.responses')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{template.settings?.timeLimit || 30} {t('templates.minutes')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4" />
                    <span>{template.category}</span>
                  </div>
                </div>

                {/* Template Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {t('templates.preview')}
                  </button>
                  <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2">
                    <Copy className="w-4 h-4" />
                    {t('templates.duplicate')}
                  </button>
                </div>

                {/* Expanded Questions Preview */}
                {expandedTemplate === template.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">{t('templates.questions')}</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {template.questions?.map((question, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-gray-400 mt-0.5">{index + 1}.</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {question.question_type === 'video' ? (
                                <Video className="w-3 h-3 text-blue-600" />
                              ) : (
                                <FileText className="w-3 h-3 text-gray-600" />
                              )}
                              {question.is_required && (
                                <span className="text-red-500 text-xs">*</span>
                              )}
                            </div>
                            <p className="text-gray-700 line-clamp-2">{question.question_text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('templates.noTemplates')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('templates.noTemplatesDescription')}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('templates.createFirst')}
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Template Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {showCreateModal ? t('templates.createNew') : t('templates.editTemplate')}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedTemplate(null);
                    resetTemplateForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('templates.basicInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('templates.templateTitle')} *
                    </label>
                    <input
                      type="text"
                      value={templateForm.title}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('templates.titlePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('templates.category')}
                    </label>
                    <select
                      value={templateForm.category}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('templates.description')}
                  </label>
                  <textarea
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('templates.descriptionPlaceholder')}
                  />
                </div>
              </div>

              {/* Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('templates.settings')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('templates.timeLimit')} ({t('templates.minutes')})
                    </label>
                    <input
                      type="number"
                      value={templateForm.settings.timeLimit}
                      onChange={(e) => setTemplateForm(prev => ({
                        ...prev,
                        settings: { ...prev.settings, timeLimit: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="180"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowRetakes"
                      checked={templateForm.settings.allowRetakes}
                      onChange={(e) => setTemplateForm(prev => ({
                        ...prev,
                        settings: { ...prev.settings, allowRetakes: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowRetakes" className="ml-2 text-sm text-gray-700">
                      {t('templates.allowRetakes')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={templateForm.is_public}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, is_public: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                      {t('templates.makePublic')}
                    </label>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('templates.questions')}</h3>
                  <span className="text-sm text-gray-600">
                    {templateForm.questions.length} {t('templates.questionsCount')}
                  </span>
                </div>

                {/* Question List */}
                <div className="space-y-3 mb-4">
                  {templateForm.questions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              {t('templates.question')} {index + 1}
                            </span>
                            {question.question_type === 'video' ? (
                              <Video className="w-4 h-4 text-blue-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-600" />
                            )}
                            {question.is_required && (
                              <span className="text-red-500 text-xs">*</span>
                            )}
                          </div>
                          <p className="text-gray-700">{question.question_text}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{t('templates.timeLimit')}: {question.time_limit}s</span>
                            <span>{t('templates.type')}: {question.question_type}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveQuestion(index)}
                          className="text-red-500 hover:text-red-700 ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Question Form */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-3">{t('templates.addQuestion')}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('templates.questionText')} *
                      </label>
                      <textarea
                        value={questionForm.question_text}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('templates.questionPlaceholder')}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('templates.questionType')}
                        </label>
                        <select
                          value={questionForm.question_type}
                          onChange={(e) => setQuestionForm(prev => ({ ...prev, question_type: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="text">{t('templates.textQuestion')}</option>
                          <option value="video">{t('templates.videoQuestion')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('templates.timeLimit')} ({t('templates.seconds')})
                        </label>
                        <input
                          type="number"
                          value={questionForm.time_limit}
                          onChange={(e) => setQuestionForm(prev => ({ ...prev, time_limit: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="30"
                          max="600"
                        />
                      </div>
                      <div className="flex items-center pt-6">
                        <input
                          type="checkbox"
                          id="isRequired"
                          checked={questionForm.is_required}
                          onChange={(e) => setQuestionForm(prev => ({ ...prev, is_required: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isRequired" className="ml-2 text-sm text-gray-700">
                          {t('templates.required')}
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={handleAddQuestion}
                      disabled={!questionForm.question_text.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t('templates.addQuestion')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedTemplate(null);
                  resetTemplateForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={showCreateModal ? handleCreateTemplate : handleUpdateTemplate}
                disabled={!templateForm.title.trim() || templateForm.questions.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {showCreateModal ? t('templates.create') : t('templates.update')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManagementPage;

