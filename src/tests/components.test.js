import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import VideoFeed from '../pages/VideoFeed';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import JobVideos from '../pages/JobVideos';
import CompanyVideos from '../pages/CompanyVideos';
import Settings from '../pages/Settings';
import JobSeekerDashboard from '../pages/JobSeekerDashboard';
import EmployerDashboard from '../pages/EmployerDashboard';

// Mock للخدمات
jest.mock('../services/jobService', () => ({
  getRecommendedJobs: jest.fn().mockResolvedValue({
    data: {
      recommendations: [
        {
          job: {
            id: '1',
            title: 'مطور واجهة أمامية',
            company: {
              name: 'شركة التقنية',
              logo_url: '/logo.png'
            },
            location: 'الرياض',
            employment_type: 'دوام كامل',
            skills: [{ id: '1', name: 'React' }],
            video_url: '/video.mp4'
          }
        }
      ]
    }
  }),
  recordSwipe: jest.fn().mockResolvedValue({ data: { success: true } })
}));

jest.mock('../services/chatService', () => ({
  getConversations: jest.fn().mockResolvedValue({
    data: {
      conversations: [
        {
          id: '1',
          other_user: {
            id: '2',
            name: 'أحمد محمد',
            photo_url: '/avatar.png',
            role: 'employer'
          },
          last_message: {
            content: 'مرحباً، هل أنت مهتم بالوظيفة؟',
            created_at: '2025-04-18T12:00:00Z'
          },
          unread_count: 2
        }
      ]
    }
  }),
  getMessages: jest.fn().mockResolvedValue({
    data: {
      messages: [
        {
          id: '1',
          sender_id: '2',
          content: 'مرحباً، هل أنت مهتم بالوظيفة؟',
          created_at: '2025-04-18T12:00:00Z',
          read: true
        }
      ]
    }
  }),
  sendMessage: jest.fn().mockResolvedValue({ data: { success: true } })
}));

jest.mock('../hooks/useAuth', () => ({
  useAuth: jest.fn().mockReturnValue({
    user: {
      id: '1',
      name: 'محمد أحمد',
      email: 'mohammed@example.com',
      role: 'job_seeker',
      photo_url: '/avatar.png'
    },
    loading: false
  })
}));

// مكون الاختبار المساعد
const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('SwipeScout Frontend Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('VideoFeed Component', () => {
    test('يعرض فيديو الوظيفة وأزرار السحب', async () => {
      renderWithProviders(<VideoFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('مطور واجهة أمامية')).toBeInTheDocument();
        expect(screen.getByText('شركة التقنية')).toBeInTheDocument();
        expect(screen.getByLabelText('مهتم')).toBeInTheDocument();
        expect(screen.getByLabelText('غير مهتم')).toBeInTheDocument();
      });
    });
  });

  describe('Chat Component', () => {
    test('يعرض قائمة المحادثات والرسائل', async () => {
      renderWithProviders(<Chat />);
      
      await waitFor(() => {
        expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
        expect(screen.getByText('مرحباً، هل أنت مهتم بالوظيفة؟')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    test('يتكيف مع أحجام الشاشات المختلفة', () => {
      // تغيير حجم النافذة لمحاكاة الجهاز المحمول
      global.innerWidth = 480;
      global.dispatchEvent(new Event('resize'));
      
      renderWithProviders(<VideoFeed />);
      
      // التحقق من تطبيق أنماط الجهاز المحمول
      const videoContainer = document.querySelector('[class*="VideoContainer"]');
      expect(videoContainer).toHaveStyle({ height: 'calc(100vh - 56px)' });
    });
  });

  describe('Performance Optimization', () => {
    test('يتم تحميل مكونات الصفحة بشكل فعال', async () => {
      const startTime = performance.now();
      
      renderWithProviders(<VideoFeed />);
      
      await waitFor(() => {
        expect(screen.getByText('مطور واجهة أمامية')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // التحقق من أن وقت التحميل أقل من 500 مللي ثانية
      expect(loadTime).toBeLessThan(500);
    });
  });
});
