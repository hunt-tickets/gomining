import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer } from '@/components/atoms';
import { Card, TextInput } from '@/components/molecules';

// ═══════════════════════════════════════════════════════════════════
// EMOJI PICKER
// ═══════════════════════════════════════════════════════════════════

const avatarEmojis = ['⛏️', '💎', '🚀', '🦊', '🐻', '🦁', '🎯', '⚡', '🔥', '💰', '🏆', '👨‍💻'];

interface EmojiPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

function EmojiPicker({ selected, onSelect }: EmojiPickerProps) {
  const { tokens } = useTheme();

  return (
    <View style={styles.emojiGrid}>
      {avatarEmojis.map((emoji) => (
        <Pressable
          key={emoji}
          style={[
            styles.emojiItem,
            {
              backgroundColor:
                selected === emoji
                  ? tokens.colors.brand.primaryMuted
                  : tokens.colors.background.tertiary,
              borderColor:
                selected === emoji
                  ? tokens.colors.brand.primary
                  : 'transparent',
            },
          ]}
          onPress={() => onSelect(emoji)}
        >
          <Text style={{ fontSize: 24 }}>{emoji}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function ProfileScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const [avatar, setAvatar] = useState('⛏️');
  const [displayName, setDisplayName] = useState('CryptoMiner2024');
  const [email, setEmail] = useState('crypto@example.com');
  const [miningGoal, setMiningGoal] = useState('10000');

  const handleSave = () => {
    // TODO: Save to storage
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Icon name="chevron-back" size={20} color="primary" />}
          onPress={() => router.back()}
        >
          Back
        </Button>
        <Button variant="ghost" size="sm" onPress={handleSave}>
          Save
        </Button>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h2">Edit Profile</Text>
        <Text variant="body" color="muted">
          Personalize your mining experience
        </Text>

        <Spacer size={6} />

        {/* Avatar */}
        <Card padding="lg">
          <Text variant="label" color="muted">AVATAR</Text>
          <Spacer size={3} />

          <View style={styles.avatarPreview}>
            <View
              style={[
                styles.avatarLarge,
                { backgroundColor: tokens.colors.brand.primaryMuted },
              ]}
            >
              <Text style={{ fontSize: 48 }}>{avatar}</Text>
            </View>
          </View>

          <Spacer size={4} />
          <EmojiPicker selected={avatar} onSelect={setAvatar} />
        </Card>

        <Spacer size={4} />

        {/* Personal Info */}
        <Card padding="lg">
          <Text variant="label" color="muted">PERSONAL INFO</Text>
          <Spacer size={4} />

          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            label="Display Name"
            placeholder="Your name"
            leftIcon="person-outline"
          />

          <Spacer size={4} />

          <TextInput
            value={email}
            onChangeText={setEmail}
            label="Email (optional)"
            placeholder="your@email.com"
            leftIcon="mail-outline"
            keyboardType="email-address"
          />
        </Card>

        <Spacer size={4} />

        {/* Mining Goal */}
        <Card padding="lg">
          <Text variant="label" color="muted">MINING GOAL</Text>
          <Spacer size={2} />
          <Text variant="caption" color="muted">
            Set a yearly income goal to track your progress
          </Text>
          <Spacer size={4} />

          <TextInput
            value={miningGoal}
            onChangeText={setMiningGoal}
            label="Yearly Goal (USD)"
            placeholder="10000"
            leftIcon="trophy-outline"
            keyboardType="numeric"
          />
        </Card>

        <Spacer size={6} />

        <Button variant="primary" fullWidth onPress={handleSave}>
          Save Profile
        </Button>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  avatarPreview: {
    alignItems: 'center',
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  emojiItem: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
});
