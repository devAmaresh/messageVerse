"use client";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import backend_url from "@/utils/backend";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import "./Chat.css";
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
  const { toast } = useToast();

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

    s.on("disconnect", () => {
      toast({ title: "Disconnected from server" });
    });

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/chats/${chatId}`, {
          withCredentials: true,
        });
        setChat(res.data.messages);
      } catch (error) {
        console.error(error);
      }
    };
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);
  return (
    <>
      <div className="mt-2 p-5 border-2 border-zinc-300 bg-white rounded-md">
        <div
          className="rounded-md h-[85vh] overflow-y-auto"
          ref={chatContainerRef}
        >
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
                        className="bg-zinc-300"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <span
                  className={`p-2 px-3 ${
                    msg.sender._id === currentUserId
                      ? "rounded-tl-md rounded-b-md bg-zinc-200"
                      : "rounded-tr-md rounded-b-md bg-zinc-700 text-white"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
              <div
                className={`text-zinc-400 text-xs ml-14 flex ${
                  msg.sender._id === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-500 flex justify-start">
          {isTyping && <span>{isTyping}</span>}
        </div>

        <form onSubmit={sendMessage} className="mt-2">
          <div className="flex gap-x-6 justify-center">
            <Input
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder="Enter your message"
              className="w-3/4"
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </>
  );
}
