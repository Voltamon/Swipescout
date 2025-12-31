import i18n from 'i18next';
// This temporary file was replaced by CandidateSearchPage.jsx
// Please use CandidateSearchPage.jsx instead. Kept for reference only.
import React from 'react';
import { searchCandidates, connectWithCandidate, getFilterOptions } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import { Alert, AlertDescription } from '@/components/UI/alert.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/UI/dialog.jsx';
import { Textarea } from '@/components/UI/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select.jsx';
import { useToast } from '@/hooks/use-toast';
import useConnectionMap from '@/hooks/useConnectionMap.jsx';
import themeColors from '@/config/theme-colors-employer';
import {
  MapPin,
  Search,
  Play,
  Briefcase,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  Star,
  Handshake,
  Eye,
  UserPlus,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function CandidateSearchPageTemp() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-3xl">
      <h2 className="text-xl font-semibold">This is a deprecated temporary file. Use CandidateSearchPage.jsx instead.</h2>
    </div>
  );
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("any");
  const [location, setLocation] = useState("");
  const [educationLevel, setEducationLevel] = useState("any");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOptions, setFilterOptions] = useState({});
  const [connectDialog, setConnectDialog] = useState({ open: false, candidate: null });
  const [connectMessage, setConnectMessage] = useState("");

  const experienceLevelOptions = [
    { value: "any", label: "Any Experience" },
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6+ years)" }
  ];

  const educationLevelOptions = [
    { value: "any", label: "Any Education" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "phd", label: "PhD" }
  ];

  useEffect(() => {
    loadFilterOptions();
    fetchCandidates();
  }, []);

  const { connectionMap, refresh: refreshConnections } = useConnectionMap();

  const loadFilterOptions = async () => {
    try {
      const response = await getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const fetchCandidates = async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = {
        q: searchTerm,
        skills: skills || undefined,
        experienceLevel: experienceLevel === "any" ? undefined : experienceLevel,
        location: location || undefined,
        educationLevel: educationLevel === "any" ? undefined : educationLevel,
        page: currentPage,
        limit: 12
      };

      const response = await searchCandidates(searchParams);
      setCandidates(response.data.candidates || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(currentPage);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to fetch candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchCandidates(1);
  };

  const handlePageChange = (event, newPage) => {
    fetchCandidates(newPage);
  };

  const handleConnect = async (candidate) => {
    setConnectDialog({ open: true, candidate });
    setConnectMessage(`Hi ${candidate.firstName}, I'm interested in discussing potential opportunities with you.`);
  };

  const handleSendConnection = async () => {
    try {
      await connectWithCandidate(connectDialog.candidate.id, connectMessage);
      toast({
        title: "Success!",
        description: "Connection request sent successfully!",
      });
      setConnectDialog({ open: false, candidate: null });
      setConnectMessage("");
    } catch (error) {
      console.error('Error sending connection:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CandidateCard = ({ candidate }) => (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
      <CardContent className="flex-grow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={candidate.profileImage} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
              {candidate.firstName?.[0]}{candidate.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h3 className="font-bold text-lg">{candidate.firstName} {candidate.lastName}</h3>
            <p className="text-sm text-muted-foreground">{candidate.title || 'Job Seeker'}</p>
            {candidate.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{candidate.rating}/5</span>
              </div>
            )}
          </div>
        </div>

        {candidate.summary && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {candidate.summary}
          </p>
        )}

        <div className="space-y-2 mb-4">
          {candidate.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{candidate.location}</span>
            </div>
          )}

          {candidate.experience && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{candidate.experience} years experience</span>
            </div>
          )}

          {candidate.education && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>{candidate.education}</span>
            </div>
          )}
        </div>

        {candidate.skills && candidate.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Skills:</p>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill.name || skill}
                </Badge>
              ))}
              {candidate.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{candidate.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(`/candidate/${candidate.id}`, '_blank')}
          >
            <Eye className="h-4 w-4 mr-1" />{i18n.t('auto_view')}</Button>
          {(() => {
            const c = connectionMap[candidate.id];
            if (c && c.status === 'accepted') {
              return <Button size="sm" disabled className="bg-green-600 text-white">{i18n.t('auto_connected')}</Button>;
            }
            if (c && c.status === 'pending' && c.isSender) {
              return <Button size="sm" disabled className="bg-gray-300">{i18n.t('auto_pending')}</Button>;
            }
            if (c && c.status === 'pending' && !c.isSender) {
              return (
                <div className="flex gap-2">
                <Button size="sm" onClick={async () => { try { await import('@/services/connectionService.js').then(m => m.acceptConnection(c.id)); await refreshConnections(); toast({ description: 'Connection accepted' }); } catch (err) { toast({ description: 'Failed to accept', variant: 'destructive' }); } }} className="bg-gradient-to-r from-cyan-600 to-purple-600">{i18n.t('auto_accept')}</Button>
                <Button size="sm" variant="outline" onClick={async () => { try { await import('@/services/connectionService.js').then(m => m.rejectConnection(c.id)); await refreshConnections(); toast({ description: 'Connection declined' }); } catch (err) { toast({ description: 'Failed to decline', variant: 'destructive' }); } }}>{i18n.t('auto_decline')}</Button>
                </div>
              );
            }
            return (
              <Button
                variant="default"
                size="sm"
                className={`${themeColors.buttons.primary} text-white flex-1 `}
                onClick={() => handleConnect(candidate)}
              >
                <Handshake className="h-4 w-4 mr-1" />{i18n.t('auto_connect')}</Button>
            );
          })()}
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => window.open(`/recruit/${candidate.id}`, '_blank')}
          >
            <UserPlus className="h-4 w-4 mr-1" />{i18n.t('auto_recruit')}</Button>
        </div>

        {candidate.videoResume && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => window.open(candidate.videoResume, '_blank')}
          >
            <Play className="h-4 w-4 mr-1" />{i18n.t('auto_watch_video_resume')}</Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r `+themeColors.gradients.primary+` bg-clip-text text-transparent">{i18n.t('auto_find_talented_candidates')}</h1>

      {/* Search Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">{i18n.t('auto_search_candidates')}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={i18n.t('auto_job_title_company_keywords')} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="skills">{i18n.t('auto_skills_1')}</Label>
              <Input
                id="skills"
                placeholder={i18n.t('auto_react_python_etc')} 
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="experience">{i18n.t('auto_experience_level')}</Label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger id="experience">
                  <SelectValue placeholder={i18n.t('auto_any_experience')}  />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">{i18n.t('auto_location')}</Label>
              <Input
                id="location"
                placeholder={i18n.t('auto_city_state_country')} 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="education">{i18n.t('auto_education')}</Label>
              <Select value={educationLevel} onValueChange={setEducationLevel}>
                <SelectTrigger id="education">
                  <SelectValue placeholder={i18n.t('auto_any_education')}  />
                </SelectTrigger>
                <SelectContent>
                  {educationLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r `+themeColors.gradients.primary+` hover:from-purple-700 hover:to-cyan-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{i18n.t('auto_searching')}</>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />{i18n.t('auto_search_candidates_1')}</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin `+themeColors.iconBackgrounds.primary.split(' ')[1]+`" />
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            {candidates.length > 0 
              ? `Found ${candidates.length} candidates` 
              : 'No candidates found'
            }
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(null, page - 1)}
                disabled={page === 1}
              >{i18n.t('auto_previous')}</Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(null, page + 1)}
                disabled={page === totalPages}
              >{i18n.t('auto_next')}</Button>
            </div>
          )}
        </>
      )}

      {/* Connect Dialog */}
      <Dialog 
        open={connectDialog.open} 
        onOpenChange={(open) => !open && setConnectDialog({ open: false, candidate: null })}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Connect with {connectDialog.candidate?.firstName} {connectDialog.candidate?.lastName}
            </DialogTitle>
            <DialogDescription>{i18n.t('auto_send_a_personalized_message_to_start_the')}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="message">{i18n.t('auto_message')}</Label>
            <Textarea
              id="message"
              placeholder={i18n.t('auto_write_a_personalized_message')} 
              value={connectMessage}
              onChange={(e) => setConnectMessage(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConnectDialog({ open: false, candidate: null })}
            >{i18n.t('auto_cancel')}</Button>
            <Button 
              onClick={handleSendConnection}
              disabled={!connectMessage.trim()}
              className="`+themeColors.buttons.primary.replace('bg-gradient-to-r ', '')+` "
            >{i18n.t('auto_send_connection_request')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

