import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Calendar,
  Eye,
  Tag as TagIcon,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { getBlogs, getBlogCategories, getBlogTags } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Button } from '@/components/UI/button.jsx';
import localize from '@/utils/localize';
import Header from '../components/Headers/Header';
import Footer from '../components/Headers/Footer';

const PublicBlogPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchTags();
  }, [searchTerm, selectedCategory, selectedTag, page, i18n.language]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await getBlogs({
        status: 'published',
        search: searchTerm,
        category: selectedCategory,
        tag: selectedTag,
        page,
        limit: 12,
      });
      setBlogs(response.data.blogs || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getBlogCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await getBlogTags();
      setTags(response.data.slice(0, 20) || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
    updateSearchParams({ search: value });
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setPage(1);
    updateSearchParams({ category });
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
    setPage(1);
    updateSearchParams({ tag });
  };

  const updateSearchParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const getLocalizedField = (item, field) => {
    const lang = i18n.language;
    if (lang === 'ar' && item[`${field}Ar`]) return item[`${field}Ar`];
    if (lang === 'zh' && item[`${field}Zh`]) return item[`${field}Zh`];
    return item[field];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const featuredBlogs = blogs.filter((blog) => blog.featured).slice(0, 3);
  const regularBlogs = blogs.filter((blog) => !blog.featured);

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            {t('blog.title', 'Career Insights & Advice')}
          </h1>
          <p className="text-xl text-center mb-8 opacity-90">
            {t('blog.subtitle', 'Expert guidance for your career journey')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t('blog.search_placeholder', 'Search articles...')}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 py-6 text-lg bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Categories */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {t('blog.categories', 'Categories')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={!selectedCategory ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleCategoryFilter('')}
                  >
                    {t('blog.all_categories', 'All Categories')}
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.slug ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => handleCategoryFilter(category.slug)}
                    >
                      {getLocalizedField(category, 'name')}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TagIcon className="h-5 w-5" />
                  {t('blog.popular_tags', 'Popular Tags')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.tag ?? tag.id}
                      variant={selectedTag === (tag.tag ?? tag.id) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleTagFilter((tag.tag ?? tag.id) === selectedTag ? '' : (tag.tag ?? tag.id))}
                    >
                      {tag.tag ?? tag.name ?? tag.id} ({tag.count ?? ''})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Featured Posts */}
            {featuredBlogs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  {t('blog.featured', 'Featured Articles')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredBlogs.map((blog) => (
                    <Card
                      key={blog.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/blog/${blog.id}`)}
                    >
                      {blog.featuredImage && (
                        <img
                          src={blog.featuredImage}
                          alt={getLocalizedField(blog, 'title')}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <CardContent className="pt-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">
                          {getLocalizedField(blog, 'title')}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {getLocalizedField(blog, 'excerpt')}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(blog.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {blog.views || 0}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : regularBlogs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {regularBlogs.map((blog) => (
                    <Card
                      key={blog.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/blog/${blog.id}`)}
                    >
                      {blog.featuredImage && (
                        <img
                          src={blog.featuredImage}
                          alt={getLocalizedField(blog, 'title')}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <CardContent className="pt-4">
                        {blog.category && (
                          <Badge className="mb-2">{localize(blog.category.name)}</Badge>
                        )}
                        <h3 className="font-bold text-xl mb-2 line-clamp-2">
                          {getLocalizedField(blog, 'title')}
                        </h3>
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {getLocalizedField(blog, 'excerpt')}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(blog.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {blog.viewCount || 0} {t('blog.views', 'views')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      {t('blog.previous', 'Previous')}
                    </Button>
                    <span className="flex items-center px-4">
                      {t('blog.page_of', 'Page {{page}} of {{total}}', { page, total: totalPages })}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      {t('blog.next', 'Next')}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    {t('blog.no_results', 'No articles found matching your criteria')}
                  </p>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default PublicBlogPage;
