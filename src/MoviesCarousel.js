// Externals
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, BackHandler } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { observer } from 'mobx-react/native'
import Star from 'react-native-star-view';

// Components
import MovieDetail from './MovieDetail'
import Assistant from './Assistant'
import VoiceRecorder from './VoiceRecorder'

// Stores
import VideoStore from './stores/Videos'

@observer
export default class MoviesCarousel extends Component {

  state = {
    currentItem: null,
    entries: []
  }

  async componentDidMount() {
    const { store } = this.props
    await store.setGlobalSearch()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
  }
  
  render () {
    const { currentItem, detail, entries } = this.state
    const { store } = this.props
  
    if (currentItem && detail) {
      return <MovieDetail item={currentItem} />
    }

    return (
      <View>
        <Assistant store={VideoStore} voiceRecorder={VoiceRecorder}/>
        <Carousel
          ref={(c) => { this._carousel = c }}
          data={store.globalSearch ? store.globalSearch : entries}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={1000}
          itemWidth={250}
          contentContainerCustomStyle={{backgroundColor: '#000'}}
          containerCustomStyle={{backgroundColor:'#000'}}
          slideStyle={{backgroundColor:'#454545', borderRadius: 5}}
          enableSnap
          inactiveSlideOpacity={0.4}
          onSnapToItem={(index) => this.setState({ activeSlide: index }) }
        />
      </View>
    )
  }
  /* Methods */
  _renderItem ({ item, index }) {
    if (!item) return null

    const starStyle = {
      width: 100,
      height: 20,
      marginBottom: 20,
    }

    return ( 
      <TouchableOpacity key={index} onPress={() => { this.setState({ detail: true, currentItem: item}) }}>
        <View style={styles.slide}>
          <Image source={{uri: item.coverUrlLandscape}} style={styles.cover} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.summaryShort}</Text>
          <View style={styles.moreInfo}>
            <Text style={{color: '#009dcc', paddingBottom: 5}}>
              Genres&nbsp;:&nbsp;
              <Text style={{color: '#777', paddingLeft: 5}}>{item.genres}</Text>
            </Text>
            <View style={{flex: 1, flexDirection:'row', justifyContent: 'flex-start', alignItems:'flex-start', paddingBottom: 20}}>
              <Text style={{color: '#009dcc'}}>
                Note&nbsp;:&nbsp;
              </Text>
              {item.publicRating && item.publicRating > 0
              ? <Star score={item.publicRating.toFixed(2)} style={starStyle} />
              : null}
            </View>
          </View>
        </View>
      </TouchableOpacity> 
    )
  }

  /* Events */
  onChildChanged (newStates) {
    this.setState(newStates)
  }

  /* Helpers */
  handleBackPress = () => {
    const { detail } = this.state
    if (detail) {
      this.setState({ detail: false })
    }
    return true
  }
}


const styles = StyleSheet.create({
  slide: {
    textAlign: 'center',
    padding: 0,
    borderRadius: 5,
    overflow: 'hidden',
    flexGrow: 1,
    flexShrink: 0,

  },
  cover: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  title: {
    color: '#009dcc',
    fontSize: 20,
    padding: 10
  },
  description: {
    fontSize: 15,
    color: '#fff',
    padding: 10,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#333',
  },
  moreInfo: {
    padding: 10,
  },
  tags: {
    color: '#fff',
    fontSize: 12
  },
  subTitle: {
    color: '#009dcc'
  }
})

