// Linkedincallback.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Linkedincallback() {
  const location = useLocation();

  useEffect(() => {
    console.log("LinkedIn Callback - location.search:", location.search);
    
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');
    console.log("LinkedIn Callback - code:", code);
    if (error) {
      const errorMessage = params.get('error_description') || 'Unknown error';
      console.error("LinkedIn OAuth error:", error, errorMessage);
      window.opener.postMessage({
        type: 'LINKEDIN_AUTH_ERROR',
        error: error,
        errorDescription: errorMessage
      }, window.location.origin);
      window.close();
      return;
    }

    if (!code) {
      const errorMsg = 'No authorization code received from LinkedIn';
      console.error(errorMsg);
      window.opener.postMessage({
        type: 'LINKEDIN_AUTH_ERROR',
        error: 'no_code',
        errorDescription: errorMsg
      }, window.location.origin);
      window.close();
      return;
    }

    console.log("Exchanging authorization code for token...");
    
    // Call your backend to exchange the code for a token
    exchangeCodeForToken(code)
      .then(tokenData => {
        if (!tokenData.id_token) {
          throw new Error('No ID token received from backend');
        }
        
        window.opener.postMessage({
          type: 'LINKEDIN_AUTH_SUCCESS',
          payload: {
            id_token: tokenData.id_token,
            access_token: tokenData.access_token
          }
        }, window.location.origin);
        window.close();
      })
      .catch(err => {
        console.error("Token exchange failed:", err);
        window.opener.postMessage({
          type: 'LINKEDIN_AUTH_ERROR',
          error: 'token_exchange_failed',
          errorDescription: err.message || 'Failed to exchange code for token'
        }, window.location.origin);
        window.close();
      });

  }, [location.search]);

  return <div>Processing LinkedIn login...</div>;
}

async function exchangeCodeForToken(code) {
  try {
    const response = await fetch(`${apiUrl}/api/auth/linkedin/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to exchange code');
    }

    return await response.json();
  } catch (err) {
    console.error("Exchange error:", err);
    throw err;
  }
}