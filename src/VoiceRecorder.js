// Externals
import React, { Component } from 'react'
import { get } from 'lodash'
import Voice from 'react-native-voice'

// Stores
import VideoStore from './stores/Videos'

class VoiceRecorder extends Component {
  state = {
    recognized: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
  }

  constructor(props) {
    super(props)
    Voice.onSpeechStart = this.onSpeechStart
    Voice.onSpeechRecognized = this.onSpeechRecognized
    Voice.onSpeechEnd = this.onSpeechEnd
    Voice.onSpeechError = this.onSpeechError
    Voice.onSpeechResults = this.onSpeechResults
    Voice.onSpeechPartialResults = this.onSpeechPartialResults
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners)
  }

  onSpeechStart = e => {
    console.log('onSpeechStart: ', e)
  }

  onSpeechRecognized = e => {
    console.log('onSpeechRecognized: ', e)
  }

  onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e)
    VideoStore.setVoiceState(false)
  }

  onSpeechError = e => {
    console.log('onSpeechError: ', e)
  }

  onSpeechResults = e => {
    console.log('onSpeechResults: ', e)
    if (get(e, 'value[0]')) VideoStore.setSearch(get(e, 'value[0]'))
  }

  onSpeechPartialResults = e => {
    console.log('onSpeechPartialResults: ', e)
  }

  onSpeechVolumeChanged = e => {
    console.log('onSpeechVolumeChanged: ', e)
  }

  _startRecognizing = async () => {
    console.log('_startRecognizing')

    try {
      await Voice.start('fr-FR')
      VideoStore.setVoiceState(true)
    } catch (e) {
      Alert.alert(JSON.stringify(e))
      console.log(e)
    }
  }

  _stopRecognizing = async () => {
    try {
      await Voice.stop()
    } catch (e) {
      console.error(e)
    }
  }

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel()
    } catch (e) {
      Alert.alert(JSON.stringify(e))
      console.error(e)
    }
  }

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy()
    } catch (e) {
      Alert.alert(JSON.stringify(e))
      console.error(e)
    }
  }

  changeColor = () => {
    this.setState({
        color: 'yellow'
    })
  }
}

const VoiceRecorderInstance = new VoiceRecorder()
export default VoiceRecorderInstance