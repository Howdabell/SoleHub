import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GlassView from './GlassView';

type NewsCardProps = {
    news: {
        id: string;
        title: string;
        summary: string;
        image_url: string;
        published_at: string;
    };
};

export default function NewsCard({ news }: NewsCardProps) {
    const publishedDate = new Date(news.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <TouchableOpacity activeOpacity={0.8}>
            <GlassView style={styles.container} contentContainerStyle={{ flex: 1 }} intensity={30} tint="dark">
                <View style={styles.innerContainer}>
                    <Image source={{ uri: news.image_url }} style={styles.image} />
                    <View style={styles.content}>
                        <Text style={styles.date}>{publishedDate}</Text>
                        <Text style={styles.title} numberOfLines={2}>{news.title}</Text>
                        <Text style={styles.summary} numberOfLines={2}>{news.summary}</Text>
                    </View>
                </View>
            </GlassView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        marginBottom: 15,
        height: 110,
    },
    innerContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    image: {
        width: 110,
        height: '100%',
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    date: {
        fontSize: 10,
        color: '#FF5722',
        marginBottom: 4,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 6,
    },
    summary: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 16,
    },
});
