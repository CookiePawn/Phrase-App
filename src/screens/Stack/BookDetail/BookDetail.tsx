import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@/navigations';
import { classicBooks } from '@/dummy';
import { Button } from '@/components';
import { useState, useEffect } from 'react';
import { readingProgressManager } from '@/utils';
import { Assets } from '@/assets';
import { style, font, colors } from '@/styles';

// 고정 상수들 - UI 점프 방지
const BOOK_IMAGE_WIDTH = 200;
const BOOK_IMAGE_HEIGHT = 280;

const BookDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<'BookDetail'>();
  const { bookId } = route.params;
  
  const book = classicBooks.find(b => b.id === bookId);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await readingProgressManager.getBookProgress(bookId);
      const percentage = progress ? Math.floor((progress.unlockedCharacters / progress.totalCharacters) * 100) : 0;
      setProgressPercentage(percentage);
    };
    loadProgress();
  }, [bookId]);
  
  if (!book) {
    return (
      <View style={styles.container}>
        <Text>도서를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const formatReadCount = (count: number | undefined): string => {
    const safeCount = count ?? 0;
    return `총 ${Math.floor(safeCount / 1000)},${String(safeCount % 1000).padStart(3, '0')}자`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Assets.Icons.HEART width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 도서 이미지 */}
        {/* <View style={styles.imageContainer}>
          <SvgXml
            xml={book.title === '노인과 바다' ? 
              atob('PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMkY4MEVEIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNGRkQ3MDAiLz4KPHBhdGggZD0iTTUwIDI1MEM1MCAyNTAgMTAwIDIwMCAxNTAgMjIwQzIwMCAyNDAgMjUwIDI1MCAyNTAgMjUwIiBzdHJva2U9IiMwMDY2Q0MiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMTIwIDMwMEMxMjAgMzAwIDEzMCAyODAgMTUwIDI5MEMxNzAgMzAwIDE4MCAzMjAgMTgwIDMyMCIgc3Ryb2tlPSIjOEI0NTEzIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIHg9IjEzMCIgeT0iMjgwIj4KPGVsbGlwc2UgY3g9IjIwIiBjeT0iMTAiIHJ4PSIyMCIgcnk9IjEwIiBmaWxsPSIjOEI0NTEzIi8+CjwvZz4KPHRleHQgeD0iMTUwIiB5PSIzNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm9pbmdhIEJhZGE8L3RleHQ+Cjwvc3ZnPg==') :
            book.title === '1984' ?
              atob('PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMUExQTFBIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMzMzMiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSI2MCIgZmlsbD0iI0ZGMzMzMyIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjMDAwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj4xOTg0PC90ZXh0Pgo8dGV4dCB4PSIxNTAiIHk9IjM2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjQ0NDIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HZW9yZ2UgT3J3ZWxsPC90ZXh0Pgo8L3N2Zz4=') :
            book.title === '위대한 개츠비' ?
              atob('PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMDA0NzAwIi8+CjxjaXJjbGUgY3g9IjI1MCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiNGRkQ3MDAiLz4KPHBhdGggZD0iTTUwIDM1MEwyNTAgMTAwIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMyIvPgo8cmVjdCB4PSI4MCIgeT0iMjAwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwNjYwMCIvPgo8cmVjdCB4PSIxMDAiIHk9IjE4MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI0MCIgZmlsbD0iI0ZGRDcwMCIvPgo8dGV4dCB4PSIxNTAiIHk9IjM2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjRkZENzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HYXRzYnk8L3RleHQ+Cjwvc3ZnPg==') :
              atob('PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNEEzNzI4Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiM4QjQ1MTMiLz4KPHRleHQgeD0iMTUwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0ZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2xhc3NpYzwvdGV4dD4KPHRleHQgeD0iMTUwIiB5PSIzNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI0NDQyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm92ZWw8L3RleHQ+Cjwvc3ZnPg==')
            }
            width={BOOK_IMAGE_WIDTH}
            height={BOOK_IMAGE_HEIGHT}
            style={styles.bookImage}
          />
        </View> */}

        {/* 도서 정보 */}
        <View style={styles.bookInfoContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>4.5</Text>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.reviewCount}>(132)</Text>
            </View>
          </View>
          
          <View style={styles.authorSection}>
            <Text style={styles.author}>{book.author}</Text>
            <Text style={styles.readCount}>{formatReadCount(book.readCount)}</Text>
          </View>
        </View>

        {/* 줄거리 */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>줄거리</Text>
          <Text style={styles.summaryText}>
            {book.title === '노인과 바다' ? 
              '쿠바의 한 어촌에 사는 산티아고라는 노인이 84일 동안 고기를 한 마리도 잡지 못합니다. 마을 사람들은 그를 "살라오"(불운한 사람)라고 부르며, 젊은 소년 마놀린만이 그를 믿고 따릅니다. 85일째 되는 날, 노인은 홀로 바다로 나가 거대한 청새치와 마주치게 됩니다. 3일간의 치열한 사투 끝에 청새치를 잡지만, 돌아오는 길에 상어들의 공격으로 물고기는 뼈만 남게 됩니다. 헤밍웨이의 대표작으로, 인간의 존엄성과 불굴의 의지를 그린 작품입니다.' :
            book.title === '1984' ?
              '전체주의 국가 오세아니아에서 진리부에 근무하는 윈스턴 스미스의 이야기입니다. 빅 브라더가 모든 것을 감시하는 사회에서 윈스턴은 금지된 사랑에 빠지고 반정부 활동을 시작합니다. 하지만 사상경찰에 체포되어 101호실에서 끔찍한 고문을 당하며 결국 빅 브라더를 사랑하게 됩니다. 조지 오웰이 그린 디스토피아 소설의 걸작으로, 현대 사회의 감시와 통제에 대한 경고를 담고 있습니다.' :
            book.title === '위대한 개츠비' ?
              '1920년대 미국 재즈 시대를 배경으로 한 사랑과 꿈의 이야기입니다. 화자 닉 캐러웨이는 웨스트 에그에서 신비로운 이웃 제이 개츠비를 만나게 됩니다. 개츠비는 과거의 연인 데이지를 되찾기 위해 화려한 파티를 열며 부를 과시하지만, 결국 아메리칸 드림의 허상과 마주하게 됩니다. F. 스콧 피츠제럴드의 대표작으로, 미국 문학사상 가장 위대한 소설 중 하나로 평가받습니다.' :
              `${book.title}은 인간의 본성과 사회의 모순을 깊이 있게 탐구하는 문학 작품입니다. 복잡한 인물들의 심리와 갈등을 통해 삶의 본질적인 문제들을 다루며, 독자들에게 깊은 사색과 감동을 선사합니다. 시대를 초월한 보편적 주제를 다룬 불멸의 명작으로 평가받고 있습니다.`
            }
          </Text>
        </View>

        {/* 작품 미리보기 */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>작품 미리보기</Text>
          <Text style={styles.previewText}>
            {book.title === '노인과 바다' ?
              '그는 늙은 어부였다. 혼자서 작은 배에 타고 멕시코 만류에서 낚시를 하고 있었지만 84일째 고기를 잡지 못하고 있었다. 처음 40일 동안은 한 소년이 그의 곁에 있었다. 하지만 40일 동안 한 마리의 고기도 잡지 못하자, 소년의 부모는 그 늙은 어부가 확실히 그리고 마침내 살라오가 되었다고, 즉 최악의 불운에 빠진 사람이 되었다고 말했다...' :
            book.title === '1984' ?
              '4월의 밝고 차가운 날이었고, 시계는 13시를 가리키고 있었다. 윈스턴 스미스는 턱을 가슴에 파묻고 매서운 바람을 피하려 애쓰며 빅토리 맨션의 유리문 사이로 재빨리 미끄러져 들어갔다. 하지만 그가 아무리 빨리 움직여도 소용없었다. 먼지와 모래가 그를 따라 들어왔기 때문이다...' :
            book.title === '위대한 개츠비' ?
              '내 젊은 시절, 좀 더 감수성이 예민했던 시절에 아버지가 해주신 충고가 있는데, 그 후로 지금까지 내 마음속에 남아 있다. "남을 비판하고 싶은 충동이 일 때마다," 아버지가 말씀하셨다. "이 세상 모든 사람이 너처럼 혜택받고 자란 것은 아니라는 점을 명심해라."' :
              '이야기는 평범한 일상에서 시작됩니다. 하지만 곧 예상치 못한 사건들이 연쇄적으로 일어나며, 주인공은 자신이 알고 있던 세계가 전부가 아니라는 것을 깨닫게 됩니다. 진실을 찾아가는 여정에서 만나는 다양한 인물들과의 만남은 독자들에게도 새로운 시각을 제공합니다...'
            }
          </Text>
        </View>
      </ScrollView>

      {/* 하단 고정 영역 - 진행률과 읽기 시작하기 버튼 */}
      <View style={styles.bottomFixedContainer}>
        {/* 진행률 */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>진행률 {progressPercentage}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        {/* 읽기 시작하기 버튼 */}
        <Button
          title="읽기 시작하기"
          onPress={() => navigation.navigate('Reading', { bookId: book.id })}
          variant="primary"
          size="medium"
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 140, // 하단 고정 영역 높이만큼 여백 추가
  },
  bottomFixedContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: style.CONTENT_PADDING,
    paddingTop: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  header: {
    height: style.HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: style.CONTENT_PADDING,
    backgroundColor: colors.white,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontFamily: 'MinSans-Medium',
    color: colors.black,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
  },
  bookImage: {
    width: BOOK_IMAGE_WIDTH,
    height: BOOK_IMAGE_HEIGHT,
    borderRadius: style.BORDER_RADIUS,
  },
  bookInfoContainer: {
    paddingHorizontal: style.CONTENT_PADDING,
    paddingBottom: style.CONTENT_PADDING,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: font.FONT_SIZE_LARGE,
    fontFamily: 'MinSans-Bold',
    color: colors.black,
    flex: 1,
    marginRight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: font.FONT_SIZE_MEDIUM,
    fontFamily: 'MinSans-Bold',
    color: colors.black,
    marginRight: 4,
  },
  ratingIcon: {
    fontSize: font.FONT_SIZE_MEDIUM,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: font.FONT_SIZE_SMALL,
    fontFamily: 'MinSans-Medium',
    color: colors.gray600,
  },
  authorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: font.FONT_SIZE_MEDIUM,
    fontFamily: 'MinSans-Medium',
    color: colors.gray600,
  },
  readCount: {
    fontSize: font.FONT_SIZE_SMALL,
    fontFamily: 'MinSans-Medium',
    color: colors.gray500,
  },
  summaryContainer: {
    paddingHorizontal: style.CONTENT_PADDING,
    paddingBottom: style.CONTENT_PADDING,
  },
  summaryTitle: {
    fontSize: font.FONT_SIZE_MEDIUM,
    fontFamily: 'MinSans-Bold',
    color: colors.black,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: font.FONT_SIZE_SMALL,
    fontFamily: 'MinSans-Medium',
    color: colors.gray600,
    lineHeight: font.FONT_SIZE_SMALL * 1.5,
  },
  previewContainer: {
    paddingHorizontal: style.CONTENT_PADDING,
    paddingBottom: style.CONTENT_PADDING,
  },
  previewTitle: {
    fontSize: font.FONT_SIZE_MEDIUM,
    fontFamily: 'MinSans-Bold',
    color: colors.black,
    marginBottom: 8,
  },
  previewText: {
    fontSize: font.FONT_SIZE_SMALL,
    fontFamily: 'MinSans-Medium',
    color: colors.gray600,
    lineHeight: font.FONT_SIZE_SMALL * 1.5,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: font.FONT_SIZE_MEDIUM,
    fontFamily: 'MinSans-Bold',
    color: colors.black,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.black,
    borderRadius: 4,
  },
  startReadingButton: {
    marginHorizontal: style.CONTENT_PADDING,
    marginBottom: style.CONTENT_PADDING,
    backgroundColor: colors.black,
    paddingVertical: 16,
    borderRadius: style.BORDER_RADIUS,
    alignItems: 'center',
  },
  startReadingButtonText: {
    fontSize: font.FONT_SIZE_MEDIUM,
    fontFamily: 'MinSans-Bold',
    color: colors.white,
  },
});

export default BookDetailScreen;