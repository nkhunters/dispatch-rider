import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Platform,
} from 'react-native';

import MapView, {
    ProviderPropType,
    Marker,
    AnimatedRegion,
} from 'react-native-maps';

const screen = Dimensions.get('window');
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const ASPECT_RATIO = deviceWidth / deviceHeight;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class AnimatedMarkers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            coordinate: new AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE,
            }),
        };
    }

    animate() {
        const { coordinate } = this.state;
        const newCoordinate = {
            latitude: LATITUDE + (Math.random() - 0.5) * (LATITUDE_DELTA / 2),
            longitude: LONGITUDE + (Math.random() - 0.5) * (LONGITUDE_DELTA / 2),
        };

        if (Platform.OS === 'android') {
            if (this.marker) {
                this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
            }
        } else {
            coordinate.timing(newCoordinate).start();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    provider={this.props.provider}
                    style={styles.map}
                    initialRegion={{
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >
                    <Marker.Animated
                        ref={marker => {
                            this.marker = marker;
                        }}
                        coordinate={this.state.coordinate}
                    />
                </MapView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => this.animate()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text>Animate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

AnimatedMarkers.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
});

export default AnimatedMarkers;