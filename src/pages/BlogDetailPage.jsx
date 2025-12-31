import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  Calendar,
  Eye,
  Clock,
  User,
  Tag as TagIcon,
  Share2,
  ArrowLeft,
  Bookmark,
} from 'lucide-react';
import localize from '@/utils/localize';
import { toast } from 'react-toastify';
import { getBlog, saveBlog, unsaveBlog, checkBlogSaved } from '@/services/api';
import ReportButton from '@/components/ReportButton.jsx';
import { Card, CardContent } from '@/components/UI/card.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Button } from '@/components/UI/button.jsx';
import ReactMarkdown from 'react-markdown';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
  const response = await getBlog(id);
  setBlog(response.data);
      // Fetch related blogs based on category/tags
      // TODO: Implement related blogs API call
    } catch (error) {
      // Handle 404 (not found) gracefully and avoid noisy object logs
      if (error?.response?.status === 404) {
        console.warn(`Blog not found: ${id}`);
        setBlog(null);
      } else {
        console.error('Failed to fetch blog:', error?.message || error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedField = (item, field) => {
    if (!item) return '';
    const lang = i18n.language;
    if (lang === 'ar' && item[`${field}Ar`]) return item[`${field}Ar`];
    if (lang === 'zh' && item[`${field}Zh`]) return item[`${field}Zh`];
    return item[field] || '';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    // Open the SharePage (centralized share UI) in a new window/tab so the user can choose platform
    try {
      const shareUrl = blog?.canonicalUrl || window.location.href;
      const sharePage = `${window.location.origin}/share?link=${encodeURIComponent(shareUrl)}`;
      window.open(sharePage, '_blank', 'noopener,noreferrer,width=800,height=600');
    } catch (error) {
      console.error('Error opening share page:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t('blog.link_copied', 'Link copied to clipboard!'));
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        toast.error(t('blog.link_copy_failed', 'Failed to copy link'));
      }
    }
  };

  // Save / bookmark handling via API (with localStorage fallback if API fails)
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!blog?.id) return setIsSaved(false);
      try {
        const resp = await checkBlogSaved(blog.id);
        if (resp?.data?.saved) setIsSaved(true);
        else setIsSaved(false);
      } catch (err) {
        // fallback to localStorage when API unreachable
        try {
          const saved = JSON.parse(localStorage.getItem('savedBlogs') || '[]');
          setIsSaved(Array.isArray(saved) ? saved.includes(blog.id) : false);
        } catch (e) {
          setIsSaved(false);
        }
      }
    };
    check();
  }, [blog?.id]);

  const toggleSave = async () => {
    if (!blog?.id) return;
    try {
      if (!isSaved) {
        await saveBlog(blog.id);
        setIsSaved(true);
        toast.success(t('blog.saved_success', 'Saved for later'));
      } else {
        await unsaveBlog(blog.id);
        setIsSaved(false);
        toast.info(t('blog.unsaved', 'Removed from saved'));
      }
    } catch (err) {
      console.error('Error toggling save via API:', err);
      // If user is not authenticated (401) or API returns 403, fallback to local save and inform user
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        try {
          const raw = localStorage.getItem('savedBlogs');
          const arr = raw ? JSON.parse(raw) : [];
          const idx = arr.indexOf(blog.id);
          if (idx === -1) {
            arr.push(blog.id);
            localStorage.setItem('savedBlogs', JSON.stringify(arr));
            setIsSaved(true);
            toast.info(t('blog.saved_local', 'You are not logged in — saved locally'));
          } else {
            arr.splice(idx, 1);
            localStorage.setItem('savedBlogs', JSON.stringify(arr));
            setIsSaved(false);
            toast.info(t('blog.unsaved_local', 'Removed local saved post'));
          }
          return;
        } catch (e) {
          console.error('Local fallback failed:', e);
        }
      }
      // other errors: try previous localStorage fallback behavior
      try {
        const raw = localStorage.getItem('savedBlogs');
        const arr = raw ? JSON.parse(raw) : [];
        const idx = arr.indexOf(blog.id);
        if (idx === -1) {
          arr.push(blog.id);
          localStorage.setItem('savedBlogs', JSON.stringify(arr));
          setIsSaved(true);
          toast.success(t('blog.saved_success', 'Saved for later'));
        } else {
          arr.splice(idx, 1);
          localStorage.setItem('savedBlogs', JSON.stringify(arr));
          setIsSaved(false);
          toast.info(t('blog.unsaved', 'Removed from saved'));
        }
      } catch (e) {
        console.error('Local fallback failed:', e);
        toast.error(t('blog.save_failed', 'Failed to update saved state'));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">{t('blog.not_found', 'Blog post not found')}</h1>
        <Button onClick={() => navigate('/blog')}>
          {t('blog.back_to_list', 'Back to Blog')}
        </Button>
      </div>
    );
  }

  const title = getLocalizedField(blog, 'title');
  const content = getLocalizedField(blog, 'content');
  const excerpt = getLocalizedField(blog, 'excerpt');
  const metaTitle = getLocalizedField(blog, 'metaTitle') || title;
  const metaDescription = getLocalizedField(blog, 'metaDescription') || excerpt;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={blog.metaKeywords?.join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={blog.socialMedia?.ogTitle || metaTitle} />
        <meta property="og:description" content={blog.socialMedia?.ogDescription || metaDescription} />
        <meta property="og:image" content={blog.socialMedia?.ogImage || blog.featuredImage} />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.socialMedia?.twitterTitle || metaTitle} />
        <meta name="twitter:description" content={blog.socialMedia?.twitterDescription || metaDescription} />
        <meta name="twitter:image" content={blog.socialMedia?.twitterImage || blog.featuredImage} />
        
        {/* Canonical URL */}
        {blog.canonicalUrl && <link rel="canonical" href={blog.canonicalUrl} />}
        
        {/* JSON-LD for better SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": excerpt,
            "image": blog.featuredImage,
            "datePublished": blog.publishedAt,
            "dateModified": blog.updatedAt,
            "author": {
              "@type": "Person",
              "name": blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : "SwipeScout Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SwipeScout",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('blog.back_to_list', 'Back to Blog')}
          </Button>

          <Card>
            <CardContent className="p-8">
              {/* Featured Image */}
              {blog.featuredImage && (
                <img
                  src={blog.featuredImage}
                  alt={title}
                  className="w-full h-96 object-cover rounded-lg mb-8"
                />
              )}

              {/* Category Badge */}
              {blog.category && (
                <Badge className="mb-4" style={{ backgroundColor: blog.category.color }}>
                  {getLocalizedField(blog.category, 'name')}
                </Badge>
              )}

              {/* Title */}
              <h1 className="text-4xl font-bold mb-6">{title}</h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{blog.author.firstName} {blog.author.lastName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{blog.readingTime} {t('blog.min_read', 'min read')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{blog.viewCount} {t('blog.views', 'views')}</span>
                </div>
              </div>

              {/* Excerpt */}
              {excerpt && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded">
                  <p className="text-lg text-gray-700 italic">{excerpt}</p>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>

              {/* Related Job Info */}
              {(blog.relatedJobTitles?.length > 0 || blog.relatedSkills?.length > 0) && (
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="font-bold text-lg mb-4">{t('blog.related_careers', 'Related Careers')}</h3>
                  {blog.relatedJobTitles?.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold mb-2">{t('blog.job_titles', 'Relevant Job Titles')}:</p>
                      <div className="flex flex-wrap gap-2">
                        {blog.relatedJobTitles.map((title, index) => (
              <Badge key={title || index} variant="outline">{localize(title)}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {blog.relatedSkills?.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">{t('blog.skills', 'Key Skills')}:</p>
                      <div className="flex flex-wrap gap-2">
                        {blog.relatedSkills.map((skill, index) => (
                          <Badge key={skill || index} variant="secondary">{localize(skill)}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {blog.blogTags?.length > 0 && (
                <div className="flex items-center gap-3 mb-8">
                  <TagIcon className="h-5 w-5 text-gray-500" />
                  <div className="flex flex-wrap gap-2">
                    {blog.blogTags.map((blogTag) => (
                      <Badge
                        key={blogTag.tag.id}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => navigate(`/blog?tag=${blogTag.tag.slug}`)}
                      >
                        {localize(blogTag.tag.name)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8 border-t">
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  {t('blog.share', 'Share')}
                </Button>
                <Button onClick={toggleSave} variant={isSaved ? 'default' : 'outline'}>
                  <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? 'text-white' : ''}`} />
                  {isSaved ? t('blog.saved', 'Saved') : t('blog.save', 'Save for Later')}
                </Button>
                <ReportButton contentType="blog" contentId={blog.id} className="ml-2" />
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">{t('blog.related_articles', 'Related Articles')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Card
                    key={relatedBlog.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/blog/${relatedBlog.id}`)}
                  >
                    {relatedBlog.featuredImage && (
                      <img
                        src={relatedBlog.featuredImage}
                        alt={getLocalizedField(relatedBlog, 'title')}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                    )}
                    <CardContent className="pt-4">
                      <h3 className="font-bold mb-2 line-clamp-2">
                        {getLocalizedField(relatedBlog, 'title')}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {getLocalizedField(relatedBlog, 'excerpt')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
