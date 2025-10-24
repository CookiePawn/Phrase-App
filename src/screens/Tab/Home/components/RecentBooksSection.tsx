import { BookItem } from '@/components';
import { CurrentReadingInfo } from '@/models';
import { colors, font, style } from '@/styles';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecentBooksSectionProps {
    currentReadingInfo: CurrentReadingInfo | null;
}

const RecentBooksSection = ({ currentReadingInfo }: RecentBooksSectionProps) => {

    if (!currentReadingInfo) {
        return null;
    }

    return (
        <>
            <View style={styles.recentBooksSection}>
                <Text style={styles.sectionTitle}>최근 읽은 도서</Text>
                <BookItem
                    title={currentReadingInfo.title}
                    author={currentReadingInfo.author}
                    progressText={`진행중 ${currentReadingInfo.percentage}%`}
                    wordCount={`총 ${currentReadingInfo.totalSteps.toLocaleString()}자`}
                />
            </View>

            <View style={styles.popularBooksSection}>
                <Text style={styles.sectionTitle}>인기 도서</Text>
                <BookItem
                    title={currentReadingInfo.title}
                    author={currentReadingInfo.author}
                    progressText={`진행중 ${currentReadingInfo.percentage}%`}
                    wordCount={`총 ${currentReadingInfo.totalSteps.toLocaleString()}자`}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    recentBooksSection: {
        marginHorizontal: style.CONTENT_PADDING,
        marginTop: style.SECTION_MARGIN * 1.5,
    },
    popularBooksSection: {
        marginHorizontal: style.CONTENT_PADDING,
        marginTop: style.SECTION_MARGIN * 1.5,
    },
    sectionTitle: {
        fontSize: font.FONT_SIZE_MEDIUM,
        fontFamily: 'MinSans-Bold',
        color: colors.black,
    },
});

export default RecentBooksSection;