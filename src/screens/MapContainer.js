import React from 'react';
import { View, AsyncStorage, StatusBar, Alert, Dimensions } from 'react-native';
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import DispatchApi from '../api/DispatchApi';
import { getLocation, geocodeLocationByCoords } from '../services/location-service';
import mapcontainerstyles from "./mapcontainerstyles";
import WhereTo from '../components/whereTo';
import ConfirmPickup from './ConfirmPickup';
import { Ionicons } from '@expo/vector-icons';
import socketIOClient from 'socket.io-client';
import { Notifications } from 'expo';
import registerForPushNotificationsAsync from '../components/RegisterForPushNotification';
import Modal from "react-native-modal";
import MyRating from './Ratings';

class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
                longName: "",
                shortName: ""
            },
            showRatingModal: false,
            tripStarted: false,
            rating: 0,
            userLocation: {
                latitude: 17.4399,
                longitude: 78.4983
            }
        };


    }

    async componentDidMount() {
        this.getInitialState();
        const token = await AsyncStorage.getItem('riderToken');
        const socket = socketIOClient('https://limitless-cliffs-70609.herokuapp.com/?token=' + token + '&user=rider');
        this.setState({ userSocket: socket });

        registerForPushNotificationsAsync();
        this._notificationSubscription = Notifications.addListener(this._handleNotification);

        socket.on('trip_completed', (data) => {

            Alert.alert(
                '',
                'Trip completed.',
                [
                    { text: 'OK', onPress: () => this.setState({ tripStarted: false, showRatingModal: true, driverName: data.name, driverRatings: Math.round( data.rating * 10) / 10 }) },
                ],
                { cancelable: false },
            );
        });
    }

    _handleNotification = (notification) => {
        this.setState({ notification: notification });
        console.log(notification);
    };

    getInitialState() {
        getLocation().then(
            (data) => {
                this.setState({
                    region: {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003
                    }
                });
            }
        )
            .then(() => {
                geocodeLocationByCoords(this.state.region.latitude, this.state.region.longitude)
                    .then((data) => {
                        this.setState({
                            region: { ...this.state.region, longName: data.long_name, shortName: data.short_name }
                        });
                    });
            })
            .then(() => this.fetchNearByDrivers(this.state.region.latitude, this.state.region.longitude));
    }

    getCoordsFromName(loc) {
        this.setState({
            region: {
                latitude: loc.lat,
                longitude: loc.lng,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003
            }
        });
    }

    userLocationChange = (location) => {
        console.log(location.nativeEvent);
        this.setState({ userLocation: location.nativeEvent.coordinate });
    }

    renderNearByDrivers = () => {

        if (this.state.nearByDrivers) {
            return this.state.nearByDrivers.map((driver, index) => (
                < MapView.Marker
                    key={index}
                    coordinate={{
                        latitude: driver.location.coordinates[0],
                        longitude: driver.location.coordinates[1]
                    }
                    }>
                    <View>
                        <Ionicons name="ios-car" style={mapcontainerstyles.carIcon} />
                    </View>
                </MapView.Marker >
            ));
        }
        return <View />;
    }

    async fetchNearByDrivers(mylatitude, mylongitude) {

        const property = await AsyncStorage.getItem('property');
        DispatchApi.post('/getNearbyDrivers', { 'latitude': mylatitude, 'longitude': mylongitude, property })
            .then(response => this.setState({ nearByDrivers: response.data }))
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }

    ratingCompleted = (rating) => {
        console.log("Rating is: " + rating);
        this.setState({ rating: rating });
    }

    setTripStarted = () => {
        this.setState({ tripStarted: true });
    }

    render() {

        const { navigate } = this.props.navigation;
        const deviceHeight = Dimensions.get("window").height;
        const deviceWidth = Dimensions.get("window").width;

        let component = null;
        switch (this.props.navigation.getParam('pageStatus')) {
            case "ConfirmPickup":
                if (!this.state.tripStarted)
                    component = <ConfirmPickup socket={this.state.userSocket} myRegion={this.state.region} driver={this.state.nearByDrivers ? this.state.nearByDrivers[0] : null} place={this.props.navigation.getParam('place')} navigate={navigate} setTripStarted={this.setTripStarted} />;
                else component = null;
                break;
            default:
                if (!this.state.tripStarted)
                    component = <WhereTo navigation={this.props.navigation} region={this.state.region} />;
                else component = null;
        }

        return (

            <View style={mapcontainerstyles.container}>

                <Modal
                    isVisible={this.state.showRatingModal}
                    onBackdropPress={() => this.setState({ showRatingModal: false })}
                    deviceWidth={deviceWidth}
                    deviceHeight={deviceHeight}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <MyRating ratingCompleted={() => this.setState({ showRatingModal: false })} name={this.state.driverName} rating={this.state.driverRatings} />
                    </View>
                </Modal>

                <MapView
                    style={
                        mapcontainerstyles.map
                    }
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    followsUserLocation
                    fitToElements={MapView.IMMEDIATE_FIT}
                    region={this.state.region}
                    showsCompass={false}
                    onUserLocationChange={this.state.tripStarted ? this.userLocationChange : null}
                >
                    {this.state.tripStarted ? <MapView.Marker
                        ref={marker => { this.marker = marker }}
                        coordinate={this.state.userLocation}
                        image={require('../../assets/car_marker.png')}
                    /> : null}

                    {this.renderNearByDrivers()}
                </MapView>

                {component}
            </View>

        );
    }
}

export default MapContainer;