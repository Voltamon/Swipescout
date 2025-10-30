
export const navigationLinks = {
  job_seeker: [
    { name: 'Job Listings', page: 'jobListings', icon: 'Home' },
    { name: 'Video Editor', page: 'videoEditor', icon: 'Video' },
    { name: 'Upload Video', page: 'uploadVideo', icon: 'MessageSquare' },
    { name: 'My Applications', page: 'myApplications', icon: 'Bell' },
    { name: 'Resume Builder', page: 'resumeBuilder', icon: 'User' },
  ],
  employer: [
    { name: 'Job Listings', page: 'jobListings', icon: 'Home' },
    { name: 'Video Editor', page: 'videoEditor', icon: 'Video' },
    { name: 'Upload Video', page: 'uploadVideo', icon: 'MessageSquare' },
    { name: 'Post Job', page: 'postJob', icon: 'Bell' },
    { name: 'Manage Applicants', page: 'manageApplicants', icon: 'User' },
  ],
  admin: [
    { name: 'Dashboard', page: 'adminDashboard', icon: 'Home' },
    { name: 'Job Listings', page: 'jobListings', icon: 'Video' },
    { name: 'Video Editor', page: 'videoEditor', icon: 'MessageSquare' },
    { name: 'Upload Video', page: 'uploadVideo', icon: 'Bell' },
    { name: 'User Management', page: 'userManagement', icon: 'User' },
  ]
};

export const pageTabLinks = {
  videoEditor: {
    job_seeker: [
      { name: 'Upload Video', page: 'uploadVideo' },
      { name: 'My Video List', page: 'myVideoList' },
      { name: 'Examples', page: 'examples' },
      { name: 'My Applications', page: 'myApplications' },
    ],
    employer: [
      { name: 'Record Interview', page: 'recordInterview' },
      { name: 'Candidate Videos', page: 'candidateVideos' },
      { name: 'Video Templates', page: 'videoTemplates' },
      { name: 'My Applications', page: 'myApplications' },
    ],
    admin: [
      { name: 'Upload Video', page: 'uploadVideo' },
      { name: 'My Video List', page: 'myVideoList' },
      { name: 'Examples', page: 'examples' },
      { name: 'My Applications', page: 'myApplications' },
    ]
  },
  jobListings: {
    job_seeker: [
      { name: 'Explore', page: 'exploreJobs' },
      { name: 'Detailed Search', page: 'detailedSearch' },
      { name: 'Saved Jobs', page: 'savedJobs' },
    ],
    employer: [
      { name: 'My Posted Jobs', page: 'myPostedJobs' },
      { name: 'Browse Resumes', page: 'browseResumes' },
      { name: 'New Job Post', page: 'newJobPost' },
    ],
    admin: [
      { name: 'Manage Listings', page: 'manageListings' },
      { name: 'Review Jobs', page: 'reviewJobs' },
      { name: 'Analytics', page: 'analytics' },
    ]
  },
  uploadVideo: {
    job_seeker: [
      { name: 'Upload Video', page: 'uploadVideo' },
      { name: 'My Video List', page: 'myVideoList' },
      { name: 'Examples', page: 'examples' },
      { name: 'My Applications', page: 'myApplications' },
    ],
    employer: [
      { name: 'Upload Video', page: 'uploadVideo' },
      { name: 'Candidate Videos', page: 'candidateVideos' },
      { name: 'Video Templates', page: 'videoTemplates' },
      { name: 'My Applications', page: 'myApplications' },
    ],
    admin: [
      { name: 'Upload Video', page: 'uploadVideo' },
      { name: 'My Video List', page: 'myVideoList' },
      { name: 'Examples', page: 'examples' },
      { name: 'My Applications', page: 'myApplications' },
    ]
  }
};
