import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from "./styles";
import { Context as AuthContext } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

const Form = () => {

    const {state, signIn} = useContext(AuthContext);
    const [name, setName] = useState("");
    const [property, setProperty] = useState("");
    const [room, setRoomNo] = useState("");
    const [isLoading, setLoader] = useState(false);

    return (
        <View>
            <Spinner
          visible={isLoading}
          textContent={''}
          textStyle={{color: '#FFF'}}
        />
            <View style={styles.headingViewStyle}>
                <Text style={styles.headingTextStyle}>Login</Text>
            </View>

            <View style={styles.fieldViewStyleLogin}>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="Name"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={name}
                    onChangeText={(newValue) => { setName(newValue) }}
                />
            </View>

            <View style={styles.fieldViewStyleLogin}>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="Property"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={property}
                    onChangeText={(newValue) => { setProperty(newValue) }}
                />
            </View>

            <View style={styles.fieldViewLowerStyle}>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="Room #"
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    value={room}
                    onChangeText={(newValue) => { setRoomNo(newValue) }}
                />
            </View>
            <View>
                <TouchableOpacity>
                    <Text style={styles.problemText}>Having Problems ?</Text>
                    {state.errorMessage ? <Text style={{fontSize: 16, color: "red", alignSelf: "center", marginBottom: 5}}>{state.errorMessage}</Text> : null }
                </TouchableOpacity >
            </View>

            <View>
            </View>
            <View>
                <TouchableOpacity style={styles.regBtn} onPress={() => {setLoader(true);signIn({name, property, room, setLoader})}}>
                    <Text style={{ color: "#fff", fontWeight: "900", fontSize: 22, alignSelf: "center", textAlign: "center", marginTop: 10 }}>GO</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};


export default Form;