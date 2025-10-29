import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Shield, Calendar, Building2 } from 'lucide-react';

const PrivacyPolicy = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-white z-10">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            Privacy Policy
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Meta Information */}
          <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg border border-purple-100">
            <Badge variant="outline" className="flex items-center gap-2 py-2 px-3">
              <Calendar className="h-4 w-4" />
              <span><strong>Effective Date:</strong> 19 August 2025</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 py-2 px-3">
              <Building2 className="h-4 w-4" />
              <span><strong>Company:</strong> SwipeScout Ltd, United Kingdom</span>
            </Badge>
          </div>

          <section className="privacy-section">
            <h3>1. Who We Are</h3>
            <p>
              SwipeScout Ltd (“SwipeScout”, “we”, “our”, “us”) operates a job-matching platform that uses short video resumes, swipe-based discovery, and AI-powered tools to connect job seekers with employers. We are the data controller of your personal information under UK GDPR and the Data Protection Act 2018.
            </p>
          </section>

          <section className="privacy-section">
            <h3>2. Information We Collect</h3>
            <h4>From Job Seekers</h4>
            <ul>
              <li>Name, email, phone, work history, education, skills</li>
              <li>Video resumes (15–45 seconds)</li>
              <li>Swipe and match activity</li>
              <li>Messages and interactions</li>
              <li>Device and usage data (IP address, browser, app version)</li>
            </ul>
            <h4>From Employers</h4>
            <ul>
              <li>Company details (name, address, email)</li>
              <li>Recruiter account details</li>
              <li>Job postings</li>
              <li>Activity data (views, swipes, interactions with candidates)</li>
            </ul>
            <h4>Automatically Collected</h4>
            <ul>
              <li>Cookies and tracking data (see Cookie Policy)</li>
              <li>Analytics (for platform performance and AI recommendations)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>3. How We Use Your Information</h3>
            <ul>
              <li>Provide and improve our job-matching services</li>
              <li>Enable video uploads and swipe-based discovery</li>
              <li>Support AI-powered candidate recommendations</li>
              <li>Facilitate communication between job seekers and employers</li>
              <li>Maintain security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>4. Lawful Basis for Processing</h3>
            <ul>
              <li>Consent (e.g., uploading a video resume)</li>
              <li>Contract (providing services you sign up for)</li>
              <li>Legitimate interests (improving features, preventing abuse)</li>
              <li>Legal obligations (where required by UK law)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>5. Sharing Your Information</h3>
            <p>We may share your information with:</p>
            <ul>
              <li>Employers and recruiters (when you apply or match)</li>
              <li>Service providers (e.g., cloud storage, analytics partners)</li>
              <li>Regulators or law enforcement (where legally required)</li>
            </ul>
            <p>We do not sell your personal data.</p>
          </section>

          <section className="privacy-section">
            <h3>6. International Transfers</h3>
            <p>
              Your data may be stored outside the UK/EEA using cloud services. We apply safeguards such as Standard Contractual Clauses to protect your information.
            </p>
          </section>

          <section className="privacy-section">
            <h3>7. Your Rights</h3>
            <ul>
              <li>Access your data</li>
              <li>Correct inaccuracies</li>
              <li>Request deletion (“right to be forgotten”)</li>
              <li>Object or restrict processing</li>
              <li>Request a copy of your data (data portability)</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>
              To exercise these rights, contact us at <a href="mailto:support@swipescout.xyz">support@swipescout.xyz</a>.
            </p>
          </section>

          <section className="privacy-section">
            <h3>8. Data Retention</h3>
            <ul>
              <li>Active accounts: data kept while you use SwipeScout</li>
              <li>Inactive accounts: deleted after 24 months</li>
              <li>Messages: deleted within 12 months of account closure</li>
              <li>Legal records: retained where required by law</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h3>9. Security</h3>
            <p>
              We use encryption, secure servers, and monitoring to protect your information. While no system is 100% secure, we take reasonable steps to safeguard your data.
            </p>
          </section>

          <section className="privacy-section">
            <h3>10. Children’s Privacy</h3>
            <p>
              SwipeScout is not for individuals under 16. If we become aware that we’ve collected data from someone under 16 without parental consent, we will delete it.
            </p>
          </section>

          <section className="privacy-section">
            <h3>11. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy as needed. If changes are significant, we’ll notify users through the app or email.
            </p>
          </section>

          <section className="privacy-section">
            <h3>12. Contact Us</h3>
            <address>
              <p>SwipeScout Ltd<br/>London, United Kingdom</p>
              <p>Email: <a href="mailto:support@swipescout.xyz">support@swipescout.xyz</a></p>
            </address>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 