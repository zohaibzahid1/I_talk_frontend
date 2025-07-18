"use client";
import { observer } from 'mobx-react-lite';

import ChatInterface from '@/components/CHAT/sections/ChatInterface';

const ChatPage = observer(() => {
  return (
    <div className="h-screen">
      <ChatInterface />
    </div>
  );
});

export default ChatPage;
