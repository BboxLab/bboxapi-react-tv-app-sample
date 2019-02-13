import React, { Component } from 'react'
import { Alert, Button, Text, Image, View, TouchableOpacity } from 'react-native'
import { observer } from 'mobx-react/native'
import Tts from 'react-native-tts'

var TVEventHandler = require('TVEventHandler');

@observer
export default class Assistant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }

  WELCOME_VALUE = 'Bonjour, je suis Bobbyn, votre assistant video'

  _tvEventHandler

  _enableTVEventHandler() {
    this._tvEventHandler = new TVEventHandler();
    this._tvEventHandler.enable(this, (cmp, evt) => {
      if (evt.eventType === 'up') {
        cmp.props.voiceRecorder._startRecognizing()
        cmp.setState({ active: true })
      }
    });
  }

  _disableTVEventHandler() {
    if (this._tvEventHandler) {
      this._tvEventHandler.disable();
      delete this._tvEventHandler;
    }
  }

  async componentDidMount() {
    const { store } = this.props
    this._enableTVEventHandler();
    await store.configurateDialogFlow()
    Tts.setDefaultLanguage('fr_FR')
    this.speech('Bonjour, je suis Bobine, votre assistant pour la VOD')
  }

  componentWillUnmount() {
    this._disableTVEventHandler();
  }

  render() {
    const { store } = this.props
    const microIcon = store.voiceState
      ? require('./assets/micro-active.png')
      : require('./assets/micro.png')

    if (store.botResponse && store.botResponse !== this.WELCOME_VALUE) {
      this.speech(JSON.stringify(store.botResponse))
    }
    return (
      <TouchableOpacity>
        <View style={{flex: 1, flexDirection:'row', justifyContent: 'flex-start', alignItems: 'center', padding:20, marginBottom: 60}}>
          <Image source={microIcon} style={{width: 40, height: 40}}/>
          {store.botResponse
            ? <Text style={{color: '#009dcc', fontSize: 20, marginLeft: 20}}>{store.botResponse}</Text>
            : <Text style={{color: '#009dcc', fontSize: 20, marginLeft: 20}}>{this.WELCOME_VALUE}</Text>
          }
        </View>
      </TouchableOpacity>
    )
  }

  onReceiveMessage = text => {
    Alert.alert(text)
  }

  speech = text => {
    Tts.speak(text)
  }
}
