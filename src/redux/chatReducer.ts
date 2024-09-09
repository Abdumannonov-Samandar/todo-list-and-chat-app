import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Message and Room Types
export interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  roomName: string; // Ensure this is part of the Message interface
}

export interface ChatRoom {
  roomName: string;
  messages: Message[];
}

// Initial State
interface ChatState {
  currentRoom: ChatRoom | null;
}

const initialState: ChatState = {
  currentRoom: null,
};

// Create Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    joinRoom: (state, action: PayloadAction<ChatRoom>) => {
      state.currentRoom = action.payload;
    },
    sendMessage: (state, action: PayloadAction<Message>) => {
      if (state.currentRoom && state.currentRoom.roomName === action.payload.roomName) {
        state.currentRoom.messages.push(action.payload);
      }
    },
    receiveMessage: (state, action: PayloadAction<Message>) => {
      if (state.currentRoom && state.currentRoom.roomName === action.payload.roomName) {
        state.currentRoom.messages.push(action.payload);
      }
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      if (state.currentRoom) {
        state.currentRoom.messages = state.currentRoom.messages.filter(message => message.id !== action.payload);
      } else {
        console.error('No current room found');
      }
    }
  },
});

// Export actions and reducer
export const { joinRoom, sendMessage, receiveMessage, deleteMessage } = chatSlice.actions;
export default chatSlice.reducer;
