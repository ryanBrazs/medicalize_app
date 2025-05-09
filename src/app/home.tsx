import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/colors';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { CameraButton } from '@/components/cameraButton';
import {
  IconBolt,
  IconHelp,
  IconPhoto,
  IconSettings,
} from '@tabler/icons-react-native';
import { Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelpModal } from '@/components/modals/helpModal';
import { SearchModal } from '@/components/modals/searchModal/index';
import { PhotoModal } from '@/components/modals/photoModal/index';

import * as ImagePicker from 'expo-image-picker';
import { processImage } from '@/utils/imageProcessing';

export default function Home() {
  const cameraRef = useRef<Camera>(null); // Create a reference to the Camera component for controlling camera actions
  const device = useCameraDevice('back'); // Get the back camera device using the useCameraDevice hook
  const [flash, setFlash] = useState<'on' | 'off'>('off'); // Defines a state variable 'flash' to control the camera's torch (flash) mode, with 'on' or 'off' as possible values, initialized to 'off'
  const [isHelpModalVisible, setHelpModalVisible] = useState(false); // Declare a state variable `isHelpModalVisible` to control the visibility of the Help Model
  const [isSearchModalVisible, setSearchModalVisible] = useState(false); // Declare a state variable `isSerchModalVisible` to control the visibility of the Search Model
  const [isPhotoModalVisible, setPhotoModalVisible] = useState(false); // Declare a state variable `isPhotoModalVisible` to control the visibility of the Photo Model
  const [isStatusBarVisible, setStatusBarVisible] = useState(true); // Define a state variable `isStatusBarVisible` to control the visibility of the device's status bar
  const [searchValue, setSearchValue] = useState(''); // State to manage search input value
  const [photoUri, setPhotoUri] = useState<string | null>(null); // State to hold the URI of the selected image or null if no image is selected
  const [isCameraActive, setIsCameraActive] = useState(true); // State to track whether the camera is active

  // Function to select an image from the device gallery
  const pickImage = async () => {
    try {
      // Launch the image picker library to select an image from the device's gallery
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Restrict selection to images only
        allowsEditing: false, // Disable editing features in the image picker
        aspect: [4, 3], // Set the aspect ratio for the selected image
        quality: 1, // Set the quality of the image to maximum (1)
      });

      // Check if the user did not cancel the picker and if an image was successfully selected
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri; // Get the URI of the selected image
        setPhotoUri(imageUri); // Store the image URI in state for preview
        setPhotoModalVisible(true); // Open the modal to display the selected image
      }
    } catch (error) {
      console.error('Erro ao carregar imagem:', error);
    }
  };

  // Function to capture a photo using the camera
  const takePhoto = async () => {
    // Check if camera reference exists
    if (cameraRef.current) {
      try {
        // Capture photo with specified options
        const photo = await cameraRef.current.takePhoto({
          flash: 'off', // Flash setting: 'on', 'off', or 'auto'
        });
        // Construct file URI from photo path as per documentation
        const uri = `file://${photo.path}`;
        // Store the image URI in state for preview
        setPhotoUri(uri);
        // Open modal to display the selected image
        setPhotoModalVisible(true);
      } catch (error) {
        // Log any errors that occur during photo capture
        console.error('Error taking photo:', error);
      }
    }
  };

  // function to toggle the flash between "on" and "off"
  function toggleFlash() {
    setFlash((prevFlash) => (prevFlash === 'on' ? 'off' : 'on'));
  }

  // useEffect hook to handle side effects based on changes to isHelpModalVisible
  useEffect(() => {
    // Status bar visible only when both modals are closed
    setStatusBarVisible(
      !isHelpModalVisible && !isSearchModalVisible && !isPhotoModalVisible
    );

    // Flash and Camera disabled if any modal is open
    if (isHelpModalVisible || isSearchModalVisible || isPhotoModalVisible) {
      setFlash('off');
      setIsCameraActive(false);
    } else {
      setIsCameraActive(true);
    }
  }, [isHelpModalVisible, isSearchModalVisible, isPhotoModalVisible]);

  const DATA = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
    { id: '4', title: 'Item 4' },
    { id: '5', title: 'Item 5' },
    { id: '6', title: 'Item 6' },
    { id: '7', title: 'Item 7' },
    { id: '8', title: 'Item 8' },
    { id: '9', title: 'Item 9' },
    { id: '10', title: 'Item 10' },
    { id: '11', title: 'Item 11' },
    { id: '12', title: 'Item 12' },
    { id: '13', title: 'Item 13' },
    { id: '14', title: 'Item 14' },
    { id: '15', title: 'Item 15' },
    { id: '16', title: 'Item 16' },
    { id: '17', title: 'Item 17' },
    { id: '18', title: 'Item 18' },
    { id: '19', title: 'Item 19' },
    { id: '20', title: 'Item 20' },
  ];

  return (
    <>
      {/* Hides the status bar to maximize space on the camera screen when no modal is open */}
      <StatusBar hidden={isStatusBarVisible} />
      {/* Render the camera only if the back device is available */}
      {device && (
        <Camera
          photo={true} // Enable photo capture
          style={StyleSheet.absoluteFill} // Fill the entire screen with absolute positioning
          ref={cameraRef} // Assign the reference for camera control
          device={device} // Use the back camera device
          isActive={isCameraActive} // Keep the camera active
          torch={flash} // Enable torch (flash) by default
          resizeMode="cover" // Adjust camera image to cover the screen
        />
      )}

      {/* Safe area for the top bar, respecting device notches and edges */}
      <SafeAreaView style={s.topBarSafeArea} edges={['top', 'left', 'right']}>
        <View style={s.topBar}>
          {/* Flash toggle button */}
          <CameraButton onPress={toggleFlash}>
            <CameraButton.Icon
              icon={IconBolt}
              color={flash == 'on' ? colors.green.base : colors.white}
              size={24}
            />
          </CameraButton>

          {/* Container for help and settings buttons */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {/* Help button */}
            <CameraButton onPress={() => setHelpModalVisible(true)}>
              <CameraButton.Icon
                icon={IconHelp}
                color={colors.white}
                size={24}
              />
            </CameraButton>

            {/* Settings button */}
            <CameraButton>
              <CameraButton.Icon
                icon={IconSettings}
                color={colors.white}
                size={24}
              />
            </CameraButton>
          </View>
        </View>
      </SafeAreaView>

      {/* Safe area for the bottom bar, respecting device bottom edges */}
      <SafeAreaView
        style={s.bottomBarSafeArea}
        edges={['bottom', 'left', 'right']}
      >
        {/* Bottom bar with camera controls */}
        <View style={s.bottomBar}>
          {/* Photo library button */}
          <CameraButton onPress={() => processImage('pick', setPhotoUri, setPhotoModalVisible)}>
            <CameraButton.Icon
              icon={IconPhoto}
              color={colors.white}
              size={28}
            />
          </CameraButton>

          {/* Photo capture button */}
          <TouchableOpacity style={s.photoCaptureButton} onPress={() => processImage('take', setPhotoUri, setPhotoModalVisible, cameraRef)}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 100,
                backgroundColor: colors.white,
              }}
            />
          </TouchableOpacity>

          {/* Search button */}
          <CameraButton
            style={s.searchButton}
            onPress={() => setSearchModalVisible(true)}
          >
            <CameraButton.Icon icon={Search} color={colors.white} size={24} />
          </CameraButton>
        </View>
      </SafeAreaView>

      <HelpModal
        visible={isHelpModalVisible}
        onClose={() => setHelpModalVisible(false)}
      />

      <SearchModal
        visible={isSearchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        value={searchValue}
        onChangeText={(searchValue) => setSearchValue(searchValue)}
        data={DATA}
      />

      <PhotoModal
        visible={isPhotoModalVisible}
        onClose={() => setPhotoModalVisible(false)}
        photoUri={photoUri!}
      />
    </>
  );
}

const s = StyleSheet.create({
  topBarSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topBar: {
    paddingHorizontal: 24,
    paddingVertical: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomBarSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBar: {
    paddingHorizontal: 16,
    height: 125,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  photoCaptureButton: {
    width: 74,
    height: 74,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  searchButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
