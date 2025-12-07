import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Button, Icon, Spacer, Spinner } from '@/components/atoms';
import { Card, GlassCard, TextInput } from '@/components/molecules';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `¡Hola! 👋 Soy tu asistente de minería. Veo que tienes una granja de **450 TH/s** generando aproximadamente **$9.71/día**.

¿En qué puedo ayudarte hoy? Puedo analizar:
• Estrategias de reinversión
• Proyecciones de ganancias
• Impacto de cambios en dificultad o precio
• Optimización de tu configuración`,
    timestamp: new Date(),
  },
];

const quickQuestions = [
  '¿Cuándo recupero mi inversión?',
  '¿Mejor reinvertir o holdear?',
  '¿Qué pasa si BTC baja 20%?',
  '¿Debería aumentar mi hashrate?',
];

// ═══════════════════════════════════════════════════════════════════
// MESSAGE BUBBLE COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const { tokens } = useTheme();
  const isUser = message.role === 'user';

  return (
    <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
      {!isUser && (
        <View
          style={[
            styles.avatar,
            { backgroundColor: tokens.colors.brand.primaryMuted },
          ]}
        >
          <Icon name="sparkles" size={16} color="brand" />
        </View>
      )}

      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: isUser
              ? tokens.colors.brand.primary
              : tokens.colors.background.secondary,
            borderBottomRightRadius: isUser ? 4 : 16,
            borderBottomLeftRadius: isUser ? 16 : 4,
          },
        ]}
      >
        <Text
          variant="body"
          style={{ color: isUser ? '#FFFFFF' : tokens.colors.text.primary }}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// QUICK ACTIONS COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface QuickActionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

function QuickActions({ questions, onSelect }: QuickActionsProps) {
  const { tokens } = useTheme();

  return (
    <View style={styles.quickActions}>
      <Text variant="caption" color="muted" style={{ marginBottom: 8 }}>
        💡 Quick Questions
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.quickActionsRow}>
          {questions.map((question, index) => (
            <Pressable
              key={index}
              style={[
                styles.quickActionChip,
                {
                  backgroundColor: tokens.colors.background.tertiary,
                  borderColor: tokens.colors.border.default,
                },
              ]}
              onPress={() => onSelect(question)}
            >
              <Text variant="bodySmall">{question}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════

export default function AdvisorScreen() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response (will be replaced with real API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Excelente pregunta sobre "${messageText.substring(0, 30)}..."

Basándome en tu configuración actual:
• **Hashrate total**: 450 TH/s
• **Ganancia diaria**: $9.71
• **Eficiencia promedio**: 20 W/TH

**Mi análisis:**
Considerando las condiciones actuales del mercado y la dificultad de la red, tu configuración está bien optimizada.

¿Te gustaría que profundice en algún aspecto específico?`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: tokens.colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text variant="h3">AI Advisor</Text>
          <Text variant="caption" color="muted">
            Powered by Gemini
          </Text>
        </View>
        <View style={styles.contextBadge}>
          <Icon name="hardware-chip" size={14} color="brand" />
          <Text variant="caption" color="brand">
            450 TH/s
          </Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingBottom: 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <View style={styles.loadingRow}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: tokens.colors.brand.primaryMuted },
              ]}
            >
              <Spinner size="sm" color="brand" />
            </View>
            <Text variant="bodySmall" color="muted">
              Analyzing...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <QuickActions questions={quickQuestions} onSelect={handleSend} />
      )}

      {/* Input */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: tokens.colors.background.secondary,
            paddingBottom: insets.bottom + 8,
          },
        ]}
      >
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your mining strategy..."
            />
          </View>
          <Button
            variant="primary"
            size="md"
            disabled={!inputText.trim() || isLoading}
            onPress={() => handleSend()}
          >
            <Icon name="send" size={20} color="#FFFFFF" />
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(247, 147, 26, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 8,
    maxWidth: '85%',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    flex: 1,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  inputContainer: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
  },
});
