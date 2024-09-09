import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RootState } from '../redux/store';
import { sendMessage, joinRoom, deleteMessage, Message, ChatRoom } from '../redux/chatReducer';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const Chat: React.FC = () => {
  const [messageContent, setMessageContent] = useState('');
  const [currentUser, setCurrentUser] = useState('User1');
  const dispatch = useDispatch();
  const currentRoom = useSelector((state: RootState) => state.chat.currentRoom);

  // Load messages from localStorage on page load
  useEffect(() => {
    const savedRoom = localStorage.getItem('chatRoom');
    if (savedRoom) {
      const parsedRoom: ChatRoom = JSON.parse(savedRoom);

      // Convert timestamps back to Date objects
      parsedRoom.messages = parsedRoom.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));

      dispatch(joinRoom(parsedRoom));
    }
  }, [dispatch]);

  // Save messages to localStorage whenever the messages change
  useEffect(() => {
    if (currentRoom) {
      localStorage.setItem('chatRoom', JSON.stringify(currentRoom));
    }
  }, [currentRoom]);

  const handleSendMessage = () => {
    if (messageContent && currentRoom) {
      const message: Message = {
        id: new Date().toISOString(),
        user: currentUser,
        content: messageContent,
        timestamp: new Date(),
        roomName: currentRoom.roomName,
      };
      dispatch(sendMessage(message));
      setMessageContent('');
    }
  };

  const handleDeleteMessage = (id: string) => {
    dispatch(deleteMessage(id));
  };

  const handleJoinRoom = (roomName: string) => {
    const room: ChatRoom = { roomName, messages: [] };
    dispatch(joinRoom(room));
  };

  const switchUser = () => {
    setCurrentUser(currentUser === 'User1' ? 'User2' : 'User1');
  };

  return (
    <section className="bg-zinc-500 min-h-screen">
    <div className="container mx-auto py-10">
      <Link to='/' className="text-white/60 font-medium text-center">Todo list</Link>
      <h1 className="text-center mb-10 text-4xl font-bold text-white">Chat Application</h1>

      {currentRoom ? (
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Room: {currentRoom.roomName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {currentRoom.messages.map((msg) => {
              const timestamp = new Date(msg.timestamp);
              return (
                <div
                  key={msg.id}
                  className={`flex ${msg.user === currentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs relative ${
                      msg.user === currentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                  >
                    <strong>{msg.user}</strong>: {msg.content}
                    <div className="text-xs text-gray-500">
                      {timestamp.toLocaleTimeString()} {/* Use the converted Date object */}
                    </div>
                    <Button
                      className="absolute top-0 right-0 p-1"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMessage(msg.id)}
                    >
                      🗑
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="flex space-x-4">
            <Input
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow"
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </CardFooter>
          <div className="text-center mt-4">
            <Button variant="secondary" onClick={switchUser}>
              Switch to {currentUser === 'User1' ? 'User2' : 'User1'}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-4">
            <Button onClick={() => handleJoinRoom('General')} className="mt-4 w-full">
              Join General Room
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
    </section>
  );
};

export default Chat;
