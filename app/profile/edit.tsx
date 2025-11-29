import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function EditProfileScreen() {
    const [username, setUsername] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        setLoading(true);
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
                        setImage(data.avatar_url);
                    } else {
                        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(data.avatar_url);
                        setImage(publicUrlData.publicUrl);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: false,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const uploadImage = async () => {
        if (!image || image.startsWith('http')) return null;

        try {
            const fileExt = image.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
            const filePath = fileName;

            const formData = new FormData();
            formData.append('file', {
                uri: image,
                name: fileName,
                type: `image/${fileExt}`,
            } as any);

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, formData, {
                    contentType: `image/${fileExt}`,
                    upsert: true,
                });

            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
                throw uploadError;
            }

            console.log('Image uploaded successfully:', filePath);
            return filePath;
        } catch (error) {
        }
    };

    const updateProfile = async () => {
        setSaving(true);
        try {
            let avatarPath = null;
            if (image && !image.startsWith('http')) {
                console.log('Uploading new image...');
                avatarPath = await uploadImage();
            }

            const updates: any = {
                id: user?.id,
                username,
                updated_at: new Date(),
            };

            if (avatarPath) {
                updates.avatar_url = avatarPath;
            }

            console.log('Updating profile with:', updates);

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) {
                throw error;
            }

            Alert.alert('Success', 'Profile updated successfully!');
            router.back();
        } catch (error: any) {
            console.error('Update profile error:', error);
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: 'Edit Profile',
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#fff',
            }} />

            {loading ? (
                <ActivityIndicator size="large" color="#FF5722" style={styles.loader} />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.form}>
                        <View style={styles.avatarContainer}>
                            <TouchableOpacity onPress={pickImage} style={styles.avatarButton}>
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Ionicons name="camera" size={40} color="#666" />
                                    </View>
                                )}
                                <View style={styles.editIconBadge}>
                                    <Ionicons name="pencil" size={16} color="#fff" />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.changePhotoText}>Tap to change photo</Text>
                        </View>

                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter username"
                            placeholderTextColor="#666"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={user?.email}
                            editable={false}
                        />

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={updateProfile}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        padding: 20,
    },
    loader: {
        marginTop: 50,
    },
    form: {
        marginTop: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarButton: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#FF5722',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1E1E1E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#333',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF5722',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#121212',
        zIndex: 10,
    },
    changePhotoText: {
        color: '#666',
        marginTop: 10,
        fontSize: 14,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ccc',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 20,
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: '#1a1a1a',
        color: '#888',
        borderColor: '#2a2a2a',
    },
    saveButton: {
        backgroundColor: '#FF5722',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
