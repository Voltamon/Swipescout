import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/UI/table.jsx';
import { getReportedContent, handleReport } from '@/services/api';
import themeColors from '@/config/theme-colors-admin';
import { AlertCircle, Check, X } from 'lucide-react';

const ContentModerationPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getReportedContent({ status: 'pending', limit: 50 });
      setReports(response.data.reports || response.data || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      // Fallback mock data
      setReports([
        { id: '1', type: 'video', reason: 'Inappropriate content', reporter: 'User123', status: 'pending' },
        { id: '2', type: 'user', reason: 'Spam behavior', reporter: 'User456', status: 'investigating' },
      ]);
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
      <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>Content Moderation</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell><Badge variant="outline">{report.type}</Badge></TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{report.reporter}</TableCell>
                  <TableCell><Badge className={themeColors.status.pending}>{report.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => takeAction(report.id, 'remove')}><Check className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={() => takeAction(report.id, 'dismiss')}><X className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModerationPage;
