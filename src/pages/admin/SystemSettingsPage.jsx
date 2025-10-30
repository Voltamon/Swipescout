import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import themeColors from '@/config/theme-colors-admin';
import { Settings } from 'lucide-react';

const SystemSettingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>System Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Platform Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={themeColors.text.secondary}>
            System settings and configuration options will be available here.
            Manage feature flags, maintenance mode, email settings, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettingsPage;
