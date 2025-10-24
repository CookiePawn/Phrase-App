import { colors, font, style } from '@/styles';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GoalSectionProps {
    streakCount: number;
    setStreakCount: (count: number) => void;
}

const GoalSection = ({ streakCount, setStreakCount }: GoalSectionProps) => {
    const [attendanceChecked, setAttendanceChecked] = useState(false);
    const [attendanceDates, setAttendanceDates] = useState<string[]>([]);

    useEffect(() => {
        const loadAttendanceData = async () => {
            // 출석체크 데이터 로드
            const today = new Date().toDateString();
            const storedAttendance = await AsyncStorage.getItem('attendanceDates');
            if (storedAttendance) {
                const dates = JSON.parse(storedAttendance);

                setAttendanceDates(dates);
                setAttendanceChecked(dates.includes(today));
                setStreakCount(dates.length);
            }
        };
        loadAttendanceData();
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
    );
};

const styles = StyleSheet.create({
    goalSection: {
        marginHorizontal: style.CONTENT_PADDING,
        marginTop: style.SECTION_MARGIN,
        padding: style.SECTION_MARGIN,
        backgroundColor: colors.background,
        borderRadius: style.BORDER_RADIUS,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    goalTextContainer: {
        flex: 1,
    },
    goalText: {
        fontSize: font.FONT_SIZE_MEDIUM * 0.9,
        fontFamily: 'MinSans-Bold',
        color: colors.black,
        marginBottom: 4,
    },
    goalSubtext: {
        fontSize: font.FONT_SIZE_SMALL,
        fontFamily: 'MinSans-Medium',
        color: colors.gray500,
    },
    checkInButton: {
        backgroundColor: colors.black,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
    checkInButtonText: {
        fontSize: font.FONT_SIZE_SMALL,
        fontFamily: 'MinSans-Bold',
        color: colors.white,
    },
    checkInButtonDisabled: {
        backgroundColor: colors.gray200,
    },
    checkInButtonTextDisabled: {
        color: colors.gray500,
    },
});

export default GoalSection;