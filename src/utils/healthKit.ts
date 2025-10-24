import { Platform } from 'react-native';
import type {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';

// 안전한 HealthKit 모듈 로드
let AppleHealthKit: any = null;

// 모듈 로드 함수
const loadHealthKitModule = () => {
  if (Platform.OS !== 'ios') {
    console.log('iOS가 아닌 플랫폼에서는 HealthKit을 로드하지 않습니다');
    return null;
  }

  try {
    console.log('HealthKit 모듈 로드 시도 중...');
    const module = require('react-native-health');
    console.log('HealthKit 모듈 로드 성공:', !!module);
    return module;
  } catch (error) {
    console.log('HealthKit 모듈 로드 실패:', error);
    return null;
  }
};

// 초기 로드 시도
AppleHealthKit = loadHealthKitModule();
console.log('초기 HealthKit 모듈 로드 결과:', !!AppleHealthKit);

// HealthKit 권한 설정
const getPermissions = (): HealthKitPermissions | null => {
  if (!AppleHealthKit || !AppleHealthKit.Constants || !AppleHealthKit.Constants.Permissions) {
    console.log('HealthKit Constants를 찾을 수 없습니다');
    return null;
  }

  try {
    return {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.Steps,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          AppleHealthKit.Constants.Permissions.AppleExerciseTime,
        ],
        write: [],
      },
    };
  } catch (error) {
    console.log('HealthKit 권한 설정 실패:', error);
    return null;
  }
};

// HealthKit 초기화 함수 (개선된 디버깅 버전)
export const initializeHealthKit = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios') {
      console.log('iOS가 아닌 플랫폼에서는 HealthKit을 초기화하지 않습니다');
      resolve(false);
      return;
    }

    if (!AppleHealthKit) {
      console.log('HealthKit 모듈이 로드되지 않았습니다');
      resolve(false);
      return;
    }

    const permissions = getPermissions();
    if (!permissions) {
      console.log('HealthKit 권한을 가져올 수 없습니다');
      resolve(false);
      return;
    }

    console.log('HealthKit 초기화 시도 중... 권한:', permissions);

    try {
      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        if (error) {
          console.log('HealthKit 초기화 실패:', error);
          console.log('에러 타입:', typeof error);
          console.log('에러 상세:', JSON.stringify(error));
          resolve(false);
        } else {
          console.log('✅ HealthKit 초기화 성공!');

          // 초기화 성공 후 권한 상태 확인
          checkHealthKitPermissions();
          resolve(true);
        }
      });
    } catch (error) {
      console.log('HealthKit 초기화 중 예외 발생:', error);
      resolve(false);
    }
  });
};

// HealthKit 권한 상태 확인 (디버깅용)
const checkHealthKitPermissions = () => {
  try {
    // 권한 상태 상세 확인
    console.log('🔍 HealthKit 권한 상태 상세 확인...');

    // Constants 확인
    console.log('📋 HealthKit Constants 확인:');
    if (AppleHealthKit.Constants) {
      console.log('- Constants 객체 존재:', !!AppleHealthKit.Constants);
      if (AppleHealthKit.Constants.Permissions) {
        console.log('- Permissions 객체 존재:', !!AppleHealthKit.Constants.Permissions);
        console.log('- Steps 권한 키:', AppleHealthKit.Constants.Permissions.Steps);
        console.log('- ActiveEnergyBurned 권한 키:', AppleHealthKit.Constants.Permissions.ActiveEnergyBurned);
      }
    }

    // 사용 가능한 메서드 확인
    console.log('🛠 사용 가능한 HealthKit 메서드들:');
    console.log('- getStepCount:', typeof AppleHealthKit.getStepCount);
    console.log('- getDailyStepCountSamples:', typeof AppleHealthKit.getDailyStepCountSamples);
    console.log('- getSamples:', typeof AppleHealthKit.getSamples);
    console.log('- getActiveEnergyBurned:', typeof AppleHealthKit.getActiveEnergyBurned);
    console.log('- getAppleExerciseTime:', typeof AppleHealthKit.getAppleExerciseTime);
    console.log('- initHealthKit:', typeof AppleHealthKit.initHealthKit);

    // 모든 사용 가능한 메서드 나열
    console.log('📦 모든 HealthKit 메서드:', Object.keys(AppleHealthKit));

    // 권한 상태 확인 시도
    if (AppleHealthKit.getAuthorizationStatusForType) {
      console.log('권한 확인 메서드 존재');

      try {
        const stepPermission = AppleHealthKit.getAuthorizationStatusForType({
          read: [AppleHealthKit.Constants.Permissions.Steps]
        });
        console.log('✅ 걸음수 권한 상태:', stepPermission);
      } catch (permError) {
        console.log('❌ 걸음수 권한 확인 실패:', permError);
      }
    } else {
      console.log('⚠️ getAuthorizationStatusForType 메서드 없음');
    }

  } catch (error) {
    console.log('❌ 권한 상태 확인 중 오류:', error);
  }
};

