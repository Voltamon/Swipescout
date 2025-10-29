import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import themeColors from '@/config/theme-colors-admin';
import { Film } from 'lucide-react';

const AdminVideosPage = () => {
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>Video Management</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            All Platform Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={themeColors.text.secondary}>
            View and manage all videos uploaded to the platform.
            Review content, moderate, and remove inappropriate videos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVideosPage;
