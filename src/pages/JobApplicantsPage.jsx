import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { useTranslation } from 'react-i18next';
import { getJobApplicants, updateJobApplicationStatus } from '@/services/api';
import ApplicantCard from '@/components/ApplicantCard.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/UI/select.jsx';
import { Loader2, Users, Search, SlidersHorizontal, ArrowLeft, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { themeColors } from '@/config/theme-colors-employer';

export default function JobApplicantsPage({ id: propId }) {
  const { id: paramId } = useParams();
  const id = propId || paramId; // accept id via prop or URL params
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const { t } = useTranslation(['jobApplicants', 'common']);
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
          setErrorMsg(t('messages.unauthorized'));
        } else if (status === 403) {
          setErrorMsg(t('messages.forbidden'));
        } else {
          setErrorMsg(t('messages.loadError'));
        }
        toast({ title: t('messages.errorTitle'), description: errorMsg || t('messages.loadError'), variant: 'destructive' });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchApplicants();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen ${themeColors.backgrounds.page}`}>
      <div className="text-center">
        <Loader2 className={`h-12 w-12 animate-spin mx-auto mb-4 ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
        <p className={themeColors.text.secondary}>{t('loading')}</p>
      </div>
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
      toast({ title: t('messages.successTitle'), description: t('messages.statusUpdateSuccess') + ` ${newStatus}` });
    } catch (err) {
      console.error('Failed to update application status', err);
      setApplicants(prev); // revert on failure
      toast({ title: t('messages.errorTitle'), description: t('messages.statusUpdateError'), variant: 'destructive' });
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${themeColors.backgrounds.page} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-indigo-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${themeColors.iconBackgrounds.primary}`}>
                  <Users className="h-6 w-6" />
                </div>
                <h1 className={`text-3xl font-bold ${themeColors.text.gradient}`}>
                  {t('title')}
                </h1>
              </div>
              <p className={`${themeColors.text.secondary} mt-1 ml-14`}>
                {t('subtitle')}
              </p>
            </div>
          </div>
          <Badge className={`${themeColors.badges.primary} text-lg px-4 py-2`}>
            {applicants.length} {applicants.length !== 1 ? t('totalApplicantsPlural') : t('totalApplicants')}
          </Badge>
        </div>

        {/* Filters Section */}
        <Card className={`${themeColors.shadows.md}`}>
          <CardHeader className={`bg-gradient-to-r ${themeColors.gradients.primary} text-white`}>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              <CardTitle>{t('filters.title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className={`text-sm font-medium ${themeColors.text.primary} mb-2 block`}>
                  {t('filters.searchLabel')}
                </label>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${themeColors.text.muted}`} />
                  <Input 
                    placeholder={t('filters.searchPlaceholder')}
                    value={search} 
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className={`text-sm font-medium ${themeColors.text.primary} mb-2 block`}>
                  {t('filters.statusLabel')}
                </label>
                <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.statusPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.statusAll')}</SelectItem>
                    <SelectItem value="pending">{t('filters.statusPending')}</SelectItem>
                    <SelectItem value="reviewed">{t('filters.statusReviewed')}</SelectItem>
                    <SelectItem value="accepted">{t('filters.statusAccepted')}</SelectItem>
                    <SelectItem value="rejected">{t('filters.statusRejected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <label className={`text-sm font-medium ${themeColors.text.primary} mb-2 block`}>
                  {t('filters.sortLabel')}
                </label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.sortPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appliedAt_desc">{t('filters.sortLatestFirst')}</SelectItem>
                    <SelectItem value="appliedAt_asc">{t('filters.sortOldestFirst')}</SelectItem>
                    <SelectItem value="name_asc">{t('filters.sortNameAsc')}</SelectItem>
                    <SelectItem value="name_desc">{t('filters.sortNameDesc')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count and per-page selector */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className={`${themeColors.text.secondary} text-sm`}>
                {t('filters.showing')} <span className="font-semibold">{paginatedApplicants.length}</span> {t('filters.of')}{' '}
                <span className="font-semibold">{filteredApplicants.length}</span> {filteredApplicants.length !== 1 ? t('filters.applicants') : t('filters.applicant')}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${themeColors.text.secondary}`}>{t('filters.perPageLabel')}</span>
                <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicants List */}
        <Card className={`${themeColors.shadows.lg}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{t('profiles.title')}</CardTitle>
                <CardDescription className="mt-1">
                  {t('profiles.subtitle')}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {t('profiles.pageOf')} {page} of {totalPages}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {errorMsg ? (
              <div className={`flex items-center gap-3 p-4 rounded-lg ${themeColors.status.error}`}>
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">{t('profiles.errorLoading')}</p>
                  <p className="text-sm mt-1">{errorMsg}</p>
                </div>
              </div>
            ) : paginatedApplicants.length === 0 ? (
              <div className="text-center py-16">
                <div className={`inline-flex p-4 rounded-full ${themeColors.iconBackgrounds.info} mb-4`}>
                  <Users className="h-12 w-12" />
                </div>
                <h3 className={`text-xl font-semibold ${themeColors.text.primary} mb-2`}>
                  {filteredApplicants.length === 0 && applicants.length === 0
                    ? t('profiles.noApplicants')
                    : t('profiles.noMatching')}
                </h3>
                <p className={`${themeColors.text.secondary}`}>
                  {filteredApplicants.length === 0 && applicants.length === 0
                    ? t('profiles.noApplicantsDesc')
                    : t('profiles.noMatchingDesc')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedApplicants.map(a => (
                  <ApplicantCard 
                    key={a.applicationId} 
                    applicant={a} 
                    onViewProfile={handleViewProfile} 
                    onUpdateStatus={handleUpdateStatus} 
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className={themeColors.shadows.md}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange(Math.max(1, page - 1))} 
                  disabled={page <= 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('pagination.previous')}
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        className={page === pageNum ? themeColors.buttons.primary : ''}
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))} 
                  disabled={page >= totalPages}
                  className="gap-2"
                >
                  {t('pagination.next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
