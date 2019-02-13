import React, {Component} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import Star from 'react-native-star-view'

export default class MovieDetail extends Component {

  render() {
    const { item , callbackParent } = this.props
    const starStyle = {
      width: 100,
      height: 20,
      marginBottom: 20,
    }

    return (
      <View style={styles.mainView}>
        <TouchableOpacity onPress={() => callbackParent({ detail: false })}>
          <Text style={{color: '#777', paddingBottom: 10}}>Retour</Text>
        </TouchableOpacity>
        <View style={{flex: 1, flexDirection:'row', justifyContent: 'space-between', padding:20, alignItems:'flex-start'}}>
          <Image source={{uri: item.coverUrlPortrait}}
            style={{width: 400, height: 400, resizeMode: 'contain'}} />
          <View style={{width: '50%', paddingRight: 20}}>
            <Text style={{color: '#009dcc', fontSize: 20}}>{item.title}</Text>
            <Text style={{color: '#fff', marginTop: 10}}>{item.summaryLong}</Text>
            <View style={{flex: 0, marginTop: 10}}>
              <Text style={{color: '#009dcc', paddingBottom: 5}}>
                Année&nbsp;:&nbsp; 
                <Text style={{color: '#777'}}>{item.year}</Text>
              </Text>
              <Text style={{color: '#009dcc', paddingBottom: 5}}>
                Acteurs&nbsp;:&nbsp;
                <Text style={{color: '#777', paddingLeft: 5}}>{item.actors}</Text>
              </Text>
              <Text style={{color: '#009dcc', paddingBottom: 5}}>
                Langues&nbsp;:&nbsp;
                <Text style={{color: '#777', paddingLeft: 5}}>{item.languages}</Text>
              </Text>
              <View style={{flex: 1, flexDirection:'row', justifyContent: 'flex-start', alignItems:'flex-start'}}>
                <Text style={{color: '#009dcc', paddingBottom: 5}}>
                  Note&nbsp;:&nbsp;
                </Text>
                <Star score={item.publicRating.toFixed(2)} style={starStyle} />
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    textAlign: 'center',
    backgroundColor: '#000',
    padding: 20,
    minHeight: '100%'
  }
});
