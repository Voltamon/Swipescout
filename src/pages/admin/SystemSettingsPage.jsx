import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Button } from '@/components/UI/button.jsx';
import themeColors from '@/config/theme-colors-admin';
import { Settings } from 'lucide-react';
import { getAdminSettings, updateAdminSettings } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const SystemSettingsPage = () => {
  const { t } = useTranslation('systemSettings');
  const { toast } = useToast();
  const [settings, setSettings] = useState({ maintenanceMode: false, siteName: '', supportEmail: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getAdminSettings();
      setSettings(response.data.settings || response.data || settings);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateAdminSettings(settings);
      toast({ title: 'Settings saved', description: 'Platform settings updated successfully.' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({ title: 'Failed to save settings', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>{t('title')}</h2>
        <p className={themeColors.text.secondary}>{t('description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />{i18n.t('auto_platform_settings')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>{i18n.t('auto_loading')}</div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>{i18n.t('auto_site_name')}</Label>
                <Input value={settings.siteName || ''} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
              </div>
              <div>
                <Label>{i18n.t('auto_support_email')}</Label>
                <Input value={settings.supportEmail || ''} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
              </div>
              <div>
                <Label>{i18n.t('auto_maintenance_mode')}</Label>
                <div className="mt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
                    <span className="text-sm ml-1">{i18n.t('auto_enable_maintenance_mode')}</span>
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={handleSave} disabled={saving} className="bg-slate-700 text-white">{saving ? 'Saving...' : 'Save Settings'}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettingsPage;