// HealthKit 사용 가능 여부 확인
export const isHealthKitAvailable = (): boolean => {
  console.log('isHealthKitAvailable 호출됨');

  if (Platform.OS !== 'ios') {
    console.log('iOS가 아닌 플랫폼입니다');
    return false;
  }

  if (!AppleHealthKit) {
    console.log('AppleHealthKit 모듈이 null입니다');
    return false;
  }

  console.log('AppleHealthKit 객체:', AppleHealthKit);
  console.log('AppleHealthKit의 메서드들:', Object.keys(AppleHealthKit));

  try {
    // react-native-health에서는 isAvailable 메서드가 없을 수 있음
    // 대신 모듈이 로드되고 iOS 플랫폼이면 사용 가능한 것으로 간주
    const available = true; // AppleHealthKit이 존재하고 iOS이면 사용 가능
    console.log('HealthKit 사용 가능 여부:', available);
    return available;
  } catch (error) {
    console.log('HealthKit 사용 가능 여부 확인 실패:', error);
    return false;
  }
};

// 오늘의 걸음수 가져오기 (개선된 버전)
export const getTodayStepCount = (): Promise<number> => {
  return new Promise((resolve) => {
    if (!AppleHealthKit || !isHealthKitAvailable()) {
      console.log('HealthKit을 사용할 수 없습니다. 더미 데이터를 반환합니다.');
      // 더미 데이터 반환 (2000-8000 사이 랜덤)
      const dummySteps = Math.floor(Math.random() * 6000) + 2000;
      resolve(dummySteps);
      return;
    }

    const today = new Date();
    // 오늘 00:00:00부터 현재 시간까지
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(); // 현재 시간

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    console.log(`걸음수 조회 시간 범위: ${startOfDay.toISOString()} ~ ${endOfDay.toISOString()}`);

    try {
      // getDailyStepCountSamples를 먼저 시도 (더 정확한 데이터)
      if (AppleHealthKit.getDailyStepCountSamples) {
        AppleHealthKit.getDailyStepCountSamples(options, (callbackError: string, results: HealthValue[]) => {
          if (callbackError) {
            console.log('getDailyStepCountSamples 실패:', callbackError);
            // 폴백으로 getStepCount 사용
            fallbackToGetStepCount();
          } else {
            console.log('getDailyStepCountSamples 원본 결과:', results);

            if (Array.isArray(results) && results.length > 0) {
              // 모든 샘플의 합계 계산
              const totalSteps = results.reduce((sum, sample) => sum + (sample.value || 0), 0);
              console.log('오늘의 걸음수 (samples 합계):', totalSteps);
              resolve(Math.round(totalSteps));
            } else {
              console.log('걸음수 샘플이 없습니다. 폴백 시도...');
              fallbackToGetStepCount();
            }
          }
        });
      } else {
        // getDailyStepCountSamples가 없으면 바로 getStepCount 사용
        fallbackToGetStepCount();
      }
    } catch (error) {
      console.log('걸음수 가져오기 중 예외 발생:', error);
      // 예외 시 더미 데이터 반환
      const dummySteps = Math.floor(Math.random() * 6000) + 2000;
      resolve(dummySteps);
    }

    // 폴백 함수: getStepCount 사용
    function fallbackToGetStepCount() {
      console.log('getStepCount로 폴백 시도...');
      try {
        AppleHealthKit.getStepCount(options, (callbackError: string, results: HealthValue) => {
          if (callbackError) {
            console.log('getStepCount도 실패:', callbackError);
            // 최종 폴백: getSamples 시도
            fallbackToGetSamples();
          } else {
            console.log('getStepCount 원본 결과:', results);
            const stepCount = results?.value || 0;
            console.log('오늘의 걸음수 (getStepCount):', stepCount);

            if (stepCount === 0) {
              console.log('⚠️ getStepCount도 0 반환 - getSamples 시도');
              fallbackToGetSamples();
            } else {
              resolve(Math.round(stepCount));
            }
          }
        });
      } catch (fallbackError) {
        console.log('getStepCount 폴백도 실패:', fallbackError);
        fallbackToGetSamples();
      }
    }

    // 최종 폴백: getSamples 사용
    function fallbackToGetSamples() {
      console.log('getSamples로 최종 폴백 시도...');

      if (!AppleHealthKit.getSamples) {
        console.log('getSamples 메서드 없음 - 더미 데이터 반환');
        const dummySteps = Math.floor(Math.random() * 6000) + 2000;
        resolve(dummySteps);
        return;
      }

      try {
        const samplesOptions = {
          startDate: options.startDate,
          endDate: options.endDate,
          type: 'HKQuantityTypeIdentifierStepCount', // HealthKit 직접 타입 사용
        };

        AppleHealthKit.getSamples(samplesOptions, (samplesError: string, samplesResults: HealthValue[]) => {
          if (samplesError) {
            console.log('getSamples도 실패:', samplesError);
            const dummySteps = Math.floor(Math.random() * 6000) + 2000;
            resolve(dummySteps);
          } else {
            console.log('getSamples 원본 결과:', samplesResults);

            if (Array.isArray(samplesResults) && samplesResults.length > 0) {
              const totalSteps = samplesResults.reduce((sum, sample) => sum + (sample.value || 0), 0);
              console.log('✅ getSamples 걸음수 합계:', totalSteps);
              resolve(Math.round(totalSteps));
            } else {
              console.log('getSamples 결과 없음 - 더미 데이터');
              const dummySteps = Math.floor(Math.random() * 6000) + 2000;
              resolve(dummySteps);
            }
          }
        });
      } catch (samplesError) {
        console.log('getSamples 예외:', samplesError);
        const dummySteps = Math.floor(Math.random() * 6000) + 2000;
        resolve(dummySteps);
      }
    }
  });
};

