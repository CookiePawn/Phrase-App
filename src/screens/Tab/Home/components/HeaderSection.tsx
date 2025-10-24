import { Assets } from '@/assets';
import { colors, style } from '@/styles';
import React from 'react';
import { View, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HeaderSection = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.header, { paddingTop: insets.top }]}>
            <Assets.Images.LOGO width={82} height={26} />
            <TouchableOpacity style={styles.notificationButton}>
                <View style={styles.notificationIcon}>
                    <Assets.Icons.NOTIFICATION width={14} height={16} />
                    <View style={styles.notificationDot} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: style.HEADER_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: style.CONTENT_PADDING,
        backgroundColor: colors.white,
        zIndex: 10,
    },
    notificationButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: -3,
        right: -3,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.red,
    },
});

export default HeaderSection;