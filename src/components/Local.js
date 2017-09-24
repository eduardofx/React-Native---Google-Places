import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button,
  Geolocation,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
} from 'react-native';
import axios from 'axios';

const G_KEY = "AIzaSyDIqtGD3sHEOhN2VvZaa4j0Kwhz6qUVFUY";  
const styles = require('./Style'); 

class Local extends Component {

  state = {
    pause: false,
    latitude: null,
    longitude: null,
    list: null,
    erro: null
  }

  componentDidMount = () => {
    const config = { enableHighAccuracy: false };
    navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError, config);
  }

  locationSuccess = (position) => {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }
 

  openItem = (value) => {             
    const url = 'https://www.google.com.br/search?q='+value; 
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
          Linking.openURL(url);
      } else {
          console.log('Não foi possível abrir: ' + url);
      }
      return false
    });
  }


  render() {
    const { latitude, longitude } = this.state;

    if (latitude && longitude) {
      return (
        <View>
          {this.searchInput()}
          <ScrollView automaticallyAdjustContentInsets={false}>
            {this.result()}
          </ScrollView>
        </View>
      );
    }

    return (
      <View>
        <Text></Text>
      </View>
    )
  }

  searchInput = () => {
    return (
      <View>
        <View style={{paddingLeft: 10, paddingRight: 10}}>
          <TextInput  
          placeholder="Digite Oque Deseja Procurar.."
          onChangeText={(text) => this.setState({text})}
            value={this.state.find}
            onChangeText={this.onChangefind}
          />
        </View>
        <View style={{paddingLeft: 10, paddingRight: 10}}>
          <Button  title="Pesquisar"
            onPress={this.onSearch}
          />
        </View> 
      </View>
    );
  }

  onSearch = () => {
    const { latitude, longitude, find } = this.state;
    this.setState({ pause: true });
    let list = null;
    let erro = '';

    axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + find + '&location=' + latitude + ',' + longitude + '&key=' + G_KEY)
      .then((response) => {
        list = response.data.results
      })
      .catch((err) => {
        alert(JSON.stringify(err))
      })
      .finally(() => {
        this.setState({
          pause: false,
          list: list,
          erro: erro
        });
      });
  }

  onChangefind = (find) => {
    this.setState({ find })
  }

  result = () => {
    if (this.state.pause) {
      return (
        <ActivityIndicator />
      );
    }
    
    let content;
    if (this.state.list) {
      content = this.state.list.map((item, index) => {
          return (
            <View key={index} style={styles.itens}>
              <TouchableOpacity onPress={() => this.openItem(item.name)}> 
                <View style={styles.picture} >
                {item.photos ? <Image style={styles.local} source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photoreference=' + item.photos[0].photo_reference + '&key=AIzaSyAFZaPFaF6JFd0KPN98QhP1YC85avJxOoo'}} /> : null}
                </View>
                <View>
                <Text>{item.name}</Text>
                <Text>{item.formatted_address}</Text>
              </View>          
              </TouchableOpacity>    
            </View>           
          );
      });
    }
    return ( <View>
        {content}
      </View>
    )
  } 
}

export default Local;
