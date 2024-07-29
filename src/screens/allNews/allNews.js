import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native'
import xml2js from 'react-native-xml2js';
import { useNavigation } from "@react-navigation/native";


const AllNews = () => {
    const navigation = useNavigation()


    const [rssItems, setRssItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const deviceWidth = Dimensions.get('window').width - 30;

    const RSS_URL = 'https://cdn.24h.com.vn/upload/rss/trangchu24h.rss'

    const fetchRSS = async (isInitialFetch = false) => {
        setLoading(true);
        try {
            const response = await fetch(RSS_URL);
            const responseData = await response.text();
            xml2js.parseString(responseData, (err, result) => {
                if (err) {
                    console.error('Error parsing RSS feed:', err);
                    return;
                }
                const items = result.rss.channel[0].item.map((item) => ({
                    // Store item information into an array for easier reference
                    title: item.title[0],
                    link: item.link[0],
                    description: typeof item.description[0] === 'string' ? JSON.parse(item.description[0]) : (item.description[0]),
                    image: typeof item?.description[0] === 'string' ? JSON.parse(JSON.parse(JSON.parse(item?.description[0])?.img)[0]?.$)?.src : item.description[0]?.img[0].$.src,
                }));
                if (isInitialFetch) {
                    setRssItems(items.slice(0, 10));  // Set the first 10 items initially
                    setOffset(10);  // Set offset to 10 for the next batch
                    if (items.length <= 10) {
                        setHasMore(false);
                    }
                } else {
                    const nextItems = items.slice(offset, offset + 10);
                    if (nextItems.length < 10) {
                        setHasMore(false);
                    }
                    setRssItems((prevItems) => [...prevItems, ...nextItems]);
                    setOffset(offset + 10);
                }
            });
        } catch (error) {
            console.error('Error fetching or parsing RSS feed:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRSS(true);
    }, []);

    const loadMoreItems = () => {
        if (loading || !hasMore) return;
        fetchRSS(false);
    };

    const handlePress = (item) => {
        if (item.link) {
            navigation.navigate('webview', { link: item.link })
        }
    }

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        if (isCloseToBottom && !loading && hasMore) {
            loadMoreItems();
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                scrollEnabled={true}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {rssItems.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => handlePress(item)}>
                        <View style={styles.itemContainer}>
                            <Image
                                style={{ width: deviceWidth, height: 250 }}
                                source={{ uri: item.image }}
                            />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.description}>{item.description._}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator />
                        <Text style={styles.loading}>Loading...</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
    },
    itemContainer: {
        marginBottom: 16,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    loadingContainer: {
        padding: 16,
        alignItems: 'center',
    },
    loading: {
        marginTop: 8,
    },
})

export default AllNews