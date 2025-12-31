import React from 'react';
import Settings from './Settings.jsx';
import i18n from 'i18next';

// Wrapper to render Settings with employer-specific heading/context if needed later
export default function EmployerSettingsPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-3xl font-semibold">{i18n.t('auto_employer_settings')}</h1>
        <p className="text-muted-foreground">{i18n.t('auto_manage_your_company_account_preferences')}</p>
      </div>
      <Settings />
    </div>
  );
}
