import React, { useEffect, useState } from 'react';
import { getSavedBlogs } from '@/services/api';
import { Card, CardContent } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SavedBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const resp = await getSavedBlogs();
        setBlogs(resp?.data || []);
      } catch (err) {
        console.error('Failed to load saved blogs:', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!blogs.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold mb-4">{t('saved.no_saved', 'No saved posts')}</h2>
      <Button onClick={() => navigate('/blog')}>{t('saved.browse', 'Browse Blogs')}</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">{t('saved.title', 'Saved Posts')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((b) => (
            <Card key={b.id} className="cursor-pointer" onClick={() => navigate(`/blog/${b.id}`)}>
              {b.featuredImage && <img src={b.featuredImage} alt={b.title} className="w-full h-40 object-cover rounded-t-lg" />}
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{b.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedBlogsPage;
