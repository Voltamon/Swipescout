import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import localize from '@/utils/localize';
import { Button } from '@/components/UI/button.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/UI/table.jsx';
import { getReportedContent, handleReport } from '@/services/api';
import themeColors from '@/config/theme-colors-admin';
import { AlertCircle, Check, X } from 'lucide-react';

const ContentModerationPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getReportedContent({ status: 'pending', limit: 50 });
      setReports(response.data.reports || response.data || []);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setError(error?.response?.data?.message || error.message || 'Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const takeAction = async (reportId, action) => {
    try {
      await handleReport(reportId, { action: action === 'remove' ? 'remove' : 'dismiss', reason: action === 'remove' ? 'Removed by moderator' : 'Dismissed after review' });
      fetchReports();
    } catch (error) {
      console.error('Failed to perform action on report:', error);
      alert(error?.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>{i18n.t('auto_content_moderation')}</h2>
      {error && (
        <div className="p-3 rounded bg-red-50 border border-red-100 text-red-700 flex items-center justify-between">
          <div>{error}</div>
          <div className="ml-4">
            <Button variant="ghost" onClick={fetchReports}>{i18n.t('auto_retry')}</Button>
          </div>
        </div>
      )}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{i18n.t('auto_type')}</TableHead>
                <TableHead>{i18n.t('auto_reason')}</TableHead>
                <TableHead>{i18n.t('auto_reporter')}</TableHead>
                <TableHead>{i18n.t('auto_status')}</TableHead>
                <TableHead>{i18n.t('auto_actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-sm text-slate-500">
                    {loading ? 'Loading reports...' : 'No pending reports.'}
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell><Badge variant="outline">{localize(report.type)}</Badge></TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell><Badge className={themeColors.status.pending}>{localize(report.status)}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => takeAction(report.id, 'remove')}><Check className="h-3 w-3" /></Button>
                        <Button size="sm" variant="outline" onClick={() => takeAction(report.id, 'dismiss')}><X className="h-3 w-3" /></Button>
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

export default ContentModerationPage;
