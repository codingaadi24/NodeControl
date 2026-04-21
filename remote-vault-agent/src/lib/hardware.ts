import * as Device from 'expo-device';
import * as Battery from 'expo-battery';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const getHardwareId = async () => {
  try {
    let id = await AsyncStorage.getItem('device_id');
    if (!id) {
      id = uuidv4();
      await AsyncStorage.setItem('device_id', id);
    }
    return id;
  } catch (e) {
    return 'unknown-device-' + Math.random().toString(36).substring(7);
  }
};

export const getSystemInfo = async () => {
  const batteryLevel = await Battery.getBatteryLevelAsync();
  const batteryState = await Battery.getBatteryStateAsync();
  
  return {
    deviceName: Device.deviceName || 'Unknown Device',
    model: Device.modelName,
    brand: Device.brand,
    os: Device.osName,
    osVersion: Device.osVersion,
    battery: {
      level: Math.floor(batteryLevel * 100),
      isCharging: batteryState === Battery.BatteryState.CHARGING || batteryState === Battery.BatteryState.FULL
    },
    type: Device.deviceType === Device.DeviceType.PHONE ? 'MOBILE' : 'DESKTOP'
  };
};
