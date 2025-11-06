import React, { useState, useEffect } from 'react';
import { getCareerAdvice } from '../services/api';
import {
  BookOpen,
  Video,
  Users,
  Lightbulb,
  Globe,
  User,
  MessageCircle,
  TrendingUp,
  Briefcase,
  Award,
  Search,
  Clock,
  Eye,
  Heart,
  Share2,
  Play,
  ArrowRight
} from 'lucide-react';

const QuickTipIcons = {
  User,
  MessageCircle,
  TrendingUp,
  Users,
  Lightbulb,
};

const CareerAdvicePage = () => {
  const [adviceData, setAdviceData] = useState({
    articles: [],
    videos: [],
    paths: [],
    tips: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdviceData = async () => {
      try {
        setLoading(true);
        const response = await getCareerAdvice();
        setAdviceData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load career advice content. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdviceData();
  }, []);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);

  const categories = [
    { id: 'all', label: 'جميع المواضيع', icon: Globe },
    { id: 'video-tips', label: 'نصائح الفيديو', icon: Video },
    { id: 'skills', label: 'تطوير المهارات', icon: TrendingUp },
    { id: 'interview', label: 'مقابلات العمل', icon: Users },
    { id: 'career', label: 'التطوير المهني', icon: Briefcase },
    { id: 'salary', label: 'الراتب والمزايا', icon: Award }
  ];

  const handleBookmark = (itemId, type) => {
    const key = `${type}-${itemId}`;
    setBookmarkedItems(prev => 
      prev.includes(key) 
        ? prev.filter(id => id !== key)
        : [...prev, key]
    );
  };

  const isBookmarked = (itemId, type) => {
    return bookmarkedItems.includes(`${type}-${itemId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'مبتدئ': return 'bg-green-100 text-green-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'متقدم': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'عالي جداً': return 'bg-red-100 text-red-800';
      case 'عالي': return 'bg-orange-100 text-orange-800';
      case 'متوسط إلى عالي': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              مركز النصائح المهنية
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              اكتشف أحدث النصائح والاستراتيجيات لتطوير مسيرتك المهنية وتحقيق أهدافك
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ابحث عن النصائح والمقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-full transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {loading && <div className="text-center py-12">Loading content...</div>}
        {error && <div className="text-center py-12 text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            {/* Quick Tips */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">نصائح سريعة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adviceData.tips.map((tip) => {
                  const Icon = QuickTipIcons[tip.metadata.icon] || Lightbulb;
                  return (
                    <div key={tip.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="mr-3 text-sm text-gray-600">{tip.category}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Featured Articles */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">مقالات مميزة</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {adviceData.articles.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={article.metadata.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-yellow-400 text-gray-900 text-sm font-semibold rounded-full">
                          مميز
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(article.metadata.difficulty)}`}>
                          {article.metadata.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {article.category}
                        </span>
                        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Clock className="h-4 w-4" />
                            <span>{article.metadata.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Eye className="h-4 w-4" />
                            <span>{article.metadata.views?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {article.metadata.author?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{article.metadata.author}</p>
                            <p className="text-xs text-gray-500">{article.metadata.authorRole}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <button className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">{article.metadata.likes || 0}</span>
                          </button>
                          <button className="text-gray-600 hover:text-blue-500 transition-colors">
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {article.metadata.tags?.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Tutorials */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">شروحات فيديو</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adviceData.videos.map((video) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={video.metadata.thumbnail}
                        alt={video.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <button className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white hover:bg-opacity-50 transition-all">
                          <Play className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                        {video.metadata.duration}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {video.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(video.metadata.level)}`}>
                          {video.metadata.level}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {video.metadata.instructor?.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-700">{video.metadata.instructor}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">{video.metadata.views?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Paths */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">مسارات مهنية مقترحة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adviceData.paths.map((path) => (
                  <div key={path.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{path.metadata.icon || '💼'}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{path.title}</h3>
                      <p className="text-gray-600 text-sm">{path.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">عدد الخطوات:</span>
                        <span className="font-medium">{path.metadata.steps} خطوات</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">المدة المتوقعة:</span>
                        <span className="font-medium">{path.metadata.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">المستوى:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(path.metadata.difficulty)}`}>
                          {path.metadata.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">الراتب المتوقع:</span>
                        <span className="font-medium text-green-600">{path.metadata.salary}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">الطلب في السوق:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDemandColor(path.metadata.demand)}`}>
                          {path.metadata.demand}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">المهارات المطلوبة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {path.metadata.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedPath(path)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                    >
                      <span>ابدأ المسار</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">اشترك في النشرة الإخبارية</h3>
              <p className="mb-6 opacity-90">
                احصل على أحدث النصائح المهنية والفرص الوظيفية مباشرة في بريدك الإلكتروني
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 px-4 py-2 rounded-md text-gray-900"
                />
                <button className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium">
                  اشترك
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CareerAdvicePage;
