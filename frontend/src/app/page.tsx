"use client";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import backend_url from "@/utils/backend";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ChatMessage = {
  id?: string;
  text: string;
  timestamp: string;
};

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(""); // State to display typing info
  const socket = useRef(io(`${backend_url}`));
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const s = socket.current;

    s.on("receive_message", (data: ChatMessage) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    s.on("connect", () => {
      toast({ title: "Connected to server" });
    });

    s.on("disconnect", () => {
      toast({ title: "Disconnected from server" });
    });

    s.on("typing", (id: string) => {
      if (id !== s.id) {
        setIsTyping(`${id} is typing...`);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(""), 2000); // Remove indicator after 2 seconds
      }
    });
    s.on("stop_typing", (id: string) => {
      if (id !== s.id) {
        setIsTyping(""); // Immediately remove typing indicator when stop_typing is received
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      }
    });
    return () => {
      s.off("receive_message");
      s.off("typing");
      s.off("connect");
      s.off("disconnect");
      s.off("stop_typing");
    };
  }, []);
  useEffect(() => {
    // Scroll to the bottom whenever the chat updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    if (message.trim()) {
      const messageData: ChatMessage = {
        id: socket.current.id,
        text: message,
        timestamp: new Date().toISOString(),
      };

      socket.current.emit("send_message", messageData);
      socket.current.emit("stop_typing", socket.current.id);
      setChat((prevChat) => [...prevChat, messageData]);
      setMessage("");
      setIsTyping(""); // Clear typing status for self
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    socket.current.emit("typing", socket.current.id); // Emit typing event
  };

  return (
    <>
      <div className="text-center font-semibold p-5">MessageVerse</div>

      <div className="mx-96 p-5 border-2 border-zinc-300">
        <div
          className="rounded-md h-60 overflow-y-auto"
          ref={chatContainerRef}
        >
          {chat.map((msg, index) => (
            <div
              key={index}
            >
              <div
                className={`flex ${
                  msg.id === socket.current.id ? "justify-end" : "justify-start"
                }`}
              >
                {msg.id !== socket.current.id && (
                  <div className="mr-3">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <span
                  className={`p-2 px-3 ${
                    msg.id === socket.current.id
                      ? "rounded-tl-md rounded-b-md bg-zinc-200"
                      : "rounded-tr-md rounded-b-md bg-blue-600 text-white"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
              <div className="text-zinc-400 text-xs ml-14">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-500 flex justify-start">{isTyping}</div>

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