// 특정 날짜의 걸음수 가져오기 (개선된 버전)
export const getStepCountForDate = (date: Date): Promise<number> => {
  return new Promise((resolve) => {
    // 미래 날짜 확인
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      console.log(`⚠️ 미래 날짜 (${date.toDateString()}) - 0 반환`);
      resolve(0);
      return;
    }

    if (!AppleHealthKit || !isHealthKitAvailable()) {
      console.log('HealthKit을 사용할 수 없습니다. 더미 데이터를 반환합니다.');
      // 더미 데이터 반환 (1000-10000 사이 랜덤)
      const dummySteps = Math.floor(Math.random() * 9000) + 1000;
      resolve(dummySteps);
      return;
    }

    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    console.log(`${date.toDateString()} 걸음수 조회 시간 범위: ${startOfDay.toISOString()} ~ ${endOfDay.toISOString()}`);

    try {
      // getDailyStepCountSamples를 먼저 시도
      if (AppleHealthKit.getDailyStepCountSamples) {
        AppleHealthKit.getDailyStepCountSamples(options, (callbackError: string, results: HealthValue[]) => {
          if (callbackError) {
            console.log(`${date.toDateString()} getDailyStepCountSamples 실패:`, callbackError);
            fallbackToGetStepCount();
          } else {
            console.log(`${date.toDateString()} getDailyStepCountSamples 결과:`, results);

            if (Array.isArray(results) && results.length > 0) {
              const totalSteps = results.reduce((sum, sample) => sum + (sample.value || 0), 0);
              console.log(`${date.toDateString()}의 걸음수 (samples 합계):`, totalSteps);
              resolve(Math.round(totalSteps));
            } else {
              console.log(`${date.toDateString()} 걸음수 샘플이 없습니다. 폴백 시도...`);
              fallbackToGetStepCount();
            }
          }
        });
      } else {
        fallbackToGetStepCount();
      }
    } catch (error) {
      console.log('특정 날짜 걸음수 가져오기 중 예외 발생:', error);
      const dummySteps = Math.floor(Math.random() * 9000) + 1000;
      resolve(dummySteps);
    }

    function fallbackToGetStepCount() {
      console.log(`${date.toDateString()} getStepCount로 폴백 시도...`);
      try {
        AppleHealthKit.getStepCount(options, (callbackError: string, results: HealthValue) => {
          if (callbackError) {
            console.log(`${date.toDateString()} getStepCount도 실패:`, callbackError);
            const dummySteps = Math.floor(Math.random() * 9000) + 1000;
            resolve(dummySteps);
          } else {
            console.log(`${date.toDateString()} getStepCount 결과:`, results);
            const stepCount = results?.value || 0;
            console.log(`${date.toDateString()}의 걸음수 (getStepCount):`, stepCount);

            resolve(Math.round(stepCount));
          }
        });
      } catch (fallbackError) {
        console.log(`${date.toDateString()} getStepCount 폴백도 실패:`, fallbackError);
        const dummySteps = Math.floor(Math.random() * 9000) + 1000;
        resolve(dummySteps);
      }
    }
  });
};

