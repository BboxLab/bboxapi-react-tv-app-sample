import React, { Component } from 'react'
import { StyleSheet, View} from 'react-native'

// Stores
import VideoStore from './stores/Videos'

// Components
import MoviesCarousel from './MoviesCarousel'
export default class App extends Component {  

  render() {
    return (
      <View style={styles.mainView}>
        <MoviesCarousel style={{flex: 0}} store={VideoStore}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    textAlign: 'center',
    backgroundColor: '#000',
    minHeight: '100%',
    padding: 20
  },
  movieTitle: {
    color: '#fff',
    opacity: 1,
    fontSize: 20
  },
  descriptionTitle: {
    color: 'orange',
    opacity: 1,
    fontSize: 15
  },
  descriptionContent: {
    color: '#fff',
    opacity: 1,
    fontSize: 15
  }
})
