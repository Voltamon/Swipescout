import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const TikTokStyleFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // استدعاء API للحصول على الوظائف المطابقة
    fetchMatchingJobs();
  }, []);

  const fetchMatchingJobs = async () => {
    try {
      setLoading(true);
      // استبدل هذا برابط API الخاص بك
      const response = await fetch('https://api.swipescout.com/matching/jobs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setJobs(data.matches || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleSwipeUp = () => {
    // التمرير للأعلى = الوظيفة التالية
    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    
    // تسجيل السحب في قاعدة البيانات (تخطي)
    recordSwipe(jobs[currentIndex].job.id, 'up');
  };

  const handleSwipeDown = () => {
    // التمرير للأسفل = الوظيفة السابقة
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSwipeRight = () => {
    // السحب لليمين = مهتم
    recordSwipe(jobs[currentIndex].job.id, 'right');
    showInterestAnimation();
  };

  const handleSwipeLeft = () => {
    // السحب لليسار = غير مهتم
    recordSwipe(jobs[currentIndex].job.id, 'left');
    showNotInterestedAnimation();
  };

  const recordSwipe = async (jobId, direction) => {
    try {
      await fetch('https://api.swipescout.com/swipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          job_id: jobId,
          direction
        })
      });
    } catch (error) {
      console.error('Error recording swipe:', error);
    }
  };

  const showInterestAnimation = () => {
    // تنفيذ رسوم متحركة للاهتمام
  };

  const showNotInterestedAnimation = () => {
    // تنفيذ رسوم متحركة لعدم الاهتمام
  };

  const handleConnect = () => {
    // إظهار نافذة التأكيد للاتصال
    if (jobs[currentIndex]) {
      navigation.navigate('JobDetails', { job: jobs[currentIndex].job });
    }
  };

  const handleOpenProfile = () => {
    // فتح الملف الشخصي للشركة
    if (jobs[currentIndex]) {
      navigation.navigate('CompanyProfile', { company: jobs[currentIndex].job.company });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري تحميل الوظائف المطابقة...</Text>
      </View>
    );
  }

  if (jobs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="briefcase" size={50} color="#ccc" />
        <Text style={styles.emptyText}>لم يتم العثور على وظائف مطابقة</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchMatchingJobs}>
          <Text style={styles.refreshButtonText}>تحديث</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentJob = jobs[currentIndex]?.job;
  const matchScore = jobs[currentIndex]?.score;

  return (
    <View style={styles.container}>
      {currentJob && (
        <Animated.View 
          style={[
            styles.videoContainer,
            {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-300, 0, 300],
                    outputRange: [100, 0, -100],
                    extrapolate: 'clamp'
                  })
                }
              ]
            }
          ]}
        >
          <Video
            ref={videoRef}
            source={{ uri: currentJob.company.video_url || 'https://example.com/default.mp4' }}
            style={styles.video}
            resizeMode="cover"
            repeat
            muted={false}
            playInBackground={false}
            playWhenInactive={false}
          />
          
          {/* معلومات الوظيفة */}
          <View style={styles.jobInfoContainer}>
            <Text style={styles.companyName}>{currentJob.company.name}</Text>
            <Text style={styles.jobTitle}>{currentJob.title}</Text>
            <View style={styles.tagsContainer}>
              {currentJob.location && (
                <View style={styles.tag}>
                  <Icon name="map-marker-alt" size={12} color="#fff" />
                  <Text style={styles.tagText}>{currentJob.location}</Text>
                </View>
              )}
              {currentJob.employment_type && (
                <View style={styles.tag}>
                  <Icon name="clock" size={12} color="#fff" />
                  <Text style={styles.tagText}>{currentJob.employment_type}</Text>
                </View>
              )}
              {matchScore && (
                <View style={styles.matchTag}>
                  <Icon name="percentage" size={12} color="#fff" />
                  <Text style={styles.tagText}>{Math.round(matchScore)}% تطابق</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* أزرار التفاعل */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleOpenProfile}>
              <Icon name="building" size={24} color="#fff" />
              <Text style={styles.actionText}>الشركة</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
              <Text style={styles.connectButtonText}>تواصل</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
              <Icon name="share" size={24} color="#fff" />
              <Text style={styles.actionText}>مشاركة</Text>
            </TouchableOpacity>
          </View>
          
          {/* مؤشرات السحب */}
          <View style={styles.swipeIndicators}>
            <Icon name="chevron-up" size={20} color="#fff" style={styles.swipeUp} />
            <Text style={styles.swipeText}>اسحب لأعلى للتخطي</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  jobInfoContainer: {
    position: 'absolute',
    bottom: 120,
    left: 10,
    right: 10,
    padding: 10,
  },
  companyName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  jobTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  matchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.7)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  connectButton: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  swipeIndicators: {
    position: 'absolute',
    top: 20,
    alignItems: 'center',
    left: 0,
    right: 0,
  },
  swipeUp: {
    opacity: 0.7,
  },
  swipeText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TikTokStyleFeed;
