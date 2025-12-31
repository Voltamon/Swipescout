import i18n from 'i18next';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/UI/card.jsx';
import themeColors from '@/config/theme-colors-admin';
import { Briefcase, MoreVertical, Eye, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/UI/table.jsx';
import { Button } from '@/components/UI/button.jsx';
import { getAllJobsPosted, deleteJob, updateJob } from '@/services/api';

const AdminJobsPage = () => {
  const { t } = useTranslation('adminJobs');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getAllJobsPosted({ page: 1, limit: 50 });
      setJobs(response.data.jobs || response.data || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete job posting?')) return;
    try {
      await deleteJob(id);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job');
    }
  };

  const handleToggleActive = async (job) => {
    try {
      const newStatus = job.job_status === 'active' ? 'paused' : 'active';
      await updateJob(job.id, { job_status: newStatus });
      fetchJobs();
    } catch (error) {
      console.error('Failed to update job status:', error);
      alert('Failed to update job status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${themeColors.text.primary}`}>{t('title')}</h2>
        <p className={themeColors.text.secondary}>{t('description')}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{i18n.t('auto_title')}</TableHead>
                <TableHead>{i18n.t('auto_company')}</TableHead>
                <TableHead>{i18n.t('auto_status')}</TableHead>
                <TableHead>{i18n.t('auto_posted')}</TableHead>
                <TableHead className="text-right">{i18n.t('auto_actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">{i18n.t('auto_loading_jobs')}</TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">{i18n.t('auto_no_jobs_found')}</TableCell>
                </TableRow>
              ) : (
                jobs.map(job => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company_name || job.employer?.companyName || '-'}</TableCell>
                    <TableCell>{job.job_status || job.status || 'unknown'}</TableCell>
                    <TableCell>{job.created_at ? new Date(job.created_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => window.open(`/job/${job.id}`, '_blank')}>{<Eye className="h-4 w-4" />}</Button>
                        <Button size="sm" variant="outline" onClick={() => handleToggleActive(job)}>{job.job_status === 'active' ? 'Pause' : 'Activate'}</Button>
                        <Button size="sm" className="text-red-600" onClick={() => handleDelete(job.id)}>{<Trash2 className="h-4 w-4" />}</Button>
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

export default AdminJobsPage;