// 주간 걸음수 데이터 가져오기
export const getWeeklyStepData = (): Promise<Array<{ date: string, steps: number }>> => {
  return new Promise(async (resolve) => {
    const weekData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      try {
        const steps = await getStepCountForDate(date);
        weekData.push({
          date: date.toISOString().split('T')[0],
          steps: steps
        });
      } catch (error) {
        console.log(`${date.toDateString()} 걸음수 가져오기 실패:`, error);
        // 오류 시 더미 데이터 추가
        weekData.push({
          date: date.toISOString().split('T')[0],
          steps: Math.floor(Math.random() * 9000) + 1000
        });
      }
    }

    resolve(weekData);
  });
};

// 월간 걸음수 데이터 가져오기
export const getMonthlyStepData = (year: number, month: number): Promise<Array<{ date: string, steps: number }>> => {
  return new Promise(async (resolve) => {
    const monthData = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);

      try {
        const steps = await getStepCountForDate(date);
        monthData.push({
          date: date.toISOString().split('T')[0],
          steps: steps
        });
      } catch (error) {
        console.log(`${date.toDateString()} 걸음수 가져오기 실패:`, error);
        // 오류 시 더미 데이터 추가
        monthData.push({
          date: date.toISOString().split('T')[0],
          steps: Math.floor(Math.random() * 9000) + 1000
        });
      }
    }

    resolve(monthData);
  });
};

// 오늘의 칼로리 가져오기
export const getTodayCalories = (): Promise<number> => {
  return new Promise((resolve) => {
    if (!AppleHealthKit || !isHealthKitAvailable()) {
      console.log('HealthKit을 사용할 수 없습니다. 더미 칼로리 데이터를 반환합니다.');
      // 더미 데이터 반환 (200-600 사이 랜덤)
      const dummyCalories = Math.floor(Math.random() * 400) + 200;
      resolve(dummyCalories);
      return;
    }

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    try {
      AppleHealthKit.getActiveEnergyBurned(options, (callbackError: string, results: HealthValue | HealthValue[]) => {
        if (callbackError) {
          console.log('칼로리 가져오기 실패:', callbackError);
          // 오류 시 더미 데이터 반환
          const dummyCalories = Math.floor(Math.random() * 400) + 200;
          resolve(dummyCalories);
        } else {
          // results가 배열일 경우 합계 계산
          let totalCalories = 0;
          if (Array.isArray(results)) {
            totalCalories = results.reduce((sum, item) => sum + (item.value || 0), 0);
          } else if (results && typeof results.value === 'number') {
            totalCalories = results.value;
          }
          console.log('오늘의 칼로리:', totalCalories);
          resolve(Math.round(totalCalories));
        }
      });
    } catch (error) {
      console.log('칼로리 가져오기 중 예외 발생:', error);
      // 예외 시 더미 데이터 반환
      const dummyCalories = Math.floor(Math.random() * 400) + 200;
      resolve(dummyCalories);
    }
  });
};

// 특정 날짜의 칼로리 가져오기
export const getCaloriesForDate = (date: Date): Promise<number> => {
  return new Promise((resolve) => {
    // 미래 날짜 확인
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      console.log(`⚠️ 미래 날짜 (${date.toDateString()}) 칼로리 - 0 반환`);
      resolve(0);
      return;
    }

    if (!AppleHealthKit || !isHealthKitAvailable()) {
      console.log('HealthKit을 사용할 수 없습니다. 더미 칼로리 데이터를 반환합니다.');
      // 더미 데이터 반환 (150-700 사이 랜덤)
      const dummyCalories = Math.floor(Math.random() * 550) + 150;
      resolve(dummyCalories);
      return;
    }

    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    try {
      AppleHealthKit.getActiveEnergyBurned(options, (callbackError: string, results: HealthValue | HealthValue[]) => {
        if (callbackError) {
          console.log('특정 날짜 칼로리 가져오기 실패:', callbackError);
          // 오류 시 더미 데이터 반환
          const dummyCalories = Math.floor(Math.random() * 550) + 150;
          resolve(dummyCalories);
        } else {
          // results가 배열일 경우 합계 계산
          let totalCalories = 0;
          if (Array.isArray(results)) {
            totalCalories = results.reduce((sum, item) => sum + (item.value || 0), 0);
          } else if (results && typeof results.value === 'number') {
            totalCalories = results.value;
          }
          console.log(`${date.toDateString()}의 칼로리:`, totalCalories);
          resolve(Math.round(totalCalories));
        }
      });
    } catch (error) {
      console.log('특정 날짜 칼로리 가져오기 중 예외 발생:', error);
      // 예외 시 더미 데이터 반환
      const dummyCalories = Math.floor(Math.random() * 550) + 150;
      resolve(dummyCalories);
    }
  });
};

