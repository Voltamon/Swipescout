import React, { useState, useEffect } from 'react';
import { getFeaturedBlogs, getVideosForHomePage, getQuickTips, getCareerPaths } from '../services/api';
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

// Default sample data (used as a fallback until the API returns data)
// These are kept so the page still renders when backend isn't available.
const sampleFeaturedArticles = [
  {
    id: 1,
    title: 'How to Identify Your Ideal Career Path',
    description: 'A short intro to using personality tests to find a good career match.',
    category: 'Career Advice',
    readTime: '8 mins',
    author: 'Sample Author',
    authorRole: 'Career Expert',
    publishedAt: '2024-10-08',
    views: 2450,
    likes: 189,
    image: 'https://via.placeholder.com/400x250/667eea/ffffff?text=Career+Tips',
    tags: ['personality', 'career-growth'],
    featured: true,
    difficulty: 'Intermediate'
  }
];

// (removed original inline multilingual videoTutorials) - using sampleVideoTutorials as fallback

const sampleVideoTutorials = [
  {
    id: 1,
    title: 'Interview Preparation Basics',
    description: 'Short tips to prepare for interviews.',
    duration: '15:30',
    views: 5420,
    instructor: 'Instructor A',
    level: 'Beginner',
    thumbnail: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Interview+Tips',
    category: 'Interview Skills'
  }
];

const careerPaths = [
  {
    id: 1,
    title: 'Front-end Developer',
    description: 'Learn to build web user interfaces using modern frameworks.',
    steps: 6,
    duration: '6-12 months',
    difficulty: 'Beginner to Intermediate',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    salary: '8,000 - 15,000',
    demand: 'High',
    icon: '💻'
  },
  {
    id: 2,
    title: 'Data Analyst',
    description: 'Analyze datasets to extract actionable insights for businesses.',
    steps: 8,
    duration: '8-15 months',
    difficulty: 'Intermediate',
    skills: ['Python', 'SQL', 'Excel', 'Tableau'],
    salary: '10,000 - 18,000',
    demand: 'High',
    icon: '📊'
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    description: 'Design product experiences and interfaces with user-centered methods.',
    steps: 7,
    duration: '4-10 months',
    difficulty: 'Beginner to Intermediate',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    salary: '7,000 - 14,000',
    demand: 'Moderate to High',
    icon: '🎨'
  }
];

const quickTips = [
  {
    id: 1,
    title: 'ط§ط¬ط¹ظ„ ظ…ظ„ظپظƒ ط§ظ„ط´ط®طµظٹ ظٹط¨ط±ط²',
    tip: 'ط§ط³طھط®ط¯ظ… ظƒظ„ظ…ط§طھ ظ…ظپطھط§ط­ظٹط© ط°ط§طھ طµظ„ط© ط¨ظ…ط¬ط§ظ„ظƒ ظپظٹ ظˆطµظپ ظ…ظ„ظپظƒ ط§ظ„ط´ط®طµظٹ',
    category: 'ط§ظ„ظ…ظ„ظپ ط§ظ„ط´ط®طµظٹ',
    icon: User
  },
  {
    id: 2,
    title: 'طھظپط§ط¹ظ„ ظ…ط¹ ط§ظ„ظ…ط­طھظˆظ‰',
    tip: 'ط¹ظ„ظ‚ ط¹ظ„ظ‰ ظ…ظ†ط´ظˆط±ط§طھ ط§ظ„ط´ط±ظƒط§طھ ط§ظ„طھظٹ طھظ‡طھظ… ط¨ط§ظ„ط¹ظ…ظ„ ظ…ط¹ظ‡ط§',
    category: 'ط§ظ„طھظپط§ط¹ظ„',
    icon: MessageCircle
  },
  {
    id: 3,
    title: 'ط­ط¯ط« ظ…ظ‡ط§ط±ط§طھظƒ ط¨ط§ط³طھظ…ط±ط§ط±',
    tip: 'ط®طµطµ 30 ط¯ظ‚ظٹظ‚ط© ظٹظˆظ…ظٹط§ظ‹ ظ„طھط¹ظ„ظ… ظ…ظ‡ط§ط±ط© ط¬ط¯ظٹط¯ط© ط£ظˆ طھط·ظˆظٹط± ظ…ظ‡ط§ط±ط© ظ…ظˆط¬ظˆط¯ط©',
    category: 'ط§ظ„طھط·ظˆظٹط±',
    icon: TrendingUp
  },
  {
    id: 4,
    title: 'ظƒظ† ظ†ط´ط·ط§ظ‹ ظپظٹ ط§ظ„ط´ط¨ظƒط© ط§ظ„ظ…ظ‡ظ†ظٹط©',
    tip: 'ط´ط§ط±ظƒ ظپظٹ ط§ظ„ظپط¹ط§ظ„ظٹط§طھ ط§ظ„ظ…ظ‡ظ†ظٹط© ظˆظˆط±ط´ ط§ظ„ط¹ظ…ظ„ ظپظٹ ظ…ط¬ط§ظ„ظƒ',
    category: 'ط§ظ„ط´ط¨ظƒط© ط§ظ„ظ…ظ‡ظ†ظٹط©',
    icon: Users
  }
];

const CareerAdvicePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [featuredArticlesState, setFeaturedArticlesState] = useState(sampleFeaturedArticles);
  const [videoTutorialsState, setVideoTutorialsState] = useState(sampleVideoTutorials);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickTipsState, setQuickTipsState] = useState(quickTips);
  const [careerPathsState, setCareerPathsState] = useState(careerPaths);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        // Fetch featured blogs (backend returns array)
        const res = await getFeaturedBlogs(6);
        if (mounted && res && res.data) {
          // API returns either object or array depending on controller implementation
          const data = Array.isArray(res.data) ? res.data : (res.data.blogs || res.data);
          if (Array.isArray(data) && data.length) {
            setFeaturedArticlesState(data.map(d => ({
              id: d.id,
              title: d.title,
              description: d.excerpt || d.content?.slice?.(0, 200) || '',
              category: d.categoryName || d.category || (d.categoryId ? 'Article' : ''),
              readTime: d.readingTime || d.readTime || `${d.readingTime || 8} mins`,
              author: d.authorName || d.author || 'Author',
              authorRole: d.authorRole || '',
              publishedAt: d.publishedAt,
              views: d.views || d.viewCount || 0,
              likes: d.likes || 0,
              image: d.image || d.thumbnail || 'https://via.placeholder.com/400x250/667eea/ffffff?text=Career+Tips',
              tags: d.tags || [],
              featured: d.featured || false,
              difficulty: d.difficulty || 'Intermediate'
            })));
          }
        }

        // Fetch videos for home page
        const vRes = await getVideosForHomePage();
        if (mounted && vRes && vRes.data) {
          const videos = vRes.data.videos || (Array.isArray(vRes.data) ? vRes.data : []);
          if (Array.isArray(videos) && videos.length) {
            setVideoTutorialsState(videos.map(v => ({
              id: v.id,
              title: v.title || v.video_title || v.videoTitle || 'Video',
              description: v.description || v.excerpt || '',
              duration: v.duration || v.videoDuration || '0:30',
              views: v.views || v.viewCount || 0,
              instructor: v.userDisplayName || v.uploader || 'Instructor',
              level: v.level || 'Beginner',
              thumbnail: v.secure_url || v.thumbnail || 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Video',
              category: v.category || 'Video'
            })));
          }
        }

        // fetch quick tips & career paths in parallel
        try {
          const [tipsRes, pathsRes] = await Promise.all([getQuickTips(8), getCareerPaths(12)]);
          if (mounted && tipsRes?.data) {
            setQuickTipsState(Array.isArray(tipsRes.data.tips) ? tipsRes.data.tips : (tipsRes.data || []));
          }
          if (mounted && pathsRes?.data) {
            setCareerPathsState(Array.isArray(pathsRes.data.paths) ? pathsRes.data.paths : (pathsRes.data || []));
          }
        } catch (innerErr) {
          console.warn('Failed to load quick tips / career paths', innerErr);
        }

        setError(null);
      } catch (err) {
        console.error('Failed to load career advice data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => { mounted = false; };
  }, []);

  const categories = [
    { id: 'all', label: 'ط¬ظ…ظٹط¹ ط§ظ„ظ…ظˆط§ط¶ظٹط¹', icon: Globe },
    { id: 'video-tips', label: 'ظ†طµط§ط¦ط­ ط§ظ„ظپظٹط¯ظٹظˆ', icon: Video },
    { id: 'skills', label: 'طھط·ظˆظٹط± ط§ظ„ظ…ظ‡ط§ط±ط§طھ', icon: TrendingUp },
    { id: 'interview', label: 'ظ…ظ‚ط§ط¨ظ„ط§طھ ط§ظ„ط¹ظ…ظ„', icon: Users },
    { id: 'career', label: 'ط§ظ„طھط·ظˆظٹط± ط§ظ„ظ…ظ‡ظ†ظٹ', icon: Briefcase },
    { id: 'salary', label: 'ط§ظ„ط±ط§طھط¨ ظˆط§ظ„ظ…ط²ط§ظٹط§', icon: Award }
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
      case 'ظ…ط¨طھط¯ط¦': return 'bg-green-100 text-green-800';
      case 'ظ…طھظˆط³ط·': return 'bg-yellow-100 text-yellow-800';
      case 'ظ…طھظ‚ط¯ظ…': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'ط¹ط§ظ„ظٹ ط¬ط¯ط§ظ‹': return 'bg-red-100 text-red-800';
      case 'ط¹ط§ظ„ظٹ': return 'bg-orange-100 text-orange-800';
      case 'ظ…طھظˆط³ط· ط¥ظ„ظ‰ ط¹ط§ظ„ظٹ': return 'bg-yellow-100 text-yellow-800';
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
              ظ…ط±ظƒط² ط§ظ„ظ†طµط§ط¦ط­ ط§ظ„ظ…ظ‡ظ†ظٹط©
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              ط§ظƒطھط´ظپ ط£ط­ط¯ط« ط§ظ„ظ†طµط§ط¦ط­ ظˆط§ظ„ط§ط³طھط±ط§طھظٹط¬ظٹط§طھ ظ„طھط·ظˆظٹط± ظ…ط³ظٹط±طھظƒ ط§ظ„ظ…ظ‡ظ†ظٹط© ظˆطھط­ظ‚ظٹظ‚ ط£ظ‡ط¯ط§ظپظƒ
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ط§ط¨ط­ط« ط¹ظ† ط§ظ„ظ†طµط§ط¦ط­ ظˆط§ظ„ظ…ظ‚ط§ظ„ط§طھ..."
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
            ظ†طµط§ط¦ط­ ط³ط±ظٹط¹ط© ظ„طھط·ظˆظٹط± ظ…ط³ظٹط±طھظƒ ط§ظ„ظ…ظ‡ظ†ظٹط©
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTipsState.map((tip) => {
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
            <h2 className="text-2xl font-bold text-gray-900">ط§ظ„ظ…ظ‚ط§ظ„ط§طھ ط§ظ„ظ…ظ…ظٹط²ط©</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 space-x-reverse">
              <span>ط¹ط±ط¶ ط§ظ„ظƒظ„</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredArticlesState.map((article) => (
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
            <h2 className="text-2xl font-bold text-gray-900">ط¯ط±ظˆط³ ط§ظ„ظپظٹط¯ظٹظˆ</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 space-x-reverse">
              <span>ط¹ط±ط¶ ط§ظ„ظƒظ„</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorialsState.map((video) => (
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ط§ظ„ظ…ط³ط§ط±ط§طھ ط§ظ„ظ…ظ‡ظ†ظٹط©</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ط§ط®طھط± ط§ظ„ظ…ط³ط§ط± ط§ظ„ظ…ظ‡ظ†ظٹ ط§ظ„ط°ظٹ ظٹظ†ط§ط³ط¨ ط§ظ‡طھظ…ط§ظ…ط§طھظƒ ظˆط§ط¨ط¯ط£ ط±ط­ظ„طھظƒ ظ†ط­ظˆ ط§ظ„ظ†ط¬ط§ط­ ط§ظ„ظ…ظ‡ظ†ظٹ
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerPathsState.map((path) => (
              <div key={path.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{path.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{path.title}</h3>
                  <p className="text-gray-600 text-sm">{path.description}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">ط¹ط¯ط¯ ط§ظ„ط®ط·ظˆط§طھ:</span>
                    <span className="font-medium">{path.steps} ط®ط·ظˆط§طھ</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">ط§ظ„ظ…ط¯ط© ط§ظ„ظ…طھظˆظ‚ط¹ط©:</span>
                    <span className="font-medium">{path.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">ط§ظ„ظ…ط³طھظˆظ‰:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">ط§ظ„ط±ط§طھط¨ ط§ظ„ظ…طھظˆظ‚ط¹:</span>
                    <span className="font-medium text-green-600">{path.salary}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">ط§ظ„ط·ظ„ط¨ ظپظٹ ط§ظ„ط³ظˆظ‚:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDemandColor(path.demand)}`}>
                      {path.demand}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">ط§ظ„ظ…ظ‡ط§ط±ط§طھ ط§ظ„ظ…ط·ظ„ظˆط¨ط©:</h4>
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
                  <span>ط§ط¨ط¯ط£ ط§ظ„ظ…ط³ط§ط±</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">ط§ط´طھط±ظƒ ظپظٹ ط§ظ„ظ†ط´ط±ط© ط§ظ„ط¥ط®ط¨ط§ط±ظٹط©</h3>
          <p className="mb-6 opacity-90">
            ط§ط­طµظ„ ط¹ظ„ظ‰ ط£ط­ط¯ط« ط§ظ„ظ†طµط§ط¦ط­ ط§ظ„ظ…ظ‡ظ†ظٹط© ظˆط§ظ„ظپط±طµ ط§ظ„ظˆط¸ظٹظپظٹط© ظ…ط¨ط§ط´ط±ط© ظپظٹ ط¨ط±ظٹط¯ظƒ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="ط¨ط±ظٹط¯ظƒ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ"
              className="flex-1 px-4 py-2 rounded-md text-gray-900"
            />
            <button className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium">
              ط§ط´طھط±ظƒ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAdvicePage;
