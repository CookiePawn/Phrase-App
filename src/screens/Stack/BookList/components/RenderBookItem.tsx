import { colors } from '@/styles';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '@/models';
import { useNavigation } from '@/navigations';

interface RenderBookItemProps {
    book: Book;
}
const RenderBookItem = ({ book }: RenderBookItemProps) => {
    const navigation = useNavigation();

    const formatReadCount = (count: number): string => {
        return `총 ${Math.floor(count / 1000)},${String(count % 1000).padStart(3, '0')}자`;
    };

    return (
        <TouchableOpacity
            style={styles.bookItem}
            onPress={() => navigation.navigate('BookDetail', { bookId: book.id })}
        >
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
            </View>
            <Text style={styles.readCount}>{formatReadCount(book.readCount ?? 0)}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    bookItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.gray200,
        borderRadius: 16,
    },
    bookInfo: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontFamily: 'MinSans-Bold',
        color: colors.black,
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 14,
        fontFamily: 'MinSans-Medium',
        color: colors.gray500,
    },
    readCount: {
        fontSize: 12,
        fontFamily: 'MinSans-Medium',
        color: colors.gray500,
    },
});

export default RenderBookItem;