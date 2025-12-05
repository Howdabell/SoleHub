import GlassView from '@/components/GlassView';
import NewsCard from '@/components/NewsCard';
import ReleaseCard from '@/components/ReleaseCard';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Release = {
    id: string;
    name: string;
    brand: string;
    release_date: string;
    price: number;
    image_url: string;
};

type News = {
    id: string;
    title: string;
    summary: string;
    image_url: string;
    published_at: string;
};

export default function HomeScreen() {
    const { theme, colors } = useTheme();
    const [releases, setReleases] = useState<Release[]>([]);
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: releasesData } = await supabase
            .from('releases')
            .select('*')
            .gte('release_date', new Date().toISOString())
            .order('release_date', { ascending: true })
            .limit(5);

        const { data: newsData } = await supabase
            .from('news')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(5);

        if (releasesData) setReleases(releasesData);
        if (newsData) setNews(newsData);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color="#FF5722" />
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
                    <View>
                        <Text style={[styles.greeting, { color: colors.text }]}>Welcome back,</Text>
                        <Text style={[styles.title, { color: colors.text }]}>SoleHub</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push('/profile')}>
                        <GlassView style={styles.profileButton} intensity={20} tint={theme === 'dark' ? 'dark' : 'light'}>
                            <Ionicons name="person" size={20} color={colors.text} />
                        </GlassView>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5722" />
                    }
                >
                    {/* Upcoming Drops */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Drops</Text>
                            <TouchableOpacity onPress={() => router.push('/explore')}>
                                <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        {releases.length > 0 ? (
                            <FlatList
                                data={releases}
                                renderItem={({ item }) => <ReleaseCard release={item} />}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.releasesList}
                            />
                        ) : (
                            <Text style={[styles.emptyText, { color: colors.text }]}>No upcoming releases found.</Text>
                        )}
                    </View>

                    {/* Latest News */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest News</Text>
                        <View style={styles.newsList}>
                            {news.map((item) => (
                                <NewsCard key={item.id} news={item} />
                            ))}
                        </View>
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
    center: {
        justifyContent: 'center',
        alignItems: 'center',
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        zIndex: 10,
    },
    greeting: {
        fontSize: 16,
        opacity: 0.8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    releasesList: {
        paddingRight: 20,
    },
    newsList: {
        gap: 15,
    },
    emptyText: {
        fontStyle: 'italic',
        opacity: 0.6,
        marginTop: 10,
    },
});
