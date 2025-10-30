import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import themeColors from '@/config/theme-colors-admin';
import { BarChart3 } from 'lucide-react';

const AdminAnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>Platform Analytics</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detailed Analytics Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={themeColors.text.secondary}>
            Advanced analytics and reporting features will be available here.
            Track user growth, engagement metrics, revenue, and platform health.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;
