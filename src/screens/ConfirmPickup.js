import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform, Alert, AsyncStorage } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Item, Input, Text } from "native-base";
import commonColor from "./commonColor";
import { getDistance } from 'geolib';
import Spinner from 'react-native-loading-spinner-overlay';

const deviceWidth = Dimensions.get("window").width;

const ConfirmPickup = ({ socket, myRegion, driver, place, navigate, setTripStarted }) => {

    const [riderCount, setRiderCount] = useState(1);
    const [isLoading, setLoader] = useState(false);

    var estimatedTime = 5;
    if (driver) {
        const distance = getDistance(
            { latitude: myRegion.latitude, longitude: myRegion.longitude },
            { latitude: driver.location.coordinates[0], longitude: driver.location.coordinates[1] }
        );

        estimatedTime = distance / 250;
    }

    useEffect(() => {

        if (isLoading) {
            setInterval(() => {
                setLoader(false);
                Alert.alert(
                    '',
                    `No drivers found. Please try again`,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
            }, 20000);
        }

        /* socket.on('trip_canceled_by_driver', (data) => {

            Alert.alert(
                '',
                'Trip canceled by driver',
                [
                    { text: 'OK', onPress: () => navigate('MapContainer', { pageStatus: '' }) },
                ],
                { cancelable: false },
            );
        });
 */
        socket.on('trip_request_response', (data) => {
            setLoader(false);
            if (!data.status) {
                Alert.alert(
                    '',
                    `${data.message}`,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
            }
            else {
                navigate('EstimatePickup', { 'myRegion': myRegion, 'mySocket': socket, 'estimatedTime': estimatedTime, 'tripId': data.tripId, 'driverId': data.driverId, 'setTripStarted': setTripStarted });
            }

        });
    }, []);

    sendTripRequest = async () => {

        const property = await AsyncStorage.getItem('property');
        const name = await AsyncStorage.getItem('name');
        const notificationToken = await AsyncStorage.getItem('notificationToken');

        const tripRequest = {
            userRegion: myRegion,
            place: place,
            riderCount: riderCount,
            property: property,
            name: name,
            notificationToken: notificationToken
        }

        socket.emit('trip_request', tripRequest);
    }

    return (
        <View
            style={{ position: 'absolute', height: '100%', width: '100%' }}
        >
            <Spinner
                visible={isLoading}
                textContent={''}
            />

            <View pointerEvents="box-none" style={{ flex: 1, position: "relative" }}>

                <View style={styles.headerContainer} pointerEvents="box-none">
                    <View style={{ flex: 0.8, height: 35 }}>
                    </View>
                    <View
                        style={Platform.OS === "ios" ? styles.iosSrcdes : styles.aSrcdes}
                    >

                        <View style={Platform.OS === "ios" ? styles.iosSearchBar : styles.aSearchBar}>
                            <Item
                                regular
                                style={{
                                    backgroundColor: "#FFF",
                                    marginLeft: 0,
                                    borderColor: "transparent",
                                    borderRadius: 10
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => navigate('MapContainer', { pageStatus: '' })} >
                                    <AntDesign name="arrowleft" style={styles.searchIcon} />
                                </TouchableOpacity>

                                <Input
                                    type="text"
                                    name="destination"
                                    placeholder={`Your location  ->  ${place.main_text}`}
                                    placeholderTextColor="#9098A1"
                                    editable={false}
                                    style={{ fontSize: 16, fontWeight: '500' }}
                                />
                            </Item>
                        </View>
                    </View>
                </View>
            </View>


            <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, width: '100%', height: 230, backgroundColor: commonColor.brandPrimary }}>
                <Text style={{ color: 'white', marginBottom: 10 }}>Number of riders</Text>
                <View style={{ flexDirection: 'row', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', width: '50%', height: '90%', backgroundColor: 'white', borderRadius: 10 }}>
                        <TouchableOpacity
                            style={{ width: '49.5%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                riderCount + 1 > 6 ? setRiderCount(riderCount) :
                                    setRiderCount(riderCount + 1)
                            }}
                        >
                            <Text style={{ color: commonColor.brandPrimary, fontWeight: "500", fontSize: 50, marginTop: -10 }}>+</Text>
                        </TouchableOpacity>
                        <View style={{ height: '100%', width: '1%', backgroundColor: commonColor.brandPrimary }} />
                        <TouchableOpacity
                            style={{ width: '49.5%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                riderCount - 1 <= 0 ? setRiderCount(riderCount) :
                                    setRiderCount(riderCount - 1)
                            }}
                        >
                            <Text style={{ color: commonColor.brandPrimary, fontSize: 50, fontWeight: "500", marginTop: -10 }}>-</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '20%', height: '100%', marginLeft: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: "500", fontSize: 30, color: commonColor.brandPrimary, textAlign: 'center' }}>
                            {riderCount}
                        </Text>
                    </View>
                </View>
                {driver ? <Text style={{ color: 'white', marginBottom: 10, marginTop: 10 }}>Estimated Pickup time: {Math.floor(estimatedTime)} mins</Text> : <Text style={{ color: 'white', marginBottom: 10, marginTop: 10 }}> </Text>}


                <TouchableOpacity
                    style={{ width: '80%', height: 40, marginTop: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: commonColor.brandInfo }}
                    onPress={() => {
                        setLoader(true);
                        sendTripRequest();
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: "500", }}>Confirm Pickup</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    iosSearchBar: {
        width: deviceWidth - 30,
        alignSelf: "center",
        //marginTop: 10,
        //paddingLeft: 5,
        flex: 1,
        shadowColor: "#aaa",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 3,
        shadowOpacity: 0.5
        //paddingTop: 12,
        //margin: 10
    },
    aSearchBar: {
        width: deviceWidth - 30,
        alignSelf: "center",
        //marginTop: 10,
        //paddingLeft: 5,
        flex: 1,
        shadowColor: "#aaa",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 3,
        shadowOpacity: 0.5
        //paddingTop: 9,
        //margin: 10
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

export default ConfirmPickup;