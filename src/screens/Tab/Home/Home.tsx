import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { colors, font, style } from '@/styles';
import { CurrentReadingInfo } from '@/models';
import { CurrentReadingSection, GoalSection, TodaySection, HeaderSection, RecentBooksSection } from './components';

const Home = () => {
  const [streakCount, setStreakCount] = useState<number>(0);
  const [currentReadingInfo, setCurrentReadingInfo] = useState<CurrentReadingInfo | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 영역 */}
      <HeaderSection />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 오늘의 걸음 */}
        <TodaySection streakCount={streakCount} setCurrentReadingInfo={setCurrentReadingInfo} />

        {/* 현재 독서중 */}
        <CurrentReadingSection currentReadingInfo={currentReadingInfo} />

        {/* 1000걸음 목표 달성하기 */}
        <GoalSection streakCount={streakCount} setStreakCount={setStreakCount} />

        {/* 최근 읽은 도서 */}
        <RecentBooksSection currentReadingInfo={currentReadingInfo} />

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
    backgroundColor: colors.white,
  },

  currentReadingSection: {
    marginHorizontal: style.CONTENT_PADDING,
    marginTop: style.SECTION_MARGIN * 0.7,
    padding: style.SECTION_MARGIN,
    backgroundColor: colors.background,
    borderRadius: style.BORDER_RADIUS,
  },
  currentReadingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: font.FONT_SIZE_MEDIUM,
    fontFamily: 'MinSans-Bold',
    color: colors.black,
  },
  sectionArrow: {
    fontSize: 18,
    color: colors.gray500,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 10,
  },
  readingProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readingProgress: {
    fontSize: font.FONT_SIZE_MEDIUM * 0.9,
    fontFamily: 'MinSans-Medium',
    color: colors.gray500,
  },
  readingPercentage: {
    fontSize: font.FONT_SIZE_MEDIUM * 0.9,
    fontFamily: 'MinSans-Medium',
    color: colors.gray500,
  },

  bottomPadding: {
    height: 20,
  },
});

export default Home;