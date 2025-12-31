import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/UI/card.jsx';
import themeColors from '@/config/theme-colors-admin';
import { Film, Trash2, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/UI/table.jsx';
import { Button } from '@/components/UI/button.jsx';
import { getAllVideos, deleteVideo } from '@/services/api';

const AdminVideosPage = () => {
  const { t } = useTranslation('adminVideos');
  const [videos, setVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ title: '', uploader: '' });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      // pass current filters to API helper
      const response = await getAllVideos(1, 50, filters);
      setVideos(response.data.videos || response.data || []);
    } catch (error) {
      // Log detailed server response when available to help diagnose 500 errors
      console.error('Failed to fetch videos:', error.response?.status, error.response?.data || error.message || error);
      setVideos([]);
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    await fetchVideos();
  };

  const handleClearFilters = async () => {
    setFilters({ title: '', uploader: '' });
    await fetchVideos();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete video?')) return;
    try {
      await deleteVideo(id);
      setVideos(videos.filter(v => v.id !== id));
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Failed to delete video');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>{t('title')}</h2>
        <p className={themeColors.text.secondary}>{t('description')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-end">
        <div className="w-64">
          <label className="block text-sm text-gray-600">{i18n.t('auto_title')}</label>
          <input
            type="text"
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder={i18n.t('auto_filter_by_title')} 
          />
        </div>

        <div className="w-64">
          <label className="block text-sm text-gray-600">{i18n.t('auto_uploader')}</label>
          <input
            type="text"
            value={filters.uploader}
            onChange={(e) => handleFilterChange('uploader', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder={i18n.t('auto_filter_by_uploader_name')} 
          />
        </div>

        <div className="flex gap-2 ml-auto">
          <Button size="sm" variant="outline" onClick={handleApplyFilters}>{i18n.t('auto_apply')}</Button>
          <Button size="sm" onClick={handleClearFilters}>{i18n.t('auto_clear')}</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{i18n.t('auto_title')}</TableHead>
                <TableHead>{i18n.t('auto_uploader')}</TableHead>
                <TableHead>{i18n.t('auto_views')}</TableHead>
                <TableHead>{i18n.t('auto_uploaded')}</TableHead>
                <TableHead className="text-right">{i18n.t('auto_actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">{i18n.t('auto_loading_videos')}</TableCell>
                </TableRow>
              ) : errorMessage ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-red-600">{errorMessage}</TableCell>
                </TableRow>
              ) : videos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">{i18n.t('auto_no_videos_found')}</TableCell>
                </TableRow>
              ) : (
                videos.map(video => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title || video.name || 'Untitled'}</TableCell>
                    <TableCell>{video.user ? `${video.user.firstName || ''} ${video.user.lastName || ''}` : video.uploaderName || '-'}</TableCell>
                    <TableCell>{video.viewCount || 0}</TableCell>
                    <TableCell>{video.created_at ? new Date(video.created_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => window.open(`/videos/${video.id}`, '_blank')}>{<Eye className="h-4 w-4" />}</Button>
                        <Button size="sm" className="text-red-600" onClick={() => handleDelete(video.id)}>{<Trash2 className="h-4 w-4" />}</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVideosPage;
