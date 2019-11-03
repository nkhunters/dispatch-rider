import createDataContext from './createDataContext';
import DispatchApi from '../api/DispatchApi';
import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'add_error':
            return { ...state, errorMessage: action.payload };
        case 'signin':
            return { ...state, errorMessage: '', token: action.payload };
        case 'signout':
            return { ...state, errorMessage: '', token: null };
        default: return state;
    }
};


const signIn = (dispatch) => {
    return async ({ name, property, room, setLoader }) => {

        try {

            const response = await DispatchApi.post('/signin', { name, property, room });
            console.log("sigin token - "+response.data.token);
            await AsyncStorage.setItem('riderToken', response.data.token);
            await AsyncStorage.setItem('name', name);
            await AsyncStorage.setItem('property', property);
            await AsyncStorage.setItem('room', room);
            setLoader(false);
            dispatch({ type: 'signin', payload: response.data.token });
            navigate('MapContainer');
            console.log(response.data);

        }
        catch (err) {
            setLoader(false);
            dispatch({ type: 'add_error', payload: 'Something went wrong' });
        }
    };
}

const tryLocalSignin = dispatch => async () => {
    const token = await AsyncStorage.getItem('riderToken');
    if (token) {
        dispatch({ type: 'signin', payload: token });
        navigate('MapContainer');
    }
    else {
        navigate('SigninScreen');
    }
}

const signOut = (dispatch) => {
    return async () => {
        await AsyncStorage.removeItem('riderToken');
        dispatch({ type: 'signout' });
        navigate('SigninScreen');
    };
};

export const { Provider, Context } = createDataContext(authReducer, { signIn, signOut, tryLocalSignin }, { tokek: null, errorMessage: '' });