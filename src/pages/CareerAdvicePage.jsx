import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  Users,
  TrendingUp,
  Award,
  Target,
  Clock,
  Star,
  Play,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  ChevronRight,
  User,
  Calendar,
  Eye,
  ThumbsUp,
  MessageCircle,
  Lightbulb,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle,
  ArrowRight,
  Heart,
  Coffee,
  Zap,
  Globe
} from 'lucide-react';

// Sample data for career advice content
const featuredArticles = [
  {
    id: 1,
    title: 'كيفية إنشاء فيديو تعريفي مؤثر في 2024',
    description: 'دليل شامل لإنشاء فيديو تعريفي يجذب انتباه أصحاب العمل ويبرز مهاراتك بأفضل شكل ممكن.',
    category: 'إنشاء المحتوى',
    readTime: '8 دقائق',
    author: 'سارة أحمد',
    authorRole: 'خبيرة التوظيف',
    publishedAt: '2024-10-08',
    views: 2450,
    likes: 189,
    image: 'https://via.placeholder.com/400x250/667eea/ffffff?text=Video+Tips',
    tags: ['فيديو', 'سيرة ذاتية', 'تسويق شخصي'],
    featured: true,
    difficulty: 'مبتدئ'
  },
  {
    id: 2,
    title: 'أهم المهارات التقنية المطلوبة في 2024',
    description: 'تعرف على أكثر المهارات التقنية طلباً في سوق العمل وكيفية تطويرها لتحسين فرصك المهنية.',
    category: 'تطوير المهارات',
    readTime: '12 دقيقة',
    author: 'أحمد محمد',
    authorRole: 'مطور أول',
    publishedAt: '2024-10-07',
    views: 3120,
    likes: 267,
    image: 'https://via.placeholder.com/400x250/4ecdc4/ffffff?text=Tech+Skills',
    tags: ['مهارات تقنية', 'برمجة', 'تطوير مهني'],
    featured: true,
    difficulty: 'متوسط'
  },
  {
    id: 3,
    title: 'استراتيجيات التفاوض على الراتب',
    description: 'نصائح عملية للتفاوض على راتب أفضل وحزمة مزايا مناسبة عند التقدم لوظيفة جديدة.',
    category: 'التفاوض المهني',
    readTime: '10 دقائق',
    author: 'فاطمة علي',
    authorRole: 'مستشارة مهنية',
    publishedAt: '2024-10-06',
    views: 1890,
    likes: 156,
    image: 'https://via.placeholder.com/400x250/96ceb4/ffffff?text=Salary+Tips',
    tags: ['راتب', 'تفاوض', 'مقابلة عمل'],
    featured: true,
    difficulty: 'متقدم'
  }
];

const videoTutorials = [
  {
    id: 1,
    title: 'كيفية تحضير مقابلة العمل المثالية',
    description: 'شرح مفصل لأهم النصائح والاستراتيجيات للنجاح في مقابلات العمل',
    duration: '15:30',
    views: 5420,
    instructor: 'خالد العلي',
    level: 'مبتدئ',
    thumbnail: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Interview+Tips',
    category: 'مقابلات العمل'
  },
  {
    id: 2,
    title: 'بناء الشبكة المهنية الفعالة',
    description: 'تعلم كيفية بناء علاقات مهنية قوية تساعدك في تطوير مسيرتك المهنية',
    duration: '22:45',
    views: 3890,
    instructor: 'مريم سالم',
    level: 'متوسط',
    thumbnail: 'https://via.placeholder.com/300x200/45b7d1/ffffff?text=Networking',
    category: 'التطوير المهني'
  },
  {
    id: 3,
    title: 'إدارة الوقت للمحترفين',
    description: 'استراتيجيات عملية لإدارة الوقت وزيادة الإنتاجية في بيئة العمل',
    duration: '18:20',
    views: 2760,
    instructor: 'يوسف حسن',
    level: 'متوسط',
    thumbnail: 'https://via.placeholder.com/300x200/feca57/ffffff?text=Time+Management',
    category: 'الإنتاجية'
  }
];

