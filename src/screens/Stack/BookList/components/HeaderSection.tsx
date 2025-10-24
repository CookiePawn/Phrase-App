import { colors } from '@/styles';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@/navigations';

const HeaderSection = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    
    return (
        <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>도서 목록</Text>
            <View style={styles.headerSpacer} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    headerTitle: {
        fontSize: 18,
        fontFamily: 'MinSans-Bold',
        color: colors.black,
    },
    headerSpacer: {
        width: 40,
    },
});

export default HeaderSection;