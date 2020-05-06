/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import {
  Header,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import PushNotification from 'react-native-push-notification';
import PubNub from 'pubnub';
import {publishKey, senderID, subscribeKey} from './pubnubKeys.json';

const userId = 'Client-nqm1v';
const channelId = 'notifications';

const pubnub = new PubNub({
  publishKey,
  subscribeKey,
  logVerbosity: true,
  uuid: userId,
});

PushNotification.configure({
  onRegister: token => {
    console.log('TOKEN:', token);
    if (token.os == 'ios') {
      pubnub.push.addChannels({
        channels: [channelId],
        device: token.token,
        pushGateway: 'apns',
      });
    } else if (token.os == 'android') {
      pubnub.push.addChannels({
        channels: [channelId],
        device: token.token,
        pushGateway: 'gcm',
      });
    }
  },
  onNotification: notification => {
    // if (Platform.OS === 'ios') {
    //   notification.finish(PushNotificationIOS.FetchResult.NoData);
    // }
    pubnub.signal(
      {
        message: 'opened',
        channel: channelId,
      },
      (status, error) => {
        console.log(status);
        console.log(error);
      },
    );
    console.log(notification);
  },
  senderID,
  popInitialNotification: true,
  requestPermissions: true,
});

const App: () => React$Node = () => {
  const handleButtonPress = () => {
    console.log('apasa');
    PushNotification.localNotification({
      autoCancel: true,
      bigText:
        'This is local notification demo in React Native app. Only shown, when expanded.',
      subText: 'Local Notification Demo',
      title: 'Local Notification Title',
      message: 'Expand me to see more',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      actions: '["Yes", "No"]',
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>PUB NUB</Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Button
                title={'Local Push Notification'}
                onPress={handleButtonPress}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
