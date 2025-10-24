import { View } from 'react-native';
import { Typography } from '@/components';
import { useNavigation } from '@/navigations';
import { useEffect } from 'react';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('MainTab', { screen: 'Home' });
    }, 1000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Typography style={{ fontSize: 24, fontWeight: 'bold' }}>Splash</Typography>
    </View>
  );
};

export default Splash;