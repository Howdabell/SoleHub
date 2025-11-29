import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function AddReviewScreen() {
    const { shoeId, shoeName } = useLocalSearchParams();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const submitReview = async () => {
        if (rating === 0) {
            Alert.alert('Error', 'Please select a rating');
            return;
        }

        setLoading(true);

        try {
            // Check if user has a profile, if not create one (simplified for this flow)
            // Ideally profile creation happens at signup, but RLS requires it for foreign key
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user?.id)
                .single();

            if (!profile && user) {
                await supabase.from('profiles').insert({
                    id: user.id,
                    username: user.email?.split('@')[0],
                });
            }

            const { error } = await supabase
                .from('reviews')
                .insert({
                    user_id: user?.id,
                    shoe_id: shoeId,
                    rating,
                    comment,
                });

            if (error) throw error;

            Alert.alert('Success', 'Review submitted successfully!');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Write Review', headerBackTitle: 'Back' }} />
            <Text style={styles.title}>Reviewing: {shoeName}</Text>

            <Text style={styles.label}>Rating</Text>
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Ionicons
                            name={star <= rating ? "star" : "star-outline"}
                            size={40}
                            color="#FFD700"
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Comment (Optional)</Text>
            <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                placeholder="Share your thoughts on traction, cushion, etc..."
                placeholderTextColor="#666"
                value={comment}
                onChangeText={setComment}
            />

            <TouchableOpacity
                style={styles.submitButton}
                onPress={submitReview}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text style={styles.submitButtonText}>Submit Review</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF5722',
        marginBottom: 30,
        letterSpacing: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ccc',
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        gap: 10,
    },
    input: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#333',
        height: 120,
        textAlignVertical: 'top',
        marginBottom: 30,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#FF5722',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
