import { classicBooks } from '@/dummy';
import { CurrentReadingInfo } from '@/models';
import { colors, style } from '@/styles';
import { font } from '@/styles';
import { getTodayStepCount, readingProgressManager } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TodaySectionProps {
    streakCount: number;
    setCurrentReadingInfo: (info: CurrentReadingInfo | null) => void;
}

const TodaySection = ({ streakCount, setCurrentReadingInfo }: TodaySectionProps) => {
    const [todaySteps, setTodaySteps] = useState<number>(0);

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

    useEffect(() => {
        const updateData = async () => {
            // 현재 독서 정보 업데이트
            await loadCurrentReadingInfo();

            // 걸음수 업데이트
            try {
                const steps = await getTodayStepCount();
                setTodaySteps(steps);
            } catch (error) {
                console.error('MainScreen 걸음수 업데이트 실패:', error);
            }
        };

        updateData();
    }, []);
    return (
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
    );
};

const styles = StyleSheet.create({
    todaySection: {
        paddingHorizontal: style.CONTENT_PADDING,
        paddingTop: style.CONTENT_PADDING,
        paddingBottom: style.CONTENT_PADDING * 0.6,
    },
    todayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    todayTitle: {
        fontSize: font.FONT_SIZE_MEDIUM,
        fontFamily: 'MinSans-Medium',
        color: colors.black,
    },
    todayCount: {
        fontSize: font.FONT_SIZE_LARGE,
        fontFamily: 'MinSans-Bold',
        color: colors.black,
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
        fontSize: font.FONT_SIZE_SMALL,
        fontFamily: 'MinSans-Medium',
        color: colors.gray500,
        marginLeft: 4,
    },
});

export default TodaySection;