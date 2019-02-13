/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
// import 'es6-symbol/implement'
import React, {Component} from 'react'
import 'react-native'

// Components
import Layout from './src/Layout'

export default class App extends Component {
  render () {
    console.disableYellowBox = true
    return (
      <Layout />
    )
  }
}

