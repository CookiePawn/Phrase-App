import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

interface BookItemProps {
    title: string;
    author: string;
    progressText: string;
    wordCount: string;
    onPress?: () => void;
}

const BookItem: React.FC<BookItemProps> = ({
    title,
    author,
    progressText,
    wordCount,
    onPress,
}) => {
    return (
        onPress ? (
            <TouchableOpacity style={styles.bookItem} onPress={onPress}>
                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{title}</Text>
                    <Text style={styles.bookAuthor}>{author}</Text>
                </View>
                <View style={styles.bookProgress}>
                    <Text style={styles.progressText}>{progressText}</Text>
                    <Text style={styles.wordCount}>{wordCount}</Text>
                </View>
            </TouchableOpacity>
        ) : (
            <View style={styles.bookItem}>
                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{title}</Text>
                    <Text style={styles.bookAuthor}>{author}</Text>
                </View>
                <View style={styles.bookProgress}>
                    <Text style={styles.progressText}>{progressText}</Text>
                    <Text style={styles.wordCount}>{wordCount}</Text>
                </View>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    bookItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 16,
        padding: 15,
        marginTop: 10,
        width: '100%',
    },
    bookInfo: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontFamily: 'MinSans-Bold',
        color: '#000',
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 14,
        fontFamily: 'MinSans-Medium',
        color: '#666',
    },
    bookProgress: {
        alignItems: 'flex-end',
    },
    progressText: {
        fontSize: 14,
        fontFamily: 'MinSans-Medium',
        color: '#666',
        marginBottom: 2,
    },
    wordCount: {
        fontSize: 12,
        fontFamily: 'MinSans-Medium',
        color: '#999',
    },
});

export default BookItem;