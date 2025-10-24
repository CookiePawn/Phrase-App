import React from 'react';
import {
    View,
    TextInput,
    StyleSheet
} from 'react-native';

interface SearchFormProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="소설 제목 또는 작가 검색"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        width: '100%',
        marginVertical: 10,
    },
    searchInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 15,
        fontFamily: 'MinSans-Bold',
        width: '100%',
    },
});

export default SearchForm;