import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/UI/avatar.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Mail, MapPin, Phone, FileText, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ApplicantCard({ applicant, onViewProfile, onUpdateStatus }) {
  const { t } = useTranslation(['jobApplicants', 'common']);
  const profile = applicant.applicantInfo?.profile;
  const userObj = applicant.applicantInfo?.user;
  const userDisplayName = applicant.applicantInfo?.displayName;
  const profileName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();
  const userName = `${userObj?.firstName || ''} ${userObj?.lastName || ''}`.trim();
  let name;
  if (userDisplayName) {
    name = profileName ? `${userDisplayName} - ${profileName}` : userDisplayName;
  } else if (profileName) {
    name = profileName;
  } else if (userName) {
    name = userName;
  } else if (applicant.applicantInfo?.email) {
    name = applicant.applicantInfo.email;
  } else {
    name = t('applicantCard.unknown');
  }
  const appliedAt = applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleString() : '—';
  const skills = applicant.applicantInfo?.skills || [];
  const email = applicant.applicantInfo?.email;
  const phone = profile?.mobile || profile?.phone;
  const location = profile?.location;
  const title = profile?.title || profile?.preferredJobTitle;
  const rawPhoto = profile?.profilePic;
  const photo = rawPhoto ? (rawPhoto.startsWith('http') || rawPhoto.startsWith('blob:') ? rawPhoto : `${VITE_API_BASE_URL}${rawPhoto}`) : null;
  const resume = applicant.resumeUrl;

  const [pendingAction, setPendingAction] = useState(false);

  const handleShortlist = async () => {
    if (onUpdateStatus && !pendingAction) {
      setPendingAction(true);
      try {
        await onUpdateStatus(applicant.applicationId, 'accepted');
      } finally {
        setPendingAction(false);
      }
    }
  };

  const handleReject = async () => {
    if (onUpdateStatus && !pendingAction) {
      setPendingAction(true);
      try {
        await onUpdateStatus(applicant.applicationId, 'rejected');
      } finally {
        setPendingAction(false);
      }
    }
  };

  const getStatusVariant = (status) => {
    if (!status) return 'outline';
    const s = (status || '').toLowerCase();
    if (s === 'accepted' || s === 'shortlisted') return 'default';
    if (s === 'rejected') return 'destructive';
    return 'secondary';
  };

  return (
    <div className="p-4 rounded-md border flex items-start gap-4">
      <div className="flex items-start gap-4 w-full">
        <div className="flex items-center flex-shrink-0">
          <Avatar className="h-12 w-12">
            {photo ? (
              <AvatarImage src={photo} alt={name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                {name?.charAt(0) || <User className="h-4 w-4" />}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="font-medium text-base truncate">{name}</div>
              {title && <div className="text-sm text-muted-foreground truncate">{title}</div>}
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">{appliedAt}</div>
          </div>

          {profile?.bio && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{profile.bio}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="text-xs text-muted-foreground">{profile?.yearsOfExp || '—'} {t('applicantCard.years')}</div>
            {skills.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {skills.slice(0, 6).map((s, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{s}</Badge>
                ))}
                {skills.length > 6 && (
                  <Badge variant="secondary" className="text-xs">+{skills.length - 6}</Badge>
                )}
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
            {location && (
              <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{location}</div>
            )}
            {email && (
              <div className="flex items-center gap-1"><Mail className="h-4 w-4" />{email}</div>
            )}
            {phone && (
              <div className="flex items-center gap-1"><Phone className="h-4 w-4" />{phone}</div>
            )}
            {applicant.applicantInfo?.educations && applicant.applicantInfo.educations.length > 0 && (
              <div className="flex items-center gap-1"><FileText className="h-4 w-4" />{applicant.applicantInfo.educations[0].degree || applicant.applicantInfo.educations[0].institution}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-col space-y-2">
            <Button size="sm" variant="ghost" onClick={() => onViewProfile(applicant.applicantInfo?.userId)}>{t('applicantCard.viewProfile')}</Button>
            {resume && (
              <a href={resume} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button size="sm" variant="secondary" className="w-full flex items-center gap-2"><FileText className="h-4 w-4" /> {t('applicantCard.resume')}</Button>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="default" onClick={handleShortlist} disabled={pendingAction || applicant.status === 'accepted'}>{t('applicantCard.shortlist')}</Button>
            <Button size="sm" variant="destructive" onClick={handleReject} disabled={pendingAction || applicant.status === 'rejected'}>{t('applicantCard.reject')}</Button>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>{t('applicantCard.status')}:</span>
            <Badge variant={getStatusVariant(applicant.status)}>{(applicant.status || '—').toUpperCase()}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
