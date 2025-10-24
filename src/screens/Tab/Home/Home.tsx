import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@/navigations';
import { useFocusEffect } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { readingProgressManager, getTodayStepCount } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { classicBooks } from '@/dummy';
import { BookItem } from '@/components';
import { Assets } from '@/assets';

// 고정 상수들 - UI 점프 방지
const HEADER_HEIGHT = 60;
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 100 : 90;
const NAVIGATOR_HEIGHT = TAB_BAR_HEIGHT;
const CONTENT_PADDING = 20;
const SECTION_MARGIN = 20;
const BORDER_RADIUS = 12;
const FONT_SIZE_LARGE = 36;
const FONT_SIZE_MEDIUM = 16;
const FONT_SIZE_SMALL = 14;

const Home = () => {
  const navigation = useNavigation();

  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [todaySteps, setTodaySteps] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [currentReadingInfo, setCurrentReadingInfo] = useState<{
    title: string;
    author: string;
    unlockedSteps: number;
    totalSteps: number;
    percentage: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 현재 독서 정보 로드 함수
  const loadCurrentReadingInfo = async () => {
    try {
      const lastBookId = await AsyncStorage.getItem('currentReadingBook');
      if (lastBookId) {
        const progress = await readingProgressManager.getBookProgress(lastBookId);
        const book = classicBooks.find(b => b.id === lastBookId);
        if (progress && book) {
          // 인간문제 데이터 수정 로직 - totalCharacters가 올바른 값인지 확인
          if (lastBookId === '11' && progress.totalCharacters !== book.readCount) {
            console.log('인간문제 데이터 수정 중... 기존:', progress.totalCharacters, '새로운:', book.readCount);
            progress.totalCharacters = book.readCount ?? 0;
            await readingProgressManager.saveBookProgress(progress);
          }

          // 광염소나타 데이터 수정 로직
          if (lastBookId === '10' && progress.bookTitle !== book.title) {
            console.log('광염소나타 데이터 수정 중...');
            progress.bookTitle = book.title;
            await readingProgressManager.saveBookProgress(progress);
          }

          setCurrentReadingInfo({
            title: book.title, // classicBooks에서 가져온 올바른 제목 사용
            author: book.author,
            unlockedSteps: progress.unlockedCharacters,
            totalSteps: progress.totalCharacters,
            percentage: Math.round((progress.unlockedCharacters / progress.totalCharacters) * 100)
          });
        }
      }
    } catch (error) {
      console.log('현재 독서 정보 로드 실패:', error);
    }
  };

  // 화면이 포커스될 때마다 데이터 업데이트
  useFocusEffect(
    useCallback(() => {
      const updateData = async () => {
        console.log('📱 MainScreen 포커스됨 - 데이터 업데이트');

        // 현재 독서 정보 업데이트
        await loadCurrentReadingInfo();

        // 걸음수 업데이트
        try {
          const steps = await getTodayStepCount();
          console.log(`📊 MainScreen 걸음수 업데이트: ${steps}걸음`);
          setTodaySteps(steps);
        } catch (error) {
          console.error('MainScreen 걸음수 업데이트 실패:', error);
        }
      };

      updateData();
    }, [])
  );

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        // 출석체크 데이터 로드
        const today = new Date().toDateString();
        const storedAttendance = await AsyncStorage.getItem('attendanceDates');
        if (storedAttendance) {
          const dates = JSON.parse(storedAttendance);
          setAttendanceDates(dates);
          setAttendanceChecked(dates.includes(today));
          setStreakCount(dates.length);
        }

        // 오늘 걸음수 로드
        const steps = await getTodayStepCount();
        setTodaySteps(steps);

        // 앱 시작 시 모든 책의 진도 업데이트 (앱이 꺼진 동안 쌓인 걸음수 반영)
        await readingProgressManager.updateAllBooksProgress();

        // 현재 독서 정보 로드
        await loadCurrentReadingInfo();
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };

    loadData().finally(() => setIsLoading(false));

    // 30초마다 실시간 업데이트
    const interval = setInterval(async () => {
      try {
        const steps = await getTodayStepCount();
        setTodaySteps(steps);
      } catch (error) {
        console.error('실시간 걸음수 업데이트 실패:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // 출석체크 함수
  const handleCheckIn = async () => {
    try {
      const today = new Date().toDateString();
      if (!attendanceChecked) {
        const newAttendanceDates = [...attendanceDates, today];
        setAttendanceDates(newAttendanceDates);
        setAttendanceChecked(true);
        setStreakCount(newAttendanceDates.length);
        await AsyncStorage.setItem('attendanceDates', JSON.stringify(newAttendanceDates));
      }
    } catch (error) {
      console.error('출석체크 저장 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Assets.Images.LOGO width={82} height={26} />
        <TouchableOpacity style={styles.notificationButton}>
          <View style={styles.notificationIcon}>
            <SvgXml
              xml={`<svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.89209 0C6.60498 0 6.36914 0.0922852 6.18457 0.276855C6 0.461426 5.90771 0.697266 5.90771 0.984375V1.56885C4.75928 1.81494 3.82617 2.37891 3.1084 3.26074C2.37012 4.14258 1.99072 5.18848 1.97021 6.39844V6.98291C1.94971 8.45947 1.45752 9.76172 0.493652 10.8896L0.247559 11.1665C-0.019043 11.4741 -0.0703125 11.8228 0.09375 12.2124C0.27832 12.5815 0.575684 12.7764 0.98584 12.7969H12.7983C13.2085 12.7764 13.5059 12.5815 13.6904 12.2124C13.8545 11.8228 13.8032 11.4741 13.5366 11.1665L13.3213 10.8896C12.3369 9.78223 11.8345 8.47998 11.814 6.98291V6.39844C11.7935 5.18848 11.4141 4.14258 10.6758 3.26074C9.95801 2.37891 9.0249 1.81494 7.87646 1.56885V0.984375C7.87646 0.697266 7.78418 0.461426 7.59961 0.276855C7.41504 0.0922852 7.1792 0 6.89209 0ZM8.27637 15.1655C8.66602 14.7759 8.86084 14.3145 8.86084 13.7812H6.89209H4.92334C4.92334 14.3145 5.11816 14.7759 5.50781 15.1655C5.89746 15.5552 6.35889 15.75 6.89209 15.75C7.42529 15.75 7.88672 15.5552 8.27637 15.1655Z" fill="#4B5563"/>
</svg>`}
              width={14}
              height={16}
            />
            <View style={styles.notificationDot} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <>
            {/* 로딩 플레이스홀더 */}
            <View style={styles.todaySection}>
              <View style={styles.todayHeader}>
                <Text style={styles.todayTitle}>오늘의 걸음</Text>
                <Text style={styles.todayCount}>0</Text>
              </View>
              <View style={styles.streakContainer}>
                <Text style={styles.streakIcon}>🔥</Text>
                <Text style={styles.streakText}>연속 0일 달성중</Text>
              </View>
            </View>

            <View style={styles.currentReadingSection}>
              <View style={styles.currentReadingHeader}>
                <Text style={styles.sectionTitle}>현재 독서중: 도서를 선택해주세요</Text>
                <Text style={styles.sectionArrow}>›</Text>
              </View>
              <View style={styles.divider}></View>
              <View style={styles.readingProgressContainer}>
                <Text style={styles.readingProgress}>0 / 0자</Text>
                <Text style={styles.readingPercentage}>진행률 0%</Text>
              </View>
            </View>

            <View style={styles.goalSection}>
              <View style={styles.goalTextContainer}>
                <Text style={styles.goalText}>1000걸음 걷고 출석하기</Text>
                <Text style={styles.goalSubtext}>0일 연속 출석했어요!</Text>
              </View>
              <View style={[styles.checkInButton, styles.checkInButtonDisabled]}>
                <Text style={styles.checkInButtonTextDisabled}>출석하기</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* 오늘의 걸음 */}
            <View style={styles.todaySection}>
              <View style={styles.todayHeader}>
                <Text style={styles.todayTitle}>오늘의 걸음</Text>
                <Text style={styles.todayCount}>{todaySteps.toLocaleString()}</Text>
              </View>
              <View style={styles.streakContainer}>
                <Text style={styles.streakIcon}>🔥</Text>
                <Text style={styles.streakText}>연속 {streakCount}일 달성중</Text>
              </View>
            </View>

            {/* 현재 독서중 */}
            <TouchableOpacity
              style={styles.currentReadingSection}
              onPress={() => navigation.navigate('BookList')}
            >
              <View style={styles.currentReadingHeader}>
                <Text style={styles.sectionTitle}>현재 독서중: {currentReadingInfo?.title || '도서를 선택해주세요'}</Text>
                <Text style={styles.sectionArrow}>›</Text>
              </View>
              <View style={styles.divider}></View>
              <View style={styles.readingProgressContainer}>
                <Text style={styles.readingProgress}>{currentReadingInfo?.unlockedSteps?.toLocaleString() || '0'} / {currentReadingInfo?.totalSteps?.toLocaleString() || '0'}자</Text>
                <Text style={styles.readingPercentage}>진행률 {currentReadingInfo?.percentage || 0}%</Text>
              </View>
            </TouchableOpacity>

            {/* 1000걸음 목표 달성하기 */}
            <View style={styles.goalSection}>
              <View style={styles.goalTextContainer}>
                <Text style={styles.goalText}>1000걸음 걷고 출석하기</Text>
                <Text style={styles.goalSubtext}>{streakCount}일 연속 출석했어요!</Text>
              </View>
              <TouchableOpacity
                style={[styles.checkInButton, attendanceChecked && styles.checkInButtonDisabled]}
                onPress={handleCheckIn}
                disabled={attendanceChecked}
              >
                <Text style={[styles.checkInButtonText, attendanceChecked && styles.checkInButtonTextDisabled]}>
                  {attendanceChecked ? '출석완료' : '출석하기'}
                </Text>
              </TouchableOpacity>
            </View>

          </>
        )}

        {/* 최근 읽은 도서 */}
        {currentReadingInfo && (
          <View style={styles.recentBooksSection}>
            <Text style={styles.sectionTitle}>최근 읽은 도서</Text>
            <BookItem
              title={currentReadingInfo.title}
              author={currentReadingInfo.author}
              progressText={`진행중 ${currentReadingInfo.percentage}%`}
              wordCount={`총 ${currentReadingInfo.totalSteps.toLocaleString()}자`}
            />
          </View>
        )}

        {/* 인기 도서 */}
        {currentReadingInfo && (
          <View style={styles.popularBooksSection}>
            <Text style={styles.sectionTitle}>인기 도서</Text>
            <BookItem
              title={currentReadingInfo.title}
              author={currentReadingInfo.author}
              progressText={`진행중 ${currentReadingInfo.percentage}%`}
              wordCount={`총 ${currentReadingInfo.totalSteps.toLocaleString()}자`}
            />
          </View>
        )}

        {/* 하단 여백 */}
        <View style={styles.bottomPadding}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 44,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONTENT_PADDING,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  scrollView: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + HEADER_HEIGHT : 104,
    left: 0,
    right: 0,
    bottom: NAVIGATOR_HEIGHT,
  },
  todaySection: {
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: CONTENT_PADDING,
    paddingBottom: CONTENT_PADDING * 0.6,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  todayTitle: {
    fontSize: FONT_SIZE_MEDIUM,
    fontFamily: 'MinSans-Medium',
    color: '#000',
  },
  todayCount: {
    fontSize: FONT_SIZE_LARGE,
    fontFamily: 'MinSans-Bold',
    color: '#000',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  streakIcon: {
    fontSize: 14,
  },
  streakText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: 'MinSans-Medium',
    color: '#666',
    marginLeft: 4,
  },
  currentReadingSection: {
    marginHorizontal: CONTENT_PADDING,
    marginTop: SECTION_MARGIN * 0.7,
    padding: SECTION_MARGIN,
    backgroundColor: '#F9F9F9',
    borderRadius: BORDER_RADIUS,
  },
  currentReadingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZE_MEDIUM,
    fontFamily: 'MinSans-Bold',
    color: '#000',
  },
  sectionArrow: {
    fontSize: 18,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 10,
  },
  readingProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readingProgress: {
    fontSize: FONT_SIZE_MEDIUM * 0.9,
    fontFamily: 'MinSans-Medium',
    color: '#666',
  },
  readingPercentage: {
    fontSize: FONT_SIZE_MEDIUM * 0.9,
    fontFamily: 'MinSans-Medium',
    color: '#666',
  },
  goalSection: {
    marginHorizontal: CONTENT_PADDING,
    marginTop: SECTION_MARGIN,
    padding: SECTION_MARGIN,
    backgroundColor: '#F9F9F9',
    borderRadius: BORDER_RADIUS,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTextContainer: {
    flex: 1,
  },
  goalText: {
    fontSize: FONT_SIZE_MEDIUM * 0.9,
    fontFamily: 'MinSans-Bold',
    color: '#000',
    marginBottom: 4,
  },
  goalSubtext: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: 'MinSans-Medium',
    color: '#666',
  },
  checkInButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  checkInButtonText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: 'MinSans-Bold',
    color: '#FFF',
  },
  checkInButtonDisabled: {
    backgroundColor: '#CCC',
  },
  checkInButtonTextDisabled: {
    color: '#888',
  },
  recentBooksSection: {
    marginHorizontal: CONTENT_PADDING,
    marginTop: SECTION_MARGIN * 1.5,
  },
  popularBooksSection: {
    marginHorizontal: CONTENT_PADDING,
    marginTop: SECTION_MARGIN * 1.5,
  },

  bottomPadding: {
    height: 20,
  },

});

export default Home;