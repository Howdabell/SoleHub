import GlassView from '@/components/GlassView';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { theme, toggleTheme, colors } = useTheme();
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={theme === 'dark' ? ['#000000', '#121212', '#1E1E1E'] : ['#FFFFFF', '#F5F5F5', '#E0E0E0']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                </View>

                <View style={styles.content}>
                    <GlassView style={styles.section} intensity={20} tint={theme === 'dark' ? 'dark' : 'light'}>
                        <View style={styles.row}>
                            <View style={styles.rowInfo}>
                                <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={24} color={colors.text} style={styles.icon} />
                                <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
                            </View>
                            <Switch
                                value={theme === 'dark'}
                                onValueChange={toggleTheme}
                                trackColor={{ false: '#767577', true: colors.primary }}
                                thumbColor={theme === 'dark' ? '#fff' : '#f4f3f4'}
                            />
                        </View>
                    </GlassView>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    section: {
        borderRadius: 16,
        overflow: 'hidden',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
});
