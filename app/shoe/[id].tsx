import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

type Shoe = {
    id: string;
    name: string;
    brand: string;
    description: string;
    image_url: string;
};

type Review = {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles: {
        username: string;
        avatar_url: string;
    };
};

export default function ShoeDetailScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const [shoe, setShoe] = useState<Shoe | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const router = useRouter();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        fetchShoeDetails();
        if (user) {
            checkFavoriteStatus();
        }
    }, [id, user]);

    useEffect(() => {
        if (!loading && shoe) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.exp),
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.exp),
                }),
            ]).start();
        }
    }, [loading, shoe]);

    const checkFavoriteStatus = async () => {
        try {
            const { data, error } = await supabase
                .from('favorites')
                .select('*')
                .eq('user_id', user?.id)
                .eq('shoe_id', id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
                console.error('Error checking favorite:', error);
            } else if (data) {
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user?.id)
                    .eq('shoe_id', id);

                if (error) throw error;
                setIsFavorite(false);
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .insert({ user_id: user?.id, shoe_id: id });

                if (error) throw error;
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const fetchShoeDetails = async () => {
        setLoading(true);

        // Fetch shoe details
        const { data: shoeData, error: shoeError } = await supabase
            .from('shoes')
            .select('*')
            .eq('id', id)
            .single();

        if (shoeError) console.error(shoeError);
        else setShoe(shoeData);

        // Fetch reviews
        const { data: reviewData, error: reviewError } = await supabase
            .from('reviews')
            .select(`
        id,
        rating,
        comment,
        created_at,
        profiles (
          username,
          avatar_url
        )
      `)
            .eq('shoe_id', id)
            .order('created_at', { ascending: false });

        if (reviewError) console.error(reviewError);
        else setReviews((reviewData as any) || []);

        setLoading(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!shoe) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Shoe not found.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{
                headerTitle: shoe.brand,
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#fff',
                headerRight: () => (
                    <TouchableOpacity onPress={toggleFavorite} style={{ marginRight: 10 }}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? "#FF5722" : "#fff"}
                        />
                    </TouchableOpacity>
                ),
            }} />
            <ScrollView>
                <Animated.Image
                    source={{ uri: shoe.image_url }}
                    style={[styles.image, { opacity: fadeAnim }]}
                />
                <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
                    <Text style={styles.name}>{shoe.name}</Text>
                    <Text style={styles.description}>{shoe.description}</Text>

                    <View style={styles.reviewsHeader}>
                        <Text style={styles.sectionTitle}>Reviews</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push({ pathname: '/review/add', params: { shoeId: shoe.id, shoeName: shoe.name } })}
                        >
                            <Text style={styles.addButtonText}>Write a Review</Text>
                        </TouchableOpacity>
                    </View>

                    {reviews.length === 0 ? (
                        <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
                    ) : (
                        reviews.map((review) => (
                            <View key={review.id} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <Text style={styles.username}>{review.profiles?.username || 'Anonymous'}</Text>
                                    <View style={styles.rating}>
                                        <Ionicons name="star" size={16} color="#FFD700" />
                                        <Text style={styles.ratingText}>{review.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.comment}>{review.comment}</Text>
                                <Text style={styles.date}>{new Date(review.created_at).toLocaleDateString()}</Text>
                            </View>
                        ))
                    )}
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    errorText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    content: {
        padding: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#ccc',
        lineHeight: 24,
        marginBottom: 30,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#FF5722',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    noReviews: {
        color: '#666',
        fontStyle: 'italic',
        marginTop: 10,
    },
    reviewCard: {
        backgroundColor: '#1E1E1E',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    username: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        color: '#FFD700',
        marginLeft: 4,
        fontWeight: 'bold',
        fontSize: 14,
    },
    comment: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    date: {
        color: '#666',
        fontSize: 12,
        textAlign: 'right',
    },
});
