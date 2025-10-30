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
import { getBlog } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await getBlog(slug);
      setBlog(response.data);
      // Fetch related blogs based on category/tags
      // TODO: Implement related blogs API call
    } catch (error) {
      console.error('Failed to fetch blog:', error);
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: getLocalizedField(blog, 'title'),
          text: getLocalizedField(blog, 'excerpt'),
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(t('blog.link_copied', 'Link copied to clipboard!'));
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
                          <Badge key={index} variant="outline">{title}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {blog.relatedSkills?.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">{t('blog.skills', 'Key Skills')}:</p>
                      <div className="flex flex-wrap gap-2">
                        {blog.relatedSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
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
                        {blogTag.tag.name}
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
                <Button variant="outline">
                  <Bookmark className="mr-2 h-4 w-4" />
                  {t('blog.save', 'Save for Later')}
                </Button>
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
                    onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
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
