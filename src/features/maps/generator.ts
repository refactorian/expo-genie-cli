import { fileSystem } from '../../utils/fs';
import path from 'path';

export const mapsGenerator = {
  async generateMapScreen(projectPath: string, _provider: string): Promise<void> {
    void _provider;
    const mapScreen = `import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
          description="Current location"
        />
      </MapView>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
`;

    const screensPath = path.join(projectPath, 'src/features/maps/screens');
    await fileSystem.createDirectory(screensPath);
    await fileSystem.writeFile(path.join(screensPath, 'MapScreen.tsx'), mapScreen);
  },

  async generateLocationHook(projectPath: string): Promise<void> {
    const locationHook = `import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setLoading(false);
      } catch (error) {
        setErrorMsg('Error getting location');
        setLoading(false);
      }
    })();
  }, []);

  const refreshLocation = async () => {
    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLoading(false);
    } catch (error) {
      setErrorMsg('Error refreshing location');
      setLoading(false);
    }
  };

  return {
    location,
    errorMsg,
    loading,
    refreshLocation,
  };
}
`;

    const hooksPath = path.join(projectPath, 'src/hooks');
    await fileSystem.createDirectory(hooksPath);
    await fileSystem.writeFile(path.join(hooksPath, 'useLocation.ts'), locationHook);
  },
};