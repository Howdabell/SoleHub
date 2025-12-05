import GlassView from '@/components/GlassView';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
    const { user, session } = useAuth();
    const { theme, colors } = useTheme();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchProfile();
            }
        }, [user])
    );

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', user?.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else if (data) {
                setUsername(data.username || '');
                if (data.avatar_url) {
                    if (data.avatar_url.startsWith('http')) {
                        setAvatarUrl(data.avatar_url);
                    } else {
                        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(data.avatar_url);
                        setAvatarUrl(publicUrlData.publicUrl);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            router.replace('/(auth)/login');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={theme === 'dark' ? ['#000000', '#121212', '#1E1E1E'] : ['#FFFFFF', '#F5F5F5', '#E0E0E0']}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Orbs */}
            <View style={styles.orb1} />
            <View style={styles.orb2} />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                    </View>

                    <GlassView
                        style={styles.profileCard}
                        contentContainerStyle={styles.profileCardContent}
                        intensity={20}
                        tint={theme === 'dark' ? 'dark' : 'light'}
                    >
                        <View style={styles.avatarContainer}>
                            <GlassView
                                style={styles.avatarFrame}
                                contentContainerStyle={styles.avatarFrameContent}
                                intensity={30}
                                tint={theme === 'dark' ? 'light' : 'dark'}
                            >
                                {avatarUrl ? (
                                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.placeholderAvatar}>
                                        <Ionicons name="person" size={40} color={theme === 'dark' ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"} />
                                    </View>
                                )}
                            </GlassView>
                        </View>
                        <Text style={[styles.username, { color: colors.text }]}>{username || 'User'}</Text>
                        <Text style={[styles.email, { color: colors.text }]}>{user?.email}</Text>
                    </GlassView>

                    <View style={styles.menu}>
                        <TouchableOpacity
                            onPress={() => router.push('/profile/edit')}
                            activeOpacity={0.8}
                        >
                            <GlassView
                                style={styles.menuItem}
                                contentContainerStyle={styles.menuItemContent}
                                intensity={15}
                                tint={theme === 'dark' ? 'dark' : 'light'}
                            >
                                <View style={[styles.menuIconContainer, { backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
                                    <Ionicons name="person-outline" size={22} color={colors.text} />
                                </View>
                                <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
                                <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} />
                            </GlassView>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/settings')}
                            activeOpacity={0.8}
                        >
                            <GlassView
                                style={styles.menuItem}
                                contentContainerStyle={styles.menuItemContent}
                                intensity={15}
                                tint={theme === 'dark' ? 'dark' : 'light'}
                            >
                                <View style={[styles.menuIconContainer, { backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
                                    <Ionicons name="settings-outline" size={22} color={colors.text} />
                                </View>
                                <Text style={[styles.menuText, { color: colors.text }]}>Settings</Text>
                                <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} />
                            </GlassView>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/favorites')}
                            activeOpacity={0.8}
                        >
                            <GlassView
                                style={styles.menuItem}
                                contentContainerStyle={styles.menuItemContent}
                                intensity={15}
                                tint={theme === 'dark' ? 'dark' : 'light'}
                            >
                                <View style={[styles.menuIconContainer, { backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
                                    <Ionicons name="heart-outline" size={22} color={colors.text} />
                                </View>
                                <Text style={[styles.menuText, { color: colors.text }]}>Favorites</Text>
                                <Ionicons name="chevron-forward" size={20} color={theme === 'dark' ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} />
                            </GlassView>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSignOut} activeOpacity={0.8}>
                            <GlassView
                                style={[styles.menuItem, styles.logoutItem]}
                                contentContainerStyle={styles.menuItemContent}
                                intensity={15}
                                tint={theme === 'dark' ? 'dark' : 'light'}
                            >
                                <View style={[styles.menuIconContainer, styles.logoutIconContainer]}>
                                    <Ionicons name="log-out-outline" size={22} color="#FF5722" />
                                </View>
                                <Text style={[styles.menuText, styles.logoutText]}>Sign Out</Text>
                            </GlassView>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    orb1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: 'rgba(255, 87, 34, 0.15)',
        zIndex: 0,
    },
    orb2: {
        position: 'absolute',
        bottom: 0,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        zIndex: 0,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    profileCard: {
        marginHorizontal: 20,
        borderRadius: 24,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    profileCardContent: {
        padding: 30,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 20,
    },
    avatarFrame: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
    },
    avatarFrameContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    placeholderAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    menu: {
        paddingHorizontal: 20,
    },
    menuItem: {
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    logoutItem: {
        marginTop: 20,
        borderColor: 'rgba(255, 87, 34, 0.3)',
    },
    logoutIconContainer: {
        backgroundColor: 'rgba(255, 87, 34, 0.15)',
    },
    logoutText: {
        color: '#FF5722',
    },
});
