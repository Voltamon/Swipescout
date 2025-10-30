import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/UI/table.jsx';
import { getReportedContent } from '@/services/api';
import themeColors from '@/config/theme-colors-admin';
import { AlertCircle, Check, X } from 'lucide-react';

const ContentModerationPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setReports([
      { id: '1', type: 'video', reason: 'Inappropriate content', reporter: 'User123', status: 'pending' },
      { id: '2', type: 'user', reason: 'Spam behavior', reporter: 'User456', status: 'investigating' },
    ]);
    setLoading(false);
  }, []);

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
                      <Button size="sm" variant="outline"><Check className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline"><X className="h-3 w-3" /></Button>
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