// 오늘의 운동시간 가져오기 (분 단위)
export const getTodayExerciseTime = (): Promise<number> => {
  return new Promise((resolve) => {
    if (!AppleHealthKit || !isHealthKitAvailable()) {
      console.log('HealthKit을 사용할 수 없습니다. 더미 운동시간 데이터를 반환합니다.');
      // 더미 데이터 반환 (15-120 사이 랜덤)
      const dummyMinutes = Math.floor(Math.random() * 105) + 15;
      resolve(dummyMinutes);
      return;
    }

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    try {
      AppleHealthKit.getAppleExerciseTime(options, (callbackError: string, results: HealthValue | HealthValue[]) => {
        if (callbackError) {
          console.log('운동시간 가져오기 실패:', callbackError);
          // 오류 시 더미 데이터 반환
          const dummyMinutes = Math.floor(Math.random() * 105) + 15;
          resolve(dummyMinutes);
        } else {
          // results가 배열일 경우 합계 계산 (초 단위를 분 단위로 변환)
          let totalMinutes = 0;
          if (Array.isArray(results)) {
            const totalSeconds = results.reduce((sum, item) => sum + (item.value || 0), 0);
            totalMinutes = Math.round(totalSeconds / 60);
          } else if (results && typeof results.value === 'number') {
            totalMinutes = Math.round(results.value / 60);
          }
          console.log('오늘의 운동시간 (분):', totalMinutes);
          resolve(totalMinutes);
        }
      });
    } catch (error) {
      console.log('운동시간 가져오기 중 예외 발생:', error);
      // 예외 시 더미 데이터 반환
      const dummyMinutes = Math.floor(Math.random() * 105) + 15;
      resolve(dummyMinutes);
    }
  });
};

// 특정 날짜의 운동시간 가져오기 (분 단위)
export const getExerciseTimeForDate = (date: Date): Promise<number> => {
  return new Promise((resolve) => {
    // 미래 날짜 확인
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) {
      console.log(`⚠️ 미래 날짜 (${date.toDateString()}) 운동시간 - 0 반환`);
      resolve(0);
      return;
    }

    if (!AppleHealthKit || !isHealthKitAvailable()) {
      console.log('HealthKit을 사용할 수 없습니다. 더미 운동시간 데이터를 반환합니다.');
      // 더미 데이터 반환 (0-180 사이 랜덤)
      const dummyMinutes = Math.floor(Math.random() * 180);
      resolve(dummyMinutes);
      return;
    }

    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };

    try {
      AppleHealthKit.getAppleExerciseTime(options, (callbackError: string, results: HealthValue | HealthValue[]) => {
        if (callbackError) {
          console.log('특정 날짜 운동시간 가져오기 실패:', callbackError);
          // 오류 시 더미 데이터 반환
          const dummyMinutes = Math.floor(Math.random() * 180);
          resolve(dummyMinutes);
        } else {
          // results가 배열일 경우 합계 계산 (초 단위를 분 단위로 변환)
          let totalMinutes = 0;
          if (Array.isArray(results)) {
            const totalSeconds = results.reduce((sum, item) => sum + (item.value || 0), 0);
            totalMinutes = Math.round(totalSeconds / 60);
          } else if (results && typeof results.value === 'number') {
            totalMinutes = Math.round(results.value / 60);
          }
          console.log(`${date.toDateString()}의 운동시간 (분):`, totalMinutes);
          resolve(totalMinutes);
        }
      });
    } catch (error) {
      console.log('특정 날짜 운동시간 가져오기 중 예외 발생:', error);
      // 예외 시 더미 데이터 반환
      const dummyMinutes = Math.floor(Math.random() * 180);
      resolve(dummyMinutes);
    }
  });
};


// HealthKit 데이터 존재 여부 확인 (디버깅용)
export const testHealthKitData = (): Promise<void> => {
  return new Promise(async (resolve) => {
    console.log('🔍 HealthKit 데이터 존재 여부 테스트 시작...');

    if (!AppleHealthKit || !isHealthKitAvailable()) {
      console.log('❌ HealthKit을 사용할 수 없습니다');
      resolve();
      return;
    }

    try {
      // 지난 7일간의 데이터 확인
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      console.log(`📅 테스트 기간: ${startDate.toISOString()} ~ ${endDate.toISOString()}`);

      // 여러 API 시도
      if (AppleHealthKit.getDailyStepCountSamples) {
        console.log('🧪 getDailyStepCountSamples 테스트...');
        AppleHealthKit.getDailyStepCountSamples(options, (error: string, results: HealthValue[]) => {
          if (error) {
            console.log('❌ getDailyStepCountSamples 오류:', error);
          } else {
            console.log('✅ getDailyStepCountSamples 결과:', results?.length || 0, '개 샘플');
            if (results && results.length > 0) {
              console.log('📊 첫 번째 샘플:', results[0]);
              console.log('📊 마지막 샘플:', results[results.length - 1]);
              const total = results.reduce((sum, sample) => sum + (sample.value || 0), 0);
              console.log('📊 전체 합계:', total);
            }
          }
        });
      }

      // getSamples 직접 테스트
      if (AppleHealthKit.getSamples) {
        console.log('🧪 getSamples 직접 테스트...');
        const samplesOptions1 = {
          startDate: options.startDate,
          endDate: options.endDate,
          type: 'HKQuantityTypeIdentifierStepCount',
        };

        AppleHealthKit.getSamples(samplesOptions1, (error: string, results: HealthValue[]) => {
          if (error) {
            console.log('❌ getSamples (HKQuantityTypeIdentifierStepCount) 오류:', error);
          } else {
            console.log('✅ getSamples (HKQuantityTypeIdentifierStepCount) 결과:', results?.length || 0, '개 샘플');
            if (results && results.length > 0) {
              console.log('📊 getSamples 첫 번째 샘플:', results[0]);
              const total = results.reduce((sum, sample) => sum + (sample.value || 0), 0);
              console.log('📊 getSamples 전체 합계:', total);
            }
          }
        });

        // Constants 사용해서도 시도
        if (AppleHealthKit.Constants?.Permissions?.Steps) {
          const samplesOptions2 = {
            startDate: options.startDate,
            endDate: options.endDate,
            type: AppleHealthKit.Constants.Permissions.Steps,
          };

          AppleHealthKit.getSamples(samplesOptions2, (error: string, results: HealthValue[]) => {
            if (error) {
              console.log('❌ getSamples (Constants.Steps) 오류:', error);
            } else {
              console.log('✅ getSamples (Constants.Steps) 결과:', results?.length || 0, '개 샘플');
              if (results && results.length > 0) {
                const total = results.reduce((sum, sample) => sum + (sample.value || 0), 0);
                console.log('📊 getSamples Constants 전체 합계:', total);
              }
            }
          });
        }
      }

      if (AppleHealthKit.getStepCount) {
        console.log('🧪 getStepCount 테스트 (오늘)...');
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();

        AppleHealthKit.getStepCount({
          startDate: todayStart.toISOString(),
          endDate: todayEnd.toISOString(),
        }, (error: string, results: HealthValue) => {
          if (error) {
            console.log('❌ getStepCount 오류:', error);
          } else {
            console.log('✅ getStepCount 결과:', results);
          }
        });
      }

      // 어제 데이터도 확인
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
      const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);

      console.log('🧪 어제 데이터 테스트...');
      if (AppleHealthKit.getStepCount) {
        AppleHealthKit.getStepCount({
          startDate: yesterdayStart.toISOString(),
          endDate: yesterdayEnd.toISOString(),
        }, (error: string, results: HealthValue) => {
          if (error) {
            console.log('❌ 어제 getStepCount 오류:', error);
          } else {
            console.log('✅ 어제 getStepCount 결과:', results);
          }
        });
      }

    } catch (error) {
      console.log('❌ HealthKit 데이터 테스트 중 예외:', error);
    }

    resolve();
  });
};

export default {
  initializeHealthKit,
  isHealthKitAvailable,
  getTodayStepCount,
  getStepCountForDate,
  getWeeklyStepData,
  getMonthlyStepData,
  getTodayCalories,
  getCaloriesForDate,
  getTodayExerciseTime,
  getExerciseTimeForDate,
  testHealthKitData,
};