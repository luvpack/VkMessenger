/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import "./i18n"
import "./utils/ignore-warnings"
import React, {useEffect, useLayoutEffect, useState} from "react"
import {
  SafeAreaProvider,
} from "react-native-safe-area-context"
import { initFonts } from "./theme/fonts" // expo
import { useBackButtonHandler, AppNavigator, canExit } from "./navigators"
import VKLogin from 'react-native-vkontakte-login'
import {Provider, useSelector} from 'react-redux'
import {Api} from "./services/api/api";
import {RootState, store} from "./models";
import {startLongPoll, stopLongPoll} from "./services/LongPoll/background";
import BackgroundService from "react-native-background-actions";
import VK from "react-native-vkontakte-login";

import {PersistGate} from 'redux-persist/lib/integration/react'

import {getPersistor} from "@rematch/persist";
import {Text, View} from "react-native";

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

const setupServices = async () => {
  // API setting up
  const api = new Api()
  await api.setup()
}

setupServices()

/**
 * This is the root component of our app.
 */



function App() {
  useBackButtonHandler(canExit)
  /*
  * const {
    initialNavigationState,
    onNavigationStateChange,
    //isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)
  * */

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    VKLogin.initialize(2685278)

    ;(async () => {
      await initFonts() // expo
      // setupRootStore().then(setRootStore)
    })()
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
 //  if (!rootStore || !isNavigationStateRestored) return null

  // otherwise, we're ready to render the app

  return (
          <Provider store={store}>
            <SafeAreaProvider initialMetrics={null}>
                <AppNavigator
                    //initialState={initialNavigationState}
                    //onStateChange={onNavigationStateChange}
                />
            </SafeAreaProvider>
          </Provider>
  )
}

export default () => {
  return <App />
}
