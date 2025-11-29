import { Text, View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { LayoutGrid, List as ListIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  UIManager
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
};

export default function TabOneScreen() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [numColumns, setNumColumns] = useState(1);
  const router = useRouter();

  const fetchShoes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('shoes')
      .select('*')
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
    setNumColumns(prev => prev === 1 ? 3 : 1);
  };

  const renderItem = ({ item }: { item: Shoe }) => {
    if (numColumns === 3) {
      return (
        <TouchableOpacity
          style={styles.cardGrid}
          onPress={() => router.push(`/shoe/${item.id}`)}
        >
          <Image source={{ uri: item.image_url }} style={styles.imageGrid} />
          <View style={styles.cardContentGrid}>
            <Text style={styles.brandGrid} numberOfLines={1}>{item.brand}</Text>
            <Text style={styles.nameGrid} numberOfLines={1}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/images/solehub-logo.png')} style={styles.headerLogo} />
          <Text style={styles.headerTitle}>SoleHub</Text>
        </View>
        <TouchableOpacity onPress={toggleLayout} style={styles.layoutButton}>
          {numColumns === 1 ? (
            <LayoutGrid size={24} color="#FF5722" />
          ) : (
            <ListIcon size={24} color="#FF5722" />
          )}
        </TouchableOpacity>
      </View>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#FF5722" style={styles.loader} />
      ) : (
        <FlatList
          key={numColumns} // Force re-render when columns change
          data={shoes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          numColumns={numColumns}
          columnWrapperStyle={numColumns === 3 ? styles.columnWrapper : undefined}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5722" />
          }
        />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1E1E1E',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5722',
    letterSpacing: 1,
  },
  layoutButton: {
    padding: 8,
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
  },
  loader: {
    marginTop: 50,
  },
  list: {
    padding: 15,
  },
  columnWrapper: {
    gap: 10, // Spacing between columns
  },
  // List View Styles
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
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
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Grid View Styles
  cardGrid: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    elevation: 3,
  },
  imageGrid: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  cardContentGrid: {
    padding: 8,
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
});
