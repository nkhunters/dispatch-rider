import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Platform, Alert } from 'react-native';
import { Button } from "native-base";
import Spinner from 'react-native-loading-spinner-overlay';
import DispatchApi from '../api/DispatchApi';

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const EstimatePickup = ({ navigation }) => {

    const socket = navigation.getParam('mySocket');
    const tripId = navigation.getParam('tripId');
    const driverId = navigation.getParam('driverId');
    const myRegion = navigation.getParam('myRegion');
    const setTripStarted = navigation.getParam('setTripStarted');
    const { latitude, longitude } = myRegion;

    let interval;
    const [isLoading, setLoading] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState(Math.floor(navigation.getParam('estimatedTime')) + " mins");

    getEstimatedTime = () => {

        DispatchApi.post('/getEstimatedTimeByDriverId', { driverId, latitude, longitude })
            .then(response => { console.log(response.data); setEstimatedTime(response.data) })
            .catch((error) => {
            });
    }

    useEffect(() => {
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => getEstimatedTime(), 10000);

        socket.on('trip_canceled_by_driver', (data) => {

            clearInterval(interval);
            Alert.alert(
                '',
                'Trip canceled by driver',
                [
                    { text: 'OK', onPress: () => navigation.navigate('MapContainer', { pageStatus: '' }) },
                ],
                { cancelable: false },
            );
        });

        socket.on('trip_canceled_by_rider', (data) => {

            setLoading(false);
            Alert.alert(
                '',
                `Trip Canceled`,
                [
                    { text: 'OK', onPress: () => navigation.navigate('MapContainer', { pageStatus: '' }) },
                ],
                { cancelable: false },
            );
        });

        socket.on('trip_started', (data) => {
            setTripStarted();
            navigation.navigate('MapContainer', { pageStatus: 'tripStarted' });
        });

    }, []);


    cancelTrip = () => {
        setLoading(true);
        socket.emit('cancel_trip_rider', { tripId: tripId, driverId: driverId });
    }

    return (

        <View style={styles.container}>

            <View
                style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: '#0091C6' }}
            >
                <Spinner
                    visible={isLoading}
                    textContent={'Loading...'}

                />

                <View pointerEvents="box-none" style={{ flex: 1, position: "relative" }}>

                    <View style={styles.headerContainer} pointerEvents="box-none">
                        <View style={{ flex: 0.8, height: 35 }}>
                        </View>
                        <View
                            style={Platform.OS === "ios" ? styles.iosSrcdes : styles.aSrcdes}
                        >

                            <View style={Platform.OS === "ios" ? styles.iosSearchBar : styles.aSearchBar}>
                                <Button transparent light onPress={() => { cancelTrip() }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel Trip</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>


                <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bottom: 0, position: 'absolute', width: '100%', height: deviceHeight - 60 }}>
                    <Text style={{ color: 'white', marginBottom: 10 }}>Estimated Pickup Time</Text>
                    <View style={{ flexDirection: 'row', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: "bold", fontSize: 40, color: 'white', textAlign: 'center' }}>
                                {estimatedTime}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        position: "relative",
        backgroundColor: "#0091C6"
    },
    iosSearchBar: {
        width: deviceWidth - 30,
        alignSelf: "center",
        flex: 1,
        shadowColor: "#aaa",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 3,
        shadowOpacity: 0.5
    },
    aSearchBar: {
        width: deviceWidth - 30,
        alignItems: 'center',
        alignSelf: "center",
        flex: 1,
        shadowColor: "#aaa",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 3,
        shadowOpacity: 0.5
    },
    searchBar: {
        width: deviceWidth - 30,
        alignSelf: "center",
        backgroundColor: "#EEE",
        borderRadius: 10,
        marginLeft: -5,
        marginTop: 5,
        shadowColor: "#aaa",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 3,
        shadowOpacity: 0.5
    },
    searchIcon: {
        fontSize: 25,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignSelf: "center",
        flex: 0,
        left: 0,
        color: "#818183",
        marginHorizontal: 5
    },
    aSrcdes: {
        paddingVertical: 7
    },
    iosSrcdes: {
        //paddingVertical: 25,
        paddingHorizontal: 20
    },
    container: {
        flex: 1,
        position: "relative",
        backgroundColor: "#fff"
    },

    map: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff"
    },

    headerContainer: {
        position: "absolute",
        top: 0,
        width: deviceWidth
    },
    iosHeader: {
        backgroundColor: "#fff"
    },
    aHeader: {
        backgroundColor: "#fff",
        borderColor: "#aaa",
        elevation: 3,
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
});

export default EstimatePickup;