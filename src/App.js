import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Local from './components/Local';

class App extends Component {
  render() {
    return (
      <View>
        <Local />
      </View>
    );
  }
}

AppRegistry.registerComponent('WebDevAlfaAvaliacao', () => App);
