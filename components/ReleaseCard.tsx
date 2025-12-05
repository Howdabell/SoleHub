import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GlassView from './GlassView';

type ReleaseCardProps = {
    release: {
        id: string;
        name: string;
        brand: string;
        release_date: string;
        price: number;
        image_url: string;
    };
};

export default function ReleaseCard({ release }: ReleaseCardProps) {
    const releaseDate = new Date(release.release_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    return (
        <GlassView style={styles.container} intensity={30} tint="dark">
            <Image source={{ uri: release.image_url }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.brand}>{release.brand}</Text>
                    <Text style={styles.date}>{releaseDate}</Text>
                </View>
                <Text style={styles.name} numberOfLines={2}>{release.name}</Text>
                <View style={styles.footer}>
                    <Text style={styles.price}>${release.price}</Text>
                    <TouchableOpacity style={styles.notifyButton}>
                        <Ionicons name="notifications-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </GlassView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 200,
        borderRadius: 16,
        marginRight: 15,
    },
    image: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    content: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    brand: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.7)',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    date: {
        fontSize: 10,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        overflow: 'hidden',
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 10,
        height: 40,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    notifyButton: {
        padding: 6,
        backgroundColor: 'rgba(255, 87, 34, 0.8)',
        borderRadius: 20,
    },
});
