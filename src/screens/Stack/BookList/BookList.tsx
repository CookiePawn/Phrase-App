import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
} from 'react-native';
import { Book } from '@/models';
import { classicBooks } from '@/dummy';
import { SearchForm, SortDropdown } from '@/components';
import { colors, style } from '@/styles';
import { RenderBookItem, HeaderSection } from './components';

type SortOption = '담은순' | '낮은가격순' | '높은가격순' | '할인율순' | '브랜드이름순';

const BookList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(classicBooks);
  const [selectedSort, setSelectedSort] = useState<SortOption>('담은순');

  useEffect(() => {
    let filtered = classicBooks.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 정렬 적용
    switch (selectedSort) {
      case '담은순':
        filtered = filtered.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case '낮은가격순':
        filtered = filtered.sort((a, b) => (a.readCount ?? 0) - (b.readCount ?? 0));
        break;
      case '높은가격순':
        filtered = filtered.sort((a, b) => (b.readCount ?? 0) - (a.readCount ?? 0));
        break;
      case '할인율순':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case '브랜드이름순':
        filtered = filtered.sort((a, b) => a.author.localeCompare(b.author));
        break;
      default:
        break;
    }

    setFilteredBooks(filtered);
  }, [searchQuery, selectedSort]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 */}
      <HeaderSection />

      {/* 정렬 */}
      <SortDropdown
        selectedSort={selectedSort}
        onSelectSort={(sort) => {
          setSelectedSort(sort as SortOption);
        }}
      />

      {/* 검색 */}
      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 리스트 */}
      <FlatList
        data={filteredBooks}
        renderItem={({ item }) => <RenderBookItem book={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: style.CONTENT_PADDING,
  },
});

export default BookList;