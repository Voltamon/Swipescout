import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import themeColors from '@/config/theme-colors-admin';
import { Briefcase } from 'lucide-react';

const AdminJobsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>Job Management</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            All Job Postings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={themeColors.text.secondary}>
            View and manage all job postings on the platform.
            Review, edit, or remove job listings as needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminJobsPage;
