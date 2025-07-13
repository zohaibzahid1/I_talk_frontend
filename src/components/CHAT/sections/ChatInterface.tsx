"use client";
import React from 'react';
import { observer } from 'mobx-react-lite';
import ChatLayout from '../layouts/ChatLayout';
import ChatWindow from './ChatWindow';

const ChatInterface = observer(() => {
  return (
    <ChatLayout>
      <ChatWindow />
    </ChatLayout>
  );
});

export default ChatInterface;
