import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function LinkedInCallback() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idToken = params.get('id_token');
    
    if (idToken && window.opener) {
      window.opener.postMessage({
        type: 'LINKEDIN_AUTH_RESPONSE',
        id_token: idToken
      }, window.location.origin);
    }
    window.close();
  }, [location]);

  return <div>Completing LinkedIn login...</div>;
}