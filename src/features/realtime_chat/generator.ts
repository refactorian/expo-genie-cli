import { fileSystem } from '../../utils/fs';
import path from 'path';

export const realtimeChatGenerator = {
  async generateChatStore(projectPath: string): Promise<void> {
    const chatStore = `import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface ChatState {
  socket: Socket | null;
  messages: Message[];
  connected: boolean;
  connect: (userId: string) => void;
  disconnect: () => void;
  sendMessage: (receiverId: string, content: string) => void;
  markAsRead: (messageId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  messages: [],
  connected: false,

  connect: (userId: string) => {
    const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL || 'ws://localhost:3000', {
      auth: { userId },
    });

    socket.on('connect', () => {
      set({ connected: true });
    });

    socket.on('disconnect', () => {
      set({ connected: false });
    });

    socket.on('message', (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, connected: false });
    }
  },

  sendMessage: (receiverId: string, content: string) => {
    const { socket } = get();
    if (socket && socket.connected) {
      const message: Partial<Message> = {
        receiverId,
        content,
        timestamp: new Date(),
      };
      socket.emit('send_message', message);
    }
  },

  markAsRead: (messageId: string) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('mark_read', messageId);
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === messageId ? { ...m, read: true } : m
        ),
      }));
    }
  },
}));
`;

    const storePath = path.join(projectPath, 'src/store');
    await fileSystem.createDirectory(storePath);
    await fileSystem.writeFile(path.join(storePath, 'chatStore.ts'), chatStore);
  },

  async generateChatScreen(projectPath: string): Promise<void> {
    const chatScreen = `import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useChatStore } from '../../../store/chatStore';

interface Props {
  userId: string;
  receiverId: string;
}

export default function ChatScreen({ userId, receiverId }: Props) {
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { messages, connected, connect, disconnect, sendMessage } = useChatStore();

  useEffect(() => {
    connect(userId);
    return () => disconnect();
  }, [userId]);

  const handleSend = () => {
    if (input.trim() && connected) {
      sendMessage(receiverId, input.trim());
      setInput('');
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      (m.senderId === userId && m.receiverId === receiverId) ||
      (m.senderId === receiverId && m.receiverId === userId)
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: connected ? '#4CAF50' : '#f44336' },
          ]}
        />
        <Text style={styles.headerText}>
          {connected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.senderId === userId ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.senderId === userId && styles.sentMessageText,
              ]}
            >
              {item.content}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !connected && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!connected}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  sentMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
`;

    const screensPath = path.join(projectPath, 'src/features/realtime-chat/screens');
    await fileSystem.createDirectory(screensPath);
    await fileSystem.writeFile(path.join(screensPath, 'ChatScreen.tsx'), chatScreen);
  },
};