import GlassView from '@/components/GlassView';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Review = {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user_id: string;
    profiles: {
        username: string;
        avatar_url: string | null;
    };
};

type ShoeDetail = {
    id: string;
    name: string;
    brand: string;
    description: string;
    image_url: string;
    price: number;
    release_date: string;
};

export default function ShoeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const { theme, colors } = useTheme();
    const router = useRouter();
    const [shoe, setShoe] = useState<ShoeDetail | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const scrollY = new Animated.Value(0);

    useEffect(() => {
        fetchShoeDetails();
        fetchReviews();
    }, [id]);

    const fetchShoeDetails = async () => {
        const { data, error } = await supabase
            .from('shoes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
        } else {
            setShoe(data);
        }
        setLoading(false);
    };

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
            .eq('shoe_id', id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setReviews(data || []);
        }
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            Alert.alert('Error', 'Please select a rating');
            return;
        }

        setSubmitting(true);
        const { error } = await supabase.from('reviews').insert({
            shoe_id: id,
            user_id: user?.id,
            rating,
            comment,
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            setRating(0);
            setComment('');
            fetchReviews();
            Alert.alert('Success', 'Review submitted successfully!');
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color="#FF5722" />
            </View>
        );
    }

    if (!shoe) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Shoe not found</Text>
            </View>
        );
    }

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
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <GlassView style={styles.iconGlass} intensity={30} tint={theme === 'dark' ? 'dark' : 'light'}>
                            <Ionicons name="arrow-back" size={24} color={colors.text} />
                        </GlassView>
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{shoe.brand}</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Image Section with Frame */}
                    <View style={styles.imageSection}>
                        <GlassView
                            style={styles.imageFrame}
                            contentContainerStyle={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
                            intensity={10}
                            tint={theme === 'dark' ? 'dark' : 'light'}
                        >
                            <Animated.Image
                                source={{ uri: shoe.image_url }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </GlassView>
                    </View>

                    {/* Details Section */}
                    <GlassView
                        style={styles.detailsContainer}
                        contentContainerStyle={styles.detailsContent}
                        intensity={20}
                        tint={theme === 'dark' ? 'dark' : 'light'}
                    >
                        <View style={styles.titleRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.brand, { color: colors.primary }]}>{shoe.brand}</Text>
                                <Text style={[styles.name, { color: colors.text }]}>{shoe.name}</Text>
                            </View>
                            <Text style={[styles.price, { color: colors.accent }]}>
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(shoe.price)}
                            </Text>
                        </View>

                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
                        <Text style={[styles.description, { color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }]}>{shoe.description}</Text>

                        <View style={styles.divider} />

                        {/* Reviews Section */}
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews ({reviews.length})</Text>

                        {/* Add Review Form */}
                        <View style={styles.addReviewForm}>
                            <Text style={[styles.subTitle, { color: colors.text }]}>Write a Review</Text>
                            <View style={styles.ratingInput}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                        <Ionicons
                                            name={star <= rating ? "star" : "star-outline"}
                                            size={32}
                                            color="#FFD700"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}
                                placeholder="Share your thoughts..."
                                placeholderTextColor={theme === 'dark' ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                                value={comment}
                                onChangeText={setComment}
                                multiline
                            />
                            <TouchableOpacity
                                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                                onPress={handleSubmitReview}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit Review</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Reviews List */}
                        {reviews.map((review) => (
                            <View key={review.id} style={[styles.reviewItem, { borderBottomColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.userInfo}>
                                        {review.profiles?.avatar_url ? (
                                            <Image source={{ uri: review.profiles.avatar_url }} style={styles.userAvatar} />
                                        ) : (
                                            <View style={[styles.placeholderAvatar, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
                                                <Ionicons name="person" size={16} color={colors.text} />
                                            </View>
                                        )}
                                        <Text style={[styles.username, { color: colors.text }]}>{review.profiles?.username || 'Anonymous'}</Text>
                                    </View>
                                    <View style={styles.ratingDisplay}>
                                        <Ionicons name="star" size={14} color="#FFD700" />
                                        <Text style={[styles.ratingValue, { color: colors.text }]}>{review.rating}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.reviewComment, { color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }]}>{review.comment}</Text>
                                <Text style={styles.reviewDate}>
                                    {new Date(review.created_at).toLocaleDateString()}
                                </Text>
                            </View>
                        ))}
                    </GlassView>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    orb1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
        zIndex: 0,
    },
    orb2: {
        position: 'absolute',
        bottom: 100,
        left: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(33, 150, 243, 0.08)',
        zIndex: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
    },
    iconGlass: {
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    imageSection: {
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
        height: 300,
    },
    imageFrame: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    detailsContainer: {
        marginHorizontal: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    detailsContent: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    brand: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 20,
    },
    addReviewForm: {
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    ratingInput: {
        flexDirection: 'row',
        marginBottom: 15,
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 15,
    },
    submitButton: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    reviewItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    userAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    placeholderAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    ratingDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingValue: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    reviewComment: {
        fontSize: 14,
        marginBottom: 4,
    },
    reviewDate: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
    },
});