const careerPaths = [
  {
    id: 1,
    title: 'مطور الواجهات الأمامية',
    description: 'مسار مهني شامل لتصبح مطور واجهات أمامية محترف',
    steps: 6,
    duration: '6-12 شهر',
    difficulty: 'مبتدئ إلى متوسط',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js'],
    salary: '8,000 - 15,000 ريال',
    demand: 'عالي',
    icon: '💻'
  },
  {
    id: 2,
    title: 'محلل البيانات',
    description: 'تعلم تحليل البيانات واستخراج الرؤى القيمة للشركات',
    steps: 8,
    duration: '8-15 شهر',
    difficulty: 'متوسط',
    skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics'],
    salary: '10,000 - 18,000 ريال',
    demand: 'عالي جداً',
    icon: '📊'
  },
  {
    id: 3,
    title: 'مصمم UX/UI',
    description: 'مسار لتصبح مصمم تجربة ومظهر المستخدم محترف',
    steps: 7,
    duration: '4-10 شهر',
    difficulty: 'مبتدئ إلى متوسط',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    salary: '7,000 - 14,000 ريال',
    demand: 'متوسط إلى عالي',
    icon: '🎨'
  }
];

const quickTips = [
  {
    id: 1,
    title: 'اجعل ملفك الشخصي يبرز',
    tip: 'استخدم كلمات مفتاحية ذات صلة بمجالك في وصف ملفك الشخصي',
    category: 'الملف الشخصي',
    icon: User
  },
  {
    id: 2,
    title: 'تفاعل مع المحتوى',
    tip: 'علق على منشورات الشركات التي تهتم بالعمل معها',
    category: 'التفاعل',
    icon: MessageCircle
  },
  {
    id: 3,
    title: 'حدث مهاراتك باستمرار',
    tip: 'خصص 30 دقيقة يومياً لتعلم مهارة جديدة أو تطوير مهارة موجودة',
    category: 'التطوير',
    icon: TrendingUp
  },
  {
    id: 4,
    title: 'كن نشطاً في الشبكة المهنية',
    tip: 'شارك في الفعاليات المهنية وورش العمل في مجالك',
    category: 'الشبكة المهنية',
    icon: Users
  }
];

const CareerAdvicePage = () => {
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

        {/* Quick Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            نصائح سريعة لتطوير مسيرتك المهنية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div key={tip.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="mr-3 text-sm text-gray-600">{tip.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.tip}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Articles */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">المقالات المميزة</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 space-x-reverse">
              <span>عرض الكل</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleBookmark(article.id, 'article')}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      {isBookmarked(article.id, 'article') ? (
                        <BookmarkCheck className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Bookmark className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(article.difficulty)}`}>
                      {article.difficulty}
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
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Eye className="h-4 w-4" />
                        <span>{article.views.toLocaleString()}</span>
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
                        {article.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{article.author}</p>
                        <p className="text-xs text-gray-500">{article.authorRole}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <button className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-red-500 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{article.likes}</span>
                      </button>
                      <button className="text-gray-600 hover:text-blue-500 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">دروس الفيديو</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 space-x-reverse">
              <span>عرض الكل</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors">
                      <Play className="h-6 w-6 text-gray-900" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {video.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(video.level)}`}>
                      {video.level}
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
                        {video.instructor.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700">{video.instructor}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{video.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Paths */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المسارات المهنية</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اختر المسار المهني الذي يناسب اهتماماتك وابدأ رحلتك نحو النجاح المهني
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerPaths.map((path) => (
              <div key={path.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{path.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{path.title}</h3>
                  <p className="text-gray-600 text-sm">{path.description}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">عدد الخطوات:</span>
                    <span className="font-medium">{path.steps} خطوات</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">المدة المتوقعة:</span>
                    <span className="font-medium">{path.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">المستوى:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الراتب المتوقع:</span>
                    <span className="font-medium text-green-600">{path.salary}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الطلب في السوق:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDemandColor(path.demand)}`}>
                      {path.demand}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">المهارات المطلوبة:</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill, index) => (
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
      </div>
    </div>
  );
};

export default CareerAdvicePage;
