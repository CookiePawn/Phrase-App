import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@/navigations';
import { colors, font, style } from '@/styles';
import { CurrentReadingInfo } from '@/models';

interface SelectBookProps {
    currentReadingInfo?: CurrentReadingInfo | null;
}

const SelectBook = ({ currentReadingInfo }: SelectBookProps) => {
    const navigation = useNavigation();

    return (
        < TouchableOpacity
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
        </TouchableOpacity >
    );
};

const styles = StyleSheet.create({
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
});

export default SelectBook;