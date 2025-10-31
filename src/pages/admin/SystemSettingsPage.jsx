import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import themeColors from '@/config/theme-colors-admin';
import { Settings } from 'lucide-react';

const SystemSettingsPage = () => {
  const { t } = useTranslation('systemSettings');

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>{t('title')}</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('platformConfiguration')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={themeColors.text.secondary}>
            {t('description')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettingsPage;
