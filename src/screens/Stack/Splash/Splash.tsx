import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@/navigations';
import { Assets } from '@/assets';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTab', params: { screen: 'Home' } }],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Assets.Images.LOGO width={120} height={200} style={styles.logo} />
        <Text style={styles.subtitle}>당신의 독서 여정을 함께합니다</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'MinSans-SemiBold',
  },
});

export default SplashScreen;