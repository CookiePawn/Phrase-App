import { NavigatorScreenParams } from "@react-navigation/native";
import { MainTabParamList } from "../Tab";

export type MainStackParamList = {
  MainTab: NavigatorScreenParams<MainTabParamList>;

  Splash: undefined;
  Login: undefined;
  BookSelection: undefined;
  Main: undefined;
  BookList: undefined;
  BookDetail: {
    bookId: string;
  };
  Reading: {
    bookId?: string;
    chapterId?: number;
  };
  Stats: undefined;
  Settings: undefined;
  // 추후 추가될 화면들을 여기에 정의
};