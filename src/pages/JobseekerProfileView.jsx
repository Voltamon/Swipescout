import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  getJobSeekerProfile,
  getUserVideosByUserId,
  getJobSeekerSkills,
  getJobSeekerExperiences,
  getJobSeekerEducation
} from '../services/api.js';

const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const JobSeekerProfileView = ({ userId: propUserId }) => {
  const { userId: paramId } = useParams();
  const id = paramId || propUserId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mainVideo, setMainVideo] = useState(null);

  const mainVideoRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!id) return setError('No user id provided');
      setLoading(true);
      setError(null);
      try {
        const [pRes, sRes, eRes, edRes, vRes] = await Promise.all([
          getJobSeekerProfile(id).catch(e => ({ error: e })),
          getJobSeekerSkills(id).catch(e => ({ error: e })),
          getJobSeekerExperiences(id).catch(e => ({ error: e })),
          getJobSeekerEducation(id).catch(e => ({ error: e })),
          getUserVideosByUserId(id).catch(e => ({ error: e }))
        ]);

        if (pRes?.error) throw pRes.error;
        // axios returns response object; normalize to the actual profile object
        const profileObj = pRes?.data ?? pRes;
        setProfile(profileObj);

        if (!sRes?.error) setSkills(sRes.data?.skills || []);
        else setSkills([]);

        setExperiences(eRes.data?.experiences || []);
        setEducation(edRes.data?.educations || []);

        const vids = vRes.data?.videos || [];
        setVideos(vids);
        setMainVideo(vids.find(v => v.video_position === 'main') || null);

        setLoading(false);
      } catch (e) {
        console.error('fetch error', e);
        setError(e?.message || String(e));
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-pulse space-y-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mx-auto" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-72 mx-auto" />
          </div>
          <p className="text-sm text-slate-500 mt-4">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-lg text-center p-6 bg-white rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Error loading profile</h3>
          <p className="text-sm text-red-600 mb-4">{String(error)}</p>
          <p className="text-sm text-slate-600">If you see a connection refused error, make sure your backend is running on {VITE_API_BASE_URL} and accepts requests.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">No profile found</div>
      </div>
    );
  }

  // Helpers to map backend fields to UI-friendly values
  const getDisplayName = (p) => {
    if (!p) return '';
    return p.user?.displayName || p.name || [p.first_name, p.last_name].filter(Boolean).join(' ') || '';
  };

  const getPhotoUrl = (p) => {
    const pic = p.profile_pic || p.user?.photoUrl || p.user?.photoURL || null;
    if (!pic) return '/placeholder-avatar.png';
    // If it's an absolute URL, return as-is, otherwise prefix API base
    if (pic.startsWith('http://') || pic.startsWith('https://')) return pic;
    return `${VITE_API_BASE_URL}${pic}`;
  };

  const normalizeMediaUrl = (u) => {
    if (!u) return null;
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return `${VITE_API_BASE_URL}${u}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
              {mainVideo ? (
                <video
                  ref={mainVideoRef}
                  src={normalizeMediaUrl(mainVideo.video_url)}
                  controls
                  className="w-full h-64 object-cover bg-black"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-slate-400">No main video</div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 text-center">
              <img src={getPhotoUrl(profile)} alt={getDisplayName(profile)}
                className="w-28 h-28 rounded-full object-cover mx-auto shadow-md" onError={(e)=>{e.target.src='/placeholder-avatar.png'}} />
              <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">{getDisplayName(profile)}</h2>
              <p className="text-sm text-primary-600">{profile.title}</p>
              <p className="text-sm text-slate-500 mt-2">{profile.location}</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{profile.bio}</p>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.length ? skills.map((s,i)=>(
                    <span key={i} className="px-3 py-1 bg-primary-100 dark:bg-primary-700 text-primary-800 dark:text-white rounded-full text-sm">{s.name || s.skill?.name}{s.level?` • ${s.level}`:''}</span>
                  )) : <span className="text-sm text-slate-500">No skills listed</span>}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Experience</h4>
                  {experiences.length ? experiences.map(exp => (
                    <div key={exp.id} className="mb-3 p-3 bg-slate-50 dark:bg-slate-700 rounded">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{exp.title}{exp.position?` — ${exp.position}`:''}</div>
                          <div className="text-sm text-primary-600">{exp.company_name}</div>
                        </div>
                        <div className="text-sm text-slate-500">{formatDate(exp.start_date)} — {exp.currently_working? 'Present' : formatDate(exp.end_date)}</div>
                      </div>
                      {exp.location && <div className="text-sm text-slate-500 mt-1">{exp.location}</div>}
                      {exp.description && <p className="text-sm text-slate-600 mt-2">{exp.description}</p>}
                    </div>
                  )) : <div className="text-sm text-slate-500">No experience available</div>}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Education</h4>
                  {education.length ? education.map(edu => (
                    <div key={edu.id} className="mb-3 p-3 bg-slate-50 dark:bg-slate-700 rounded">
                      <div className="font-medium">{edu.degree}</div>
                      <div className="text-sm text-primary-600">{edu.institution}</div>
                      {edu.field && <div className="text-sm text-slate-500">{edu.field}</div>}
                      <div className="text-sm text-slate-500 mt-1">{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</div>
                      {edu.description && <p className="text-sm text-slate-600 mt-2">{edu.description}</p>}
                    </div>
                  )) : <div className="text-sm text-slate-500">No education available</div>}
                </div>
              </div>
            </div>

            {videos && videos.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-2xl font-semibold mb-4">Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {videos.filter(v => v.video_position !== 'main').map(video => (
                    <div key={video.id || video.videoId || JSON.stringify(video)} className="rounded overflow-hidden bg-black">
                      <video src={normalizeMediaUrl(video.video_url)} className="w-full h-48 object-cover" controls />
                      <div className="p-3 bg-white dark:bg-slate-800">
                        <div className="font-medium truncate">{video.video_title}</div>
                        <div className="text-sm text-slate-500 mt-2 flex justify-between">
                          <div>{video.video_duration? `${Math.round(video.video_duration)}s` : ''}</div>
                          <div>{video.views? `${video.views} views` : ''}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfileView;