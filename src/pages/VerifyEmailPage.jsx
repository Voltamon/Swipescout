import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '@/services/api';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import i18n from 'i18next';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified.');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>{i18n.t('auto_email_verification')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'verifying' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p>{i18n.t('auto_verifying_your_email')}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-lg font-medium text-green-700">{message}</p>
              <Button onClick={() => navigate('/login')} className="w-full">{i18n.t('auto_go_to_login')}</Button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-lg font-medium text-red-700">{message}</p>
              <Button onClick={() => navigate('/login')} variant="outline" className="w-full">{i18n.t('auto_back_to_login')}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
