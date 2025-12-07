import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
// UI components used in the applicant card
import { getJobApplicants, updateJobApplicationStatus } from '@/services/api';
import ApplicantCard from '@/components/ApplicantCard.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/UI/select.jsx';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function JobApplicantsPage({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId; // accept id via prop or URL params
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // Use 'all' as a sentinel value instead of empty string; Radix Select doesn't allow empty string values in items
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('appliedAt_desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    let mounted = true;
    const fetchApplicants = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getJobApplicants(id);
        if (!mounted) return;
        setApplicants(res.data?.applicants || []);
        setErrorMsg(null);
      } catch (err) {
        console.error('Failed to load applicants', err);
        const status = err?.response?.status;
        if (status === 401) {
          setErrorMsg('Unauthorized. You must be logged in to view applicants for this job.');
        } else if (status === 403) {
          setErrorMsg('Forbidden. You do not have permission to view applicants for this job. Only the job owner or admin can view applicants.');
        } else {
          setErrorMsg('Failed to load applicants.');
        }
        toast({ title: 'Error', description: errorMsg || 'Failed to load applicants', variant: 'destructive' });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchApplicants();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
    </div>
  );

  const filteredApplicants = applicants.filter((a) => {
    // Search by applicant name, skills, title, email, location
    const q = search?.trim().toLowerCase();
    if (q) {
  const name = (a.applicantInfo?.displayName || `${a.applicantInfo?.profile?.firstName || ''} ${a.applicantInfo?.profile?.lastName || ''}` || `${a.applicantInfo?.user?.firstName || ''} ${a.applicantInfo?.user?.lastName || ''}` || '').toLowerCase();
  const title = (a.applicantInfo?.profile?.title || a.applicantInfo?.profile?.preferredJobTitle || '').toLowerCase();
      const email = (a.applicantInfo?.email || '').toLowerCase();
      const location = (a.applicantInfo?.profile?.location || '').toLowerCase();
      const skills = (a.applicantInfo?.skills || []).join(' ').toLowerCase();
      if (!(name.includes(q) || title.includes(q) || email.includes(q) || location.includes(q) || skills.includes(q))) {
        return false;
      }
    }
  if (filterStatus && filterStatus !== 'all') {
      if ((a.status || '').toLowerCase() !== filterStatus.toLowerCase()) return false;
    }
    return true;
  });

  const sortedApplicants = filteredApplicants.slice().sort((a, b) => {
    if (sortBy === 'appliedAt_asc') return new Date(a.appliedAt) - new Date(b.appliedAt);
    if (sortBy === 'appliedAt_desc') return new Date(b.appliedAt) - new Date(a.appliedAt);
    if (sortBy === 'name_asc') {
  const aName = (a.applicantInfo?.displayName || `${a.applicantInfo?.profile?.firstName || ''} ${a.applicantInfo?.profile?.lastName || ''}` || `${a.applicantInfo?.user?.firstName || ''} ${a.applicantInfo?.user?.lastName || ''}` || '');
  const bName = (b.applicantInfo?.displayName || `${b.applicantInfo?.profile?.firstName || ''} ${b.applicantInfo?.profile?.lastName || ''}` || `${b.applicantInfo?.user?.firstName || ''} ${b.applicantInfo?.user?.lastName || ''}` || '');
      return aName.localeCompare(bName);
    }
    if (sortBy === 'name_desc') {
      const aName = (a.applicantInfo?.displayName || `${a.applicantInfo?.profile?.firstName || ''} ${a.applicantInfo?.profile?.lastName || ''}` || '');
      const bName = (b.applicantInfo?.displayName || `${b.applicantInfo?.profile?.firstName || ''} ${b.applicantInfo?.profile?.lastName || ''}` || '');
      return bName.localeCompare(aName);
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedApplicants.length / perPage));
  const paginatedApplicants = sortedApplicants.slice((page - 1) * perPage, page * perPage);

  const handleViewProfile = (userId) => {
    if (!userId) return;
    navigate(`/jobseeker-profile/${userId}`);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    // Optimistic update: update local state immediately
    const prev = applicants.slice();
    setApplicants(prev.map(a => a.applicationId === applicationId ? { ...a, status: newStatus } : a));
    try {
      await updateJobApplicationStatus(applicationId, newStatus);
      toast({ title: 'Success', description: `Applicant status updated to ${newStatus}` });
    } catch (err) {
      console.error('Failed to update application status', err);
      setApplicants(prev); // revert on failure
      toast({ title: 'Error', description: 'Failed to update application status', variant: 'destructive' });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
          <h1 className="text-2xl font-semibold">Applicants</h1>
          <span className="text-sm text-muted-foreground">{applicants.length} applicants</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-60">
            <Input placeholder="Search applicants" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>

          <div>
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Filter status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="appliedAt_desc">Applied (newest)</SelectItem>
                <SelectItem value="appliedAt_asc">Applied (oldest)</SelectItem>
                <SelectItem value="name_asc">Name (A–Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z–A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Per page" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Applicants</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMsg ? (
            <div className="text-sm text-muted-foreground">{errorMsg}</div>
          ) : paginatedApplicants.length === 0 ? (
            <p className="text-muted-foreground">No applicants yet</p>
          ) : (
            <div className="space-y-4">
              {paginatedApplicants.map(a => (
                <ApplicantCard key={a.applicationId} applicant={a} onViewProfile={handleViewProfile} onUpdateStatus={handleUpdateStatus} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{filteredApplicants.length} applicant(s) • page {page} of {totalPages}</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handlePageChange(Math.max(1, page - 1))} disabled={page <= 1}>Previous</Button>
          <Button variant="ghost" size="sm" onClick={() => handlePageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</Button>
        </div>
      </div>
    </div>
  );
}
