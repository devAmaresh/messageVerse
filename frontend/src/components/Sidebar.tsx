"use client";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import backend_url from "@/utils/backend";
import { LogOutIcon, X } from "lucide-react";
import Link from "next/link";
import { FloatButton } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { ThemeToggle } from "./theme-toggle";

type User = {
  _id: string; // The unique identifier of the user
  name: string; // The name of the user
  email: string; // The email of the user (optional, based on your needs)
};

export default function Sidebar({
  onSelectUser,
  selectedUser,
}: {
  onSelectUser: (user: User) => void;
  selectedUser: User | null;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the list of users
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/users`, {
          withCredentials: true,
        });
        setUsers(res.data);
      } 
      /* eslint-disable */
      catch (error: any) {
        toast({
          title: "Error fetching users",
          description: "Unable to load users.",
        });
        console.error(error);
      }
    };
    fetchUsers();
  }, [toast]);

  const handleUserClick = (user: User) => {
    onSelectUser(user); // Call the function with the user object
  };

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const handleToggleSidebar = () => {
    sidebarRef.current?.classList.toggle("hidden");
  };

  return (
    <>
      <FloatButton
        onClick={handleToggleSidebar}
        className="md:hidden"
        style={{ position: "fixed", top: "16px", left: "28px" }}
        icon={<MenuOutlined />}
      />

      <div
        className={`w-1/2 md:w-1/4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 h-screen
        flex-col justify-between md:flex hidden absolute z-[999999999999999] md:static overflow-y-auto`}
        ref={sidebarRef}
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Users</h3>
            <ThemeToggle />
            <X
              className="w-6 h-6 cursor-pointer md:hidden"
              onClick={handleToggleSidebar}
            />
          </div>

          <div>
            {users.map((user) => (
              <div
                key={user._id}
                className={`flex items-center p-2 mb-2 cursor-pointer rounded-md
              ${
                selectedUser?._id === user._id
                  ? "bg-zinc-300 dark:bg-zinc-700"
                  : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
                onClick={() => handleUserClick(user)}
              >
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user._id}`}
                    className="bg-zinc-300 dark:bg-zinc-700"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="ml-3">{user.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout Section */}
        <div className="flex justify-center items-center p-2 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-md">
          <Link href="/logout" className="flex items-center space-x-2">
            <LogOutIcon className="w-6 h-6" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </>
  );
}
