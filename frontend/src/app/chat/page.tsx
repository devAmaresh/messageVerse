"use client";
import React, { useState } from "react";
import ChatApp from "@/components/Chat";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import backend_url from "@/utils/backend";

type User = {
  _id: string; // The unique identifier of the user
  name: string; // The name of the user
  email: string; // The email of the user (optional, based on your needs)
};

const Page = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const handleSelectUser = (user: User) => {
    const postChat = async () => {
      try {
        const res = await axios.post(
          `${backend_url}/api/chats`,
          {
            recipientId: user._id,
            isGroupChat: false,
          },
          {
            withCredentials: true,
          }
        );
        if (res.status === 200 || res.status === 201) {
          setSelectedUser(user);
          setChatId(res.data.chat._id);
          setCurrentUserId(res.data.issuedBy);
        }
      } catch (error) {
        console.error(error);
      }
    };
    postChat();
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar onSelectUser={handleSelectUser} selectedUser={selectedUser} />
      <div className="w-full px-5 ">
        {selectedUser && (
          <ChatApp chatId={chatId} currentUserId={currentUserId} />
        )}
        {!selectedUser && (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-500">
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
