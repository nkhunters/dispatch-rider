import React from 'react';
import {
  createAppContainer
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import MapContainer from './src/screens/MapContainer';
import PlacesAutoComplete from './src/components/PlacesAutocomplete';
import SigninScreen from './src/screens/SigninScreen';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { setNavigator } from './src/navigationRef';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import ConfirmPickup from './src/screens/ConfirmPickup';
import EstimatePickup from './src/screens/EstimatePickup';
import Profile from './src/screens/Profile';
import TripHistory from './src/screens/TripHistory';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import Logout from './src/screens/Logout';
import MyRating from './src/screens/Ratings';

const navigator = createDrawerNavigator(
  {
    Home: {
      screen: createStackNavigator(
        {
          ResolveAuth: ResolveAuthScreen,
          MapContainer: MapContainer,
          PlacesAutoComplete: PlacesAutoComplete,
          SigninScreen: SigninScreen,
          ConfirmPickup: ConfirmPickup,
          EstimatePickup: EstimatePickup,
          Rating: MyRating
        },
        {
          initialRouteName: 'ResolveAuth',
          defaultNavigationOptions: {
            //title: 'App'
            header: null
          }
        }
      ),
      navigationOptions: {
        drawerLabel: 'Home',
        drawerIcon: ({ tintColor }) => (
          <AntDesign name='home' style={{ fontSize: 25 }} />
        ),
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        drawerLabel: 'Profile',
        drawerIcon: ({ tintColor }) => (
          <AntDesign name='user' style={{ fontSize: 25 }} />
        ),
      }
    },
    TripHistory: {
      screen: TripHistory,
      navigationOptions: {
        drawerLabel: 'Trip History',
        drawerIcon: ({ tintColor }) => (
          <MaterialIcons name='history' style={{ fontSize: 25 }} />
        ),
      }
    },
    Logout: {
      screen: Logout,
      navigationOptions: {
        drawerLabel: 'Logout',
        drawerIcon: ({ tintColor }) => (
          <AntDesign name='logout' style={{ fontSize: 25 }} />
        ),
      }
    }
  },
);

const App = createAppContainer(navigator);

export default () => {
  return <AuthProvider><App ref={(navigator) => { setNavigator(navigator) }} /></AuthProvider>
}

