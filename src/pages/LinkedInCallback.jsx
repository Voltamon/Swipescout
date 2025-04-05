// LinkedInCallback.jsx
import { useEffect } from 'react';
import { useLinkedIn } from 'react-linkedin-login-oauth2';

const LinkedInCallback = () => {
  const { linkedInLogin } = useLinkedIn();

  useEffect(() => {
    linkedInLogin();
  }, [linkedInLogin]);

  return <div>Loading...</div>;
};

export default LinkedInCallback;
