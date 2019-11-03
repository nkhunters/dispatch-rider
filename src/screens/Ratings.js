import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import commonColor from "./commonColor";

//const WATER_IMAGE = require('./water.png');

const deviceWidth = Dimensions.get("window").width;

const MyRating = ({ name, rating, ratingCompleted }) => {

    return (

        <View
            style={{
                position: 'absolute', height: '100%', width: '100%', justifyContent: 'center',
                alignItems: 'center'
            }} >

            <View style={{ borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100%', height: 230, backgroundColor: commonColor.brandPrimary }}>
                <Text style={{ color: 'white', marginBottom: 5, fontWeight: "bold", fontSize: 18 }}>{name}</Text>
                <Text style={{ color: 'white', marginBottom: 10 }}>{rating}</Text>
                <Text style={{ color: 'white', marginBottom: 10, marginTop: 10 }}>Rate your trip</Text>
                <View style={{ flexDirection: 'row', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <AirbnbRating
                        showRating={false}
                        defaultRating={0}
                        ratingBackgroundColor='#c8c7c8'
                        style={{ paddingVertical: 10 }}
                    />
                </View>

                <TouchableOpacity
                    style={{ width: '80%', height: 40, marginTop: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3ACCE1' }}
                    onPress={() => ratingCompleted()}
                >
                    <Text style={{ color: 'white', fontSize: 14, fontWeight: "500", }}>Submit Rating</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}



export default MyRating;

