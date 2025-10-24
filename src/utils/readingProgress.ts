import AsyncStorage from '@react-native-async-storage/async-storage';
import * as healthKit from './healthKit';

// 책별 읽기 진도 데이터 구조
export interface ReadingProgress {
  bookId: string;
  bookTitle: string;
  lastStepCount: number;        // 마지막 확인 시점 걸음수
  accumulatedSteps: number;     // 이 책에서 누적된 걸음수
  unlockedCharacters: number;   // 해금된 글자수
  totalCharacters: number;      // 전체 글자수
  lastUpdated: string;          // 마지막 업데이트 시간
  createdAt: string;            // 책 읽기 시작 시간
}

// 일일 걸음수 추적 데이터 구조
export interface DailyStepTracker {
  date: string;                 // YYYY-MM-DD 형식
  baseStepCount: number;        // 하루 시작 시점 걸음수
  currentStepCount: number;     // 현재 걸음수
  totalDailySteps: number;      // 하루 총 걸음수
  usedSteps: number;            // 이미 사용된 걸음수
  lastUpdated: string;          // 마지막 업데이트 시간
}

// 현재 읽고 있는 책 정보
export interface CurrentReading {
  bookId: string;
  startStepCount: number;       // 이 책을 시작했을 때의 걸음수
  startTime: string;            // 읽기 시작 시간
}

class ReadingProgressManager {
  private static instance: ReadingProgressManager;
  private currentReading: CurrentReading | null = null;

  static getInstance(): ReadingProgressManager {
    if (!ReadingProgressManager.instance) {
      ReadingProgressManager.instance = new ReadingProgressManager();
    }
    return ReadingProgressManager.instance;
  }

  // 오늘 날짜 문자열 생성
  private getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // 일일 걸음수 추적 데이터 로드
  public async getDailyTracker(): Promise<DailyStepTracker> {
    const todayStr = this.getTodayDateString();
    const key = `dailyStepTracker_${todayStr}`;
    
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.log('일일 추적 데이터 로드 실패:', error);
    }

    // 새로운 일일 추적 데이터 생성
    const currentSteps = await healthKit.getTodayStepCount();
    const newTracker: DailyStepTracker = {
      date: todayStr,
      baseStepCount: currentSteps,
      currentStepCount: currentSteps,
      totalDailySteps: currentSteps,
      usedSteps: 0,
      lastUpdated: new Date().toISOString(),
    };

    await this.saveDailyTracker(newTracker);
    return newTracker;
  }

  // 일일 걸음수 추적 데이터 저장
  private async saveDailyTracker(tracker: DailyStepTracker): Promise<void> {
    const key = `dailyStepTracker_${tracker.date}`;
    try {
      await AsyncStorage.setItem(key, JSON.stringify(tracker));
    } catch (error) {
      console.log('일일 추적 데이터 저장 실패:', error);
    }
  }

  // 책별 진도 데이터 로드
  async getBookProgress(bookId: string): Promise<ReadingProgress | null> {
    const key = `bookProgress_${bookId}`;
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.log(`책 진도 데이터 로드 실패 (${bookId}):`, error);
    }
    return null;
  }

  // 책별 진도 데이터 저장
  async saveBookProgress(progress: ReadingProgress): Promise<void> {
    const key = `bookProgress_${progress.bookId}`;
    try {
      await AsyncStorage.setItem(key, JSON.stringify(progress));
      console.log(`책 진도 저장 완료 (${progress.bookId}): ${progress.unlockedCharacters}자 해금`);
    } catch (error) {
      console.log(`책 진도 데이터 저장 실패 (${progress.bookId}):`, error);
    }
  }

  // 모든 책의 진도 데이터 조회
  async getAllBooksProgress(): Promise<ReadingProgress[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const progressKeys = keys.filter(key => key.startsWith('bookProgress_'));
      
      const progressData = await AsyncStorage.multiGet(progressKeys);
      return progressData.map(([key, value]) => {
        if (value) {
          return JSON.parse(value) as ReadingProgress;
        }
        return null;
      }).filter(Boolean) as ReadingProgress[];
    } catch (error) {
      console.log('모든 책 진도 조회 실패:', error);
      return [];
    }
  }

  // 새 책 읽기 시작
  async startReading(bookId: string, bookTitle: string, totalCharacters: number): Promise<ReadingProgress> {
    console.log(`📖 새 책 읽기 시작: ${bookTitle}`);
    
    // 현재 걸음수 조회
    const currentSteps = await healthKit.getTodayStepCount();
    
    // 기존 진도가 있는지 확인
    let progress = await this.getBookProgress(bookId);
    
    if (!progress) {
      // 새로운 진도 생성
      progress = {
        bookId,
        bookTitle,
        lastStepCount: currentSteps,
        accumulatedSteps: currentSteps,
        unlockedCharacters: Math.min(currentSteps, totalCharacters),
        totalCharacters,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    } else {
      // 기존 진도 업데이트 (새로운 기준점 설정)
      progress.lastStepCount = currentSteps;
      progress.lastUpdated = new Date().toISOString();
    }

    await this.saveBookProgress(progress);

    // 현재 읽고 있는 책으로 설정
    this.currentReading = {
      bookId,
      startStepCount: currentSteps,
      startTime: new Date().toISOString(),
    };

    console.log(`✅ 책 읽기 시작 완료: 기준 걸음수 ${currentSteps}걸음`);
    return progress;
  }

  // 실시간 진도 업데이트
  async updateProgress(bookId: string): Promise<ReadingProgress | null> {
    const progress = await this.getBookProgress(bookId);
    if (!progress) {
      console.log(`진도 데이터 없음: ${bookId}`);
      return null;
    }

    try {
      // 현재 걸음수 조회
      const currentSteps = await healthKit.getTodayStepCount();
      
      // 마지막 업데이트 날짜 확인
      const lastUpdated = new Date(progress.lastUpdated);
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const lastUpdatedStr = lastUpdated.toISOString().split('T')[0];
      
      let stepIncrease = 0;
      
      if (lastUpdatedStr !== todayStr) {
        // 날짜가 바뀐 경우: 오늘의 모든 걸음수를 새로운 진도로 추가
        console.log(`📅 날짜 변경 감지: ${lastUpdatedStr} → ${todayStr}`);
        stepIncrease = currentSteps;
        console.log(`🔄 새로운 날 시작: 오늘 걸음수 ${currentSteps}걸음 모두 적용`);
      } else {
        // 같은 날인 경우: 증가분만 계산
        stepIncrease = Math.max(0, currentSteps - progress.lastStepCount);
        
        // 앱 재시작 감지: lastStepCount가 현재 걸음수보다 크게 차이나는 경우
        const timeDifference = today.getTime() - lastUpdated.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        
        if (stepIncrease > 1000 && hoursDifference > 1) {
          console.log(`🔄 앱 재시작 감지: ${hoursDifference.toFixed(1)}시간 경과, +${stepIncrease}걸음`);
        }
      }
      
      if (stepIncrease > 0) {
        // 진도 업데이트
        progress.accumulatedSteps += stepIncrease;
        progress.unlockedCharacters = Math.min(
          progress.accumulatedSteps, 
          progress.totalCharacters
        );
        progress.lastStepCount = currentSteps;
        progress.lastUpdated = new Date().toISOString();

        await this.saveBookProgress(progress);
        
        console.log(`📈 진도 업데이트: +${stepIncrease}걸음, 총 ${progress.unlockedCharacters}자 해금`);
      } else {
        console.log(`📊 걸음수 변화 없음: ${currentSteps}걸음`);
      }

      return progress;
    } catch (error) {
      console.log(`진도 업데이트 실패 (${bookId}):`, error);
      return progress;
    }
  }

  // 앱 재시작 시 모든 책의 진도를 업데이트
  async updateAllBooksProgress(): Promise<void> {
    try {
      const allProgress = await this.getAllBooksProgress();
      console.log(`🔄 앱 재시작 감지: ${allProgress.length}개 책의 진도 업데이트 시도`);
      
      for (const progress of allProgress) {
        await this.updateProgress(progress.bookId);
      }
      
      console.log('✅ 모든 책 진도 업데이트 완료');
    } catch (error) {
      console.log('❌ 모든 책 진도 업데이트 실패:', error);
    }
  }

  // 현재 읽고 있는 책 정보 조회
  getCurrentReading(): CurrentReading | null {
    return this.currentReading;
  }

  // 읽기 종료
  async stopReading(): Promise<void> {
    if (this.currentReading) {
      console.log(`📚 읽기 종료: ${this.currentReading.bookId}`);
      // 마지막 진도 업데이트
      await this.updateProgress(this.currentReading.bookId);
      this.currentReading = null;
    }
  }

  // 책별 총 누적 걸음수 조회
  async getTotalStepsForBook(bookId: string): Promise<number> {
    const progress = await this.getBookProgress(bookId);
    return progress?.accumulatedSteps || 0;
  }

  // 오늘 총 사용된 걸음수 (모든 책 합계)
  async getTotalUsedStepsToday(): Promise<number> {
    const allProgress = await this.getAllBooksProgress();
    const todayStr = this.getTodayDateString();
    
    let totalUsed = 0;
    for (const progress of allProgress) {
      const lastUpdated = new Date(progress.lastUpdated);
      const isToday = lastUpdated.toISOString().split('T')[0] === todayStr;
      
      if (isToday) {
        totalUsed += progress.accumulatedSteps;
      }
    }
    
    return totalUsed;
  }

  // 진도 통계 조회
  async getProgressStats(bookId: string): Promise<{
    totalSteps: number;
    unlockedChars: number;
    totalChars: number;
    progressPercent: number;
    lastUpdated: string;
  } | null> {
    const progress = await this.getBookProgress(bookId);
    if (!progress) return null;

    return {
      totalSteps: progress.accumulatedSteps,
      unlockedChars: progress.unlockedCharacters,
      totalChars: progress.totalCharacters,
      progressPercent: Math.round((progress.unlockedCharacters / progress.totalCharacters) * 100),
      lastUpdated: progress.lastUpdated,
    };
  }
}

// 싱글톤 인스턴스 export
export const readingProgressManager = ReadingProgressManager.getInstance();

// 편의 함수들
export const startReading = (bookId: string, bookTitle: string, totalCharacters: number) =>
  readingProgressManager.startReading(bookId, bookTitle, totalCharacters);

export const updateProgress = (bookId: string) =>
  readingProgressManager.updateProgress(bookId);

export const stopReading = () =>
  readingProgressManager.stopReading();

export const getBookProgress = (bookId: string) =>
  readingProgressManager.getBookProgress(bookId);

export const getProgressStats = (bookId: string) =>
  readingProgressManager.getProgressStats(bookId);

export const updateAllBooksProgress = () =>
  readingProgressManager.updateAllBooksProgress();