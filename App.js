/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView } from 'react-native';

import BottomTabNavigation from "./navigation/BottomTabNavigation";
import {NavigationContainer} from "@react-navigation/native";

const App: () => Node = () => {

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <NavigationContainer>
        <BottomTabNavigation/>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
