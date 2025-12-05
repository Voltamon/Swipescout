import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { getJobApplicants } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JobApplicantsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchApplicants = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getJobApplicants(id);
        if (!mounted) return;
        setApplicants(res.data?.applicants || []);
      } catch (err) {
        console.error('Failed to load applicants', err);
        toast({ title: 'Error', description: 'Failed to load applicants', variant: 'destructive' });
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

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Applicants</CardTitle>
        </CardHeader>
        <CardContent>
          {applicants.length === 0 ? (
            <p className="text-muted-foreground">No applicants yet</p>
          ) : (
            <div className="space-y-4">
              {applicants.map(a => (
                <div key={a.applicationId} className="p-4 rounded-md border flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{a.applicantInfo?.displayName || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{new Date(a.appliedAt).toLocaleString()}</div>
                    </div>
                    {a.applicantInfo?.profile?.bio && (
                      <p className="text-sm text-muted-foreground mt-1">{a.applicantInfo.profile.bio}</p>
                    )}
                    <div className="mt-2 flex gap-2 items-center">
                      <div className="text-xs text-muted-foreground">{a.applicantInfo?.profile?.yearsOfExp || '—'} yrs</div>
                      {a.applicantInfo?.skills && a.applicantInfo.skills.length > 0 && (
                        <div className="text-xs text-muted-foreground">Skills: {a.applicantInfo.skills.join(', ')}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
