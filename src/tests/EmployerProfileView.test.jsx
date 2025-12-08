import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import EmployerProfileView from '@/pages/EmployerProfileView';

jest.mock('@/services/api', () => ({
  getEmployerPublicProfile: jest.fn().mockResolvedValue({ data: { id: 'emp-1', userId: 'emp-1', companyName: 'ACME', description: 'We build things' } }),
  getUserVideosByUserId: jest.fn().mockResolvedValue({ data: { videos: [] } }),
  getEmployerPublicJobs: jest.fn().mockResolvedValue({ data: { jobs: [ { id: 'job-1', title: 'Senior Dev', status: 'active' }, { id: 'job-2', title: 'Junior Dev', status: 'active' } ] } }),
  getPublicProfile: jest.fn().mockResolvedValue({ data: { profile: { profileViews: 0 } } }),
  getApplications: jest.fn().mockResolvedValue({ data: { applications: [ { id: 'app-1', jobId: 'job-1' } ] } }),
  applyToJob: jest.fn()
}));

jest.mock('@/services/connectionService.js', () => ({
  sendConnection: jest.fn().mockResolvedValue({ data: { connection: { id: 'c1', status: 'pending', isSender: true, userOne: { id: 'user-1' }, userTwo: { id: 'emp-1' } } } }),
  getConnectionStatus: jest.fn().mockResolvedValue({ data: { connection: null } }),
  deleteConnection: jest.fn().mockResolvedValue({ data: { success: true } }),
  acceptConnection: jest.fn().mockResolvedValue({ data: { connection: { id: 'c1', status: 'accepted' } } }),
  rejectConnection: jest.fn().mockResolvedValue({ data: { connection: null } })
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn().mockReturnValue({
    user: { id: 'user-1', displayName: 'Test User' },
    role: 'job_seeker',
    loading: false
  })
}));

const renderWithRouter = (ui, route = '/employer-profile/emp-1') => {
  return render(
    <BrowserRouter>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/employer-profile/:userId" element={ui} />
        </Routes>
      </MemoryRouter>
    </BrowserRouter>
  );
};

describe('EmployerProfileView', () => {
  beforeEach(() => jest.clearAllMocks());

  test('applied jobs are disabled and show Applied label for jobseekers', async () => {
    renderWithRouter(<EmployerProfileView />);
    // Wait for jobs to load
    await waitFor(() => expect(screen.getByText('Senior Dev')).toBeInTheDocument());

    // 'Senior Dev' corresponds to job-1 which the user has applied to
    const appliedButton = screen.getByRole('button', { name: /Applied/i });
    expect(appliedButton).toBeDisabled();

    // 'Junior Dev' should show an Apply button
    const applyBtn = screen.getByRole('button', { name: /Apply/i });
    expect(applyBtn).toBeEnabled();
  });

  test('connect -> pending -> disconnect flow', async () => {
    renderWithRouter(<EmployerProfileView />);
    // Wait for initial jobs to render
    await waitFor(() => expect(screen.getByText('Senior Dev')).toBeInTheDocument());

    // Initially, no connection status => show Connect button
    const connectBtn = screen.getByRole('button', { name: /Connect/i });
    expect(connectBtn).toBeInTheDocument();

    // Click connect -> calls sendConnection and shows Cancel request
    connectBtn.click();
    expect(require('@/services/connectionService.js').sendConnection).toHaveBeenCalledWith('emp-1');
    await waitFor(() => expect(screen.getByRole('button', { name: /Cancel request/i })).toBeInTheDocument());

    // Now simulate backend returns accepted on refresh: connection.status = accepted
    const m = require('@/services/connectionService.js');
    m.getConnectionStatus.mockResolvedValue({ data: { connection: { id: 'c1', status: 'accepted', isSender: true, userOne: { id: 'user-1' }, userTwo: { id: 'emp-1' } } } });
    // Re-render to simulate navigation or refresh
    renderWithRouter(<EmployerProfileView />);
    await waitFor(() => expect(screen.getByText('Connected')).toBeInTheDocument());

    // Click disconnect
    const disconnectBtn = screen.getByRole('button', { name: /Disconnect/i });
    expect(disconnectBtn).toBeInTheDocument();
    disconnectBtn.click();
    expect(require('@/services/connectionService.js').deleteConnection).toHaveBeenCalledWith('c1');
    await waitFor(() => expect(screen.getByRole('button', { name: /Connect/i })).toBeInTheDocument());
  });
});
