import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JobApplicantsPage from '@/pages/JobApplicantsPage.jsx';
import * as api from '@/services/api';
import { AuthProvider } from '@/contexts/AuthContext';

jest.mock('@/services/api');

const sampleApplicants = {
  data: {
    applicants: [
      {
        applicationId: 'app-1',
        appliedAt: '2025-11-01T12:00:00Z',
        status: 'pending',
        resumeUrl: null,
        applicantInfo: {
          userId: 'u1',
          displayName: 'Jane Doe',
          email: 'jane@example.com',
          profile: {
            title: 'Frontend Developer',
            bio: 'Experienced developer',
            location: 'Remote',
            profilePic: '',
            yearsOfExp: 5
          },
          skills: ['React', 'TypeScript'],
          educations: [{ degree: 'BSc Computer Science', institution: 'University' }]
        }
      }
    ]
  }
};

describe('JobApplicantsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders applicants and handles shortlist', async () => {
    api.getJobApplicants.mockResolvedValue(sampleApplicants);
    api.updateJobApplicationStatus.mockResolvedValue({ data: { status: 'accepted' } });

    render(
      <BrowserRouter>
        <AuthProvider>
          <JobApplicantsPage id="job-1" />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for the applicant to render
    await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument());

    // Click shortlist
    const shortlistBtn = screen.getByRole('button', { name: /Shortlist/i });
    fireEvent.click(shortlistBtn);

    await waitFor(() => expect(api.updateJobApplicationStatus).toHaveBeenCalledWith('app-1', 'accepted'));

    // Status updated in UI
    expect(screen.getByText(/Status: accepted/i)).toBeInTheDocument();
  });
});
