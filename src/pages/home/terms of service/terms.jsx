import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Building2 } from 'lucide-react';

const TermsOfService = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-white z-10">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
            <FileText className="h-8 w-8 text-purple-600" />
            Terms of Service
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

          <section className="terms-section">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By creating an account or using SwipeScout (“we”, “our”, “us”), you agree to these Terms of Service. If you do not agree, do not use the platform.
            </p>
          </section>

          <section className="terms-section">
            <h3>2. Who Can Use SwipeScout</h3>
            <ul>
              <li>You must be at least 16 years old.</li>
              <li>You must provide accurate, truthful information when creating an account.</li>
              <li>Employers/recruiters must have the legal authority to represent their company.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>3. What SwipeScout Provides</h3>
            <p>SwipeScout is a hiring platform that allows:</p>
            <ul>
              <li>Job seekers to create profiles and short video resumes (15–45 seconds).</li>
              <li>Employers to post jobs and discover candidates via video.</li>
              <li>Both parties to connect, swipe, and message for hiring purposes.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>4. User Responsibilities</h3>
            <h4>For Job Seekers</h4>
            <ul>
              <li>Only upload truthful, accurate video resumes and profiles.</li>
              <li>Do not misrepresent your skills, experience, or identity.</li>
            </ul>
            <h4>For Employers</h4>
            <ul>
              <li>Only post real job opportunities.</li>
              <li>No fake postings, spam, or phishing attempts.</li>
              <li>Respect anti-discrimination laws (no unlawful bias in hiring).</li>
            </ul>
            <h4>For Everyone</h4>
            <p>You must NOT upload, share, or promote:</p>
            <ul>
              <li>NSFW content (pornography, nudity, sexually explicit material).</li>
              <li>Violent or hateful content (threats, harassment, incitement).</li>
              <li>Political or extremist content unrelated to genuine job opportunities.</li>
              <li>Illegal content (drugs, fraud, weapons, terrorism).</li>
              <li>Sensitive personal data unless strictly necessary for hiring.</li>
              <li>Spam, scams, or misleading information.</li>
            </ul>
            <p>Violation of these rules can result in suspension or permanent account removal.</p>
          </section>

          <section className="terms-section">
            <h3>5. Content Ownership & License</h3>
            <ul>
              <li>You retain ownership of the content you upload.</li>
              <li>By uploading, you grant SwipeScout a worldwide, non-exclusive license to host, display, and share your content within the platform for its intended purpose (job matching).</li>
              <li>We will never sell your content.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>6. Messaging & Communication</h3>
            <ul>
              <li>SwipeScout provides in-app messaging between job seekers and employers.</li>
              <li>Messages must remain professional and relevant to hiring.</li>
              <li>We may monitor/report abuse to protect safety and compliance.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>7. Prohibited Uses</h3>
            <p>You may not:</p>
            <ul>
              <li>Use SwipeScout to harass, exploit, or scam others.</li>
              <li>Attempt to hack, reverse-engineer, or disrupt the platform.</li>
              <li>Collect or harvest user data without permission.</li>
              <li>Misuse SwipeScout for non-recruitment activities.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>8. Service Availability</h3>
            <p>
              SwipeScout is an early-stage service. We do not guarantee continuous uptime, bug-free performance, or specific outcomes (employment, hires, offers).
            </p>
          </section>

          <section className="terms-section">
            <h3>9. Liability Disclaimer</h3>
            <p>SwipeScout is not responsible for:</p>
            <ul>
              <li>Hiring decisions made by employers.</li>
              <li>Job offers, rejections, or outcomes from using the platform.</li>
              <li>Misrepresentation by users (job seekers or employers).</li>
              <li>Losses, damages, or disputes between users.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>10. Indemnity</h3>
            <p>
              You agree to indemnify and hold harmless SwipeScout, its officers, and employees from any claims, damages, or disputes arising from your misuse of the platform or violation of these Terms.
            </p>
          </section>

          <section className="terms-section">
            <h3>11. Termination</h3>
            <ul>
              <li>We may suspend or delete accounts that violate these Terms.</li>
              <li>You may close your account at any time.</li>
              <li>Content may remain for a short period after termination for security/legal reasons.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>12. Changes to Terms</h3>
            <p>
              We may update these Terms when necessary. Users will be notified of material changes via email or in-app notice.
            </p>
          </section>

          <section className="terms-section">
            <h3>13. Dispute Resolution</h3>
            <ul>
              <li>These Terms are governed by the laws of England and Wales.</li>
              <li>Disputes shall be resolved in the courts of England and Wales.</li>
              <li>Before legal action, both parties agree to attempt informal resolution via email contact.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h3>14. Contact Us</h3>
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

export default TermsOfService; 