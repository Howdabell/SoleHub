import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
    const { user, session } = useAuth();
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={100} color="#FF5722" />
                    )}
                </View>
                <Text style={styles.username}>{username || 'User'}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/profile/edit')}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name="person-outline" size={22} color="#fff" />
                    </View>
                    <Text style={styles.menuText}>Edit Profile</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="settings-outline" size={22} color="#fff" />
                    </View>
                    <Text style={styles.menuText}>Settings</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/favorites')}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name="heart-outline" size={22} color="#fff" />
                    </View>
                    <Text style={styles.menuText}>Favorites</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
                    <View style={[styles.iconContainer, styles.logoutIconContainer]}>
                        <Ionicons name="log-out-outline" size={22} color="#FF5722" />
                    </View>
                    <Text style={[styles.menuText, { color: '#FF5722' }]}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#1E1E1E',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    profileInfo: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#121212',
    },
    avatarContainer: {
        marginBottom: 20,
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        borderRadius: 50,
        backgroundColor: '#121212', // Needed for shadow to be visible on some Android versions if radius is used
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#FF5722',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#888',
    },
    menu: {
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#1E1E1E',
        marginBottom: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutIconContainer: {
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
    },
    menuText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
