import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface GlassViewProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
}

export default function GlassView({ children, style, contentContainerStyle, intensity = 50, tint = 'dark' }: GlassViewProps) {
    // Adjust intensity for Android as it renders differently
    const finalIntensity = Platform.OS === 'android' ? intensity * 0.5 : intensity;

    return (
        <View style={[styles.container, style]}>
            <BlurView
                intensity={finalIntensity}
                tint={tint}
                style={StyleSheet.absoluteFill}
            />
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <View style={[styles.content, contentContainerStyle]}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
    },
    content: {
        // flex: 1,
    },
});
