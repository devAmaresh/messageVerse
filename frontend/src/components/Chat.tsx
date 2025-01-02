"use client";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import backend_url from "@/utils/backend";
import { message as AntdMessage } from "antd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import "./Chat.css";
import { Spin } from "antd";
type ChatMessage = {
  _id: string;
  sender: User;
  content: string;
  chat: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function ChatApp({
  chatId,
  currentUserId,
}: {
  chatId: string | null;
  currentUserId: string;
}) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState("");
  const socket = useRef(
    io(`${backend_url}`, {
      withCredentials: true, // Send cookies with the request
    })
  );
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [messageApi, contextHolder] = AntdMessage.useMessage();
  useEffect(() => {
    const s = socket.current;

    s.on("receive_message", (data: ChatMessage) => {
      setChat((prevChat) => [...prevChat, data]);
    });
    s.on("connect", () => {
      if (chatId) {
        s.emit("join_chat", chatId);
      }
    });

    s.on("disconnect", () => {});

    return () => {
      s.off("receive_message");
      s.off("connect");
      s.off("disconnect");
    };
  }, [chatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);
  useEffect(() => {
    const s = socket.current;

    // Listen for typing events
    s.on("typing", (userName: string) => {
      setIsTyping(`${userName} is typing...`);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => setIsTyping(""), 1000);
    });

    // Listen for stop_typing events
    s.on("stop_typing", () => {
      setIsTyping("");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    });

    return () => {
      s.off("typing");
      s.off("stop_typing");
    };
  }, [chatId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData: ChatMessage = {
        _id: "",
        sender: { _id: currentUserId, name: "", email: "" },
        content: message,
        chat: chatId || "",
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };

      socket.current.emit("send_message", {
        ...messageData,
        chatId: chatId,
        content: message,
      });
      socket.current.emit("stop_typing", chatId);
      setChat((prevChat) => [...prevChat, messageData]);
      setMessage("");
      setIsTyping("");
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (chatId) {
      socket.current.emit("typing", chatId);
    }
  };
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend_url}/api/chats/${chatId}`, {
          withCredentials: true,
        });
        setChat(res.data.messages);
      } catch (error) {
        console.error(error);
        messageApi.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);
  return (
    <>
      {contextHolder}
      <div className="mt-2 p-5 border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-gray-900 rounded-md">
        <div
          className="rounded-md h-[85vh] overflow-y-auto"
          ref={chatContainerRef}
        >
          {loading ? (
            <Spin
              size="large"
              className="flex items-center justify-center h-full"
            />
          ) : (
            <>
              {chat.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg text-gray-500">
                    Start the conversation by sending a message
                  </p>
                </div>
              )}
              {chat.map((msg, index) => (
                <div key={index} className="mb-1.5 mr-2">
                  <div
                    className={`flex ${
                      msg.sender._id === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {msg.sender._id !== currentUserId && (
                      <div className="mr-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${currentUserId}`}
                            className="bg-zinc-300 dark:bg-zinc-700"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <span
                      className={`p-2 px-3 ${
                        msg.sender._id === currentUserId
                          ? "rounded-tl-md rounded-b-md bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white"
                          : "rounded-tr-md rounded-b-md bg-zinc-700 text-white dark:bg-zinc-600"
                      }`}
                    >
                      {msg.content}
                    </span>
                  </div>
                  <div
                    className={`text-zinc-400 dark:text-zinc-500 text-xs ml-14 flex ${
                      msg.sender._id === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-start">
          {isTyping && <span>{isTyping}</span>}
        </div>

        <form onSubmit={sendMessage} className="mt-2">
          <div className="flex gap-x-6 justify-center">
            <Input
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder="Enter your message"
              className="w-3/4 bg-white dark:bg-gray-800 border-zinc-300 dark:border-zinc-700 text-black dark:text-white"
            />
            <Button
              type="submit"
              className="bg-blue-500 dark:bg-blue-600 text-white dark:text-gray-100 hover:bg-blue-600 dark:hover:bg-blue-700"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
