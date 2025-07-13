"use client";
import { observer } from 'mobx-react-lite';
import { useStore } from '@/context/storeContext';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import ChatInterface from '@/components/CHAT/sections/ChatInterface';

const ChatPage = observer(() => {
  return (
    <ProtectedRoute>
      <div className="h-screen">
        <ChatInterface />
      </div>
    </ProtectedRoute>
  );
});

export default ChatPage;
