/**
 * ImagePicker Component
 * Allows selecting and displaying an image for miners
 */

import React, { useState } from 'react';
import { View, Image, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { useTheme } from '@/theme';
import { Text, Icon, Spacer } from '@/components/atoms';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface ImagePickerProps {
  value?: string; // Image URI or base64
  onChange: (uri: string | undefined) => void;
  label?: string;
  size?: number;
  placeholder?: string;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function ImagePicker({
  value,
  onChange,
  label,
  size = 120,
  placeholder = 'Add Image',
}: ImagePickerProps) {
  const { tokens } = useTheme();
  const [hasError, setHasError] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant access to your photo library to select an image.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setHasError(false);
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handlePress = () => {
    if (value && !hasError) {
      // Show options: change or remove
      Alert.alert(
        'Image Options',
        'What would you like to do?',
        [
          { text: 'Change Image', onPress: pickImage },
          { text: 'Remove Image', onPress: () => onChange(undefined), style: 'destructive' },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      pickImage();
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <>
          <Text variant="caption" color="muted">{label}</Text>
          <Spacer size={2} />
        </>
      )}

      <Pressable
        style={[
          styles.imageContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 8,
            backgroundColor: tokens.colors.background.tertiary,
            borderColor: tokens.colors.border.default,
          },
        ]}
        onPress={handlePress}
      >
        {value && !hasError ? (
          <>
            <Image
              source={{ uri: value }}
              style={[
                styles.image,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 8,
                },
              ]}
              onError={() => setHasError(true)}
            />
            <View
              style={[
                styles.editBadge,
                { backgroundColor: tokens.colors.background.secondary },
              ]}
            >
              <Icon name="pencil" size={14} color="primary" />
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Icon name="camera-outline" size={32} color="muted" />
            <Spacer size={1} />
            <Text variant="caption" color="muted">{placeholder}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
