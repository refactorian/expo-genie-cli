import { fileSystem } from '../../utils/fs';
import path from 'path';

export const cameraGenerator = {
  async generateCameraScreen(projectPath: string): Promise<void> {
    const cameraScreen = `import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission || !mediaPermission) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!permission.granted || !mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need camera and media library permissions</Text>
        <TouchableOpacity style={styles.button} onPress={() => {
          requestPermission();
          requestMediaPermission();
        }}>
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      setPhoto(photo?.uri || null);
      
      if (photo) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
      }
    }
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)}>
            <Text style={styles.buttonText}>Take Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <View style={styles.button} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  button: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    minWidth: 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
  },
});
`;

    const screensPath = path.join(projectPath, 'src/features/camera/screens');
    await fileSystem.createDirectory(screensPath);
    await fileSystem.writeFile(path.join(screensPath, 'CameraScreen.tsx'), cameraScreen);
  },

  async generateCameraHook(projectPath: string): Promise<void> {
    const cameraHook = `import { useState } from 'react';
import { CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export function useCamera() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  const takePicture = async (cameraRef: React.RefObject<CameraView>) => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      
      if (result) {
        setPhoto(result.uri);
        await MediaLibrary.saveToLibraryAsync(result.uri);
        return result.uri;
      }
    }
    return null;
  };

  const toggleFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const reset = () => {
    setPhoto(null);
  };

  return {
    photo,
    facing,
    takePicture,
    toggleFacing,
    reset,
  };
}
`;

    const hooksPath = path.join(projectPath, 'src/hooks');
    await fileSystem.createDirectory(hooksPath);
    await fileSystem.writeFile(path.join(hooksPath, 'useCamera.ts'), cameraHook);
  },
};