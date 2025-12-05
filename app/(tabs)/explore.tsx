import GlassView from '@/components/GlassView';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { LayoutGrid, List as ListIcon, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type Shoe = {
  id: string;
  name: string;
  brand: string;
  image_url: string;
  reviews: { rating: number }[];
};

export default function ExploreScreen() {
  const { theme, colors } = useTheme();
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const fetchShoes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('shoes')
      .select('*, reviews(rating)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setShoes(data || []);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchShoes();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchShoes();
  }, []);

  const toggleLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNumColumns(prev => prev === 1 ? 2 : 1);
  };

  const filteredShoes = shoes.filter(shoe =>
    shoe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shoe.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Shoe }) => {
    const averageRating = item.reviews && item.reviews.length > 0
      ? item.reviews.reduce((acc, curr) => acc + curr.rating, 0) / item.reviews.length
      : 0;
    const reviewCount = item.reviews ? item.reviews.length : 0;

    if (numColumns === 2) {
      return (
        <TouchableOpacity
          style={styles.cardGridWrapper}
          onPress={() => router.push(`/shoe/${item.id}`)}
          activeOpacity={0.8}
        >
          <GlassView style={styles.cardGrid} intensity={20} tint={theme === 'dark' ? 'dark' : 'light'}>
            <Image source={{ uri: item.image_url }} style={styles.imageGrid} />
            <View style={styles.cardContentGrid}>
              <Text style={styles.brandGrid} numberOfLines={1}>{item.brand}</Text>
              <Text style={[styles.nameGrid, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
              {reviewCount > 0 && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={[styles.ratingText, { color: colors.text }]}>
                    {averageRating.toFixed(1)} <Text style={[styles.reviewCount, { color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }]}>({reviewCount})</Text>
                  </Text>
                </View>
              )}
            </View>
          </GlassView>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => router.push(`/shoe/${item.id}`)}
        activeOpacity={0.8}
      >
        <GlassView style={styles.card} intensity={20} tint={theme === 'dark' ? 'dark' : 'light'}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
            {reviewCount > 0 && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {averageRating.toFixed(1)} <Text style={[styles.reviewCount, { color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }]}>({reviewCount})</Text>
                </Text>
              </View>
            )}
          </View>
        </GlassView>
      </TouchableOpacity>
    );
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
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Explore</Text>
          <TouchableOpacity onPress={toggleLayout} style={styles.layoutButton}>
            <GlassView style={styles.iconGlass} intensity={30} tint={theme === 'dark' ? 'dark' : 'light'}>
              {numColumns === 1 ? (
                <LayoutGrid size={20} color={colors.text} />
              ) : (
                <ListIcon size={20} color={colors.text} />
              )}
            </GlassView>
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <GlassView
            style={styles.searchBar}
            contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
            intensity={20}
            tint={theme === 'dark' ? 'dark' : 'light'}
          >
            <Search size={20} color={theme === 'dark' ? "rgba(255, 255, 255, 0.5)" : "rgba(0,0,0,0.5)"} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search shoes..."
              placeholderTextColor={theme === 'dark' ? "rgba(255, 255, 255, 0.5)" : "rgba(0,0,0,0.5)"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </GlassView>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#FF5722" style={styles.loader} />
        ) : (
          <FlatList
            key={numColumns}
            data={filteredShoes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            numColumns={numColumns}
            columnWrapperStyle={numColumns === 2 ? styles.columnWrapper : undefined}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5722" />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }]}>No shoes found.</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  layoutButton: {
    // padding: 8,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchBar: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  iconGlass: {
    padding: 8,
    borderRadius: 12,
  },
  loader: {
    marginTop: 50,
  },
  list: {
    padding: 15,
    paddingBottom: 100, // Add padding for bottom tab bar
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    fontStyle: 'italic',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  // List View Styles
  cardWrapper: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  brand: {
    fontSize: 12,
    color: '#FF5722',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Grid View Styles
  cardGridWrapper: {
    flex: 1,
    marginBottom: 15,
    maxWidth: '48%',
  },
  cardGrid: {
    borderRadius: 16,
    overflow: 'hidden',
    // height: '100%',
  },
  imageGrid: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardContentGrid: {
    padding: 10,
  },
  brandGrid: {
    fontSize: 10,
    color: '#FF5722',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  nameGrid: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewCount: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 'normal',
  },
});
