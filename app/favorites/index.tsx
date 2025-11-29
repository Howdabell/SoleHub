import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Shoe = {
    id: string;
    name: string;
    brand: string;
    image_url: string;
};

export default function FavoritesScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const [favorites, setFavorites] = useState<Shoe[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchFavorites();
            }
        }, [user])
    );

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('favorites')
                .select(`
                    shoe_id,
                    shoes (
                        id,
                        name,
                        brand,
                        image_url
                    )
                `)
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching favorites:', error);
            } else if (data) {
                const formattedFavorites = data.map((item: any) => item.shoes);
                setFavorites(formattedFavorites);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFavorites();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: Shoe }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/shoe/${item.id}`)}
        >
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.name}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: 'Favorites',
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#fff',
            }} />

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color="#FF5722" style={styles.loader} />
            ) : favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={80} color="#333" />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <Text style={styles.emptySubText}>Start adding shoes you like!</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5722" />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loader: {
        marginTop: 50,
    },
    list: {
        padding: 15,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    cardContent: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
    },
    brand: {
        fontSize: 12,
        color: '#FF5722',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    emptySubText: {
        color: '#666',
        marginTop: 10,
    },
});
