import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { ListItem, Body, Icon, Right } from 'native-base';

const PlacesAutoComplete = (props) => {

    const { navigate } = props.navigation;
    const [searchBarText, setSearchBarText] = useState("");
    const [placesPredictions, setPredictions] = useState([]);

    const API_KEY = "AIzaSyC-PwM6vlwZYQ4fe6mPUaDlm-7OK2Rt_SY";
    const region = props.navigation.getParam('region');

    useEffect(() => {
        // code to run on component mount

    }, [])

    const handlePrediction = (prediction) => {

        myPrediction = {
            key: new Date().getTime().toString(),
            description: prediction.description,
            distance_meters: prediction.distance_meters,
            distance_miles: Math.round((prediction.distance_meters * 0.000621371) * 100) / 100,
            place_id: prediction.place_id,
            main_text: prediction.structured_formatting.main_text,
            secondary_text: prediction.structured_formatting.secondary_text
        }

        let myPredctionArray = [...placesPredictions, myPrediction];
        myPredctionArray.sort((a, b) => parseFloat(a.distance_meters) - parseFloat(b.distance_meters));
        setPredictions(myPredctionArray);
        //console.log(myPredctionArray);
    }

    const searchPlace = (newValue) => {

        setSearchBarText(newValue);
        setPredictions([]);

        if (newValue.length < 2)
            return;

        const query = encodeURIComponent(newValue);

        //const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&origin=${region.latitude},${region.longitude}&location=${region.latitude},${region.longitude}&offset=${query.length - 1}&radius=50000&language=en&key=${API_KEY}`;
        //console.log(url);
        fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&origin=${region.latitude},${region.longitude}&language=en&key=${API_KEY}`)
            .then(response => response.json())
            .then(predictions => predictions.predictions.forEach(handlePrediction))
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    };

    const handleItemPress = (item) => {

        // console.log(item);
        fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${item.place_id}&key=${API_KEY}`)
            .then(response => response.json())
            .then(result => {
                let selectedPlace = { ...item, latitude: result.result.geometry.location.lat, longitude: result.result.geometry.location.lng };
                navigate('MapContainer', { pageStatus: 'ConfirmPickup', place: selectedPlace });
                // console.log(result.result.geometry.location)
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                // always executed
            });

        //navigate('ConfirmPickup');
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#CFCCD699" }} forceInset={{ top: 'always' }}>
            <View style={styles.searchBar}>
                <TouchableOpacity style={styles.backIconStyle} onPress={() => navigate('MapContainer')}><AntDesign name="arrowleft" style={{ fontSize: 25 }} /></TouchableOpacity>
                <TextInput
                    value={searchBarText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.inputStyle}
                    placeholder="Search"
                    onChangeText={(newValue) => searchPlace(newValue)} />
                <TouchableOpacity style={styles.closeIconStyle} onPress={() => { setSearchBarText(""); setPredictions([]) }}><AntDesign name="close" style={{ fontSize: 25 }} /></TouchableOpacity>
            </View>

                <FlatList
                    style={styles.listStyle}
                    keyExtractor={(item) => {
                        return item.key;
                    }}
                    data={placesPredictions}
                    renderItem={({ item }) => {
                        return (
                            <ListItem onPress={() => handleItemPress(item)}>
                                <Body>
                                    <Text>{item.main_text}</Text>
                                    <Text note>{`${item.distance_miles} mi`}</Text>
                                </Body>
                                <Right>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </ListItem>
                        )
                    }}
                />
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({

    searchBar: {
        height: 50,
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 10,
        flexDirection: "row",
        marginTop: 30
    },
    inputStyle: {
        flex: 1,
        fontSize: 15
    },
    backIconStyle: {
        alignSelf: "center",
        marginHorizontal: 15
    },
    closeIconStyle: {
        alignSelf: "center",
        marginHorizontal: 15
    },
    listStyle: {
        marginTop: 50,
        backgroundColor: "white",
    }
});

export default PlacesAutoComplete;