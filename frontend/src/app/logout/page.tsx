"use client";
import { useEffect } from "react";
import { Oval } from "react-loader-spinner";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import backend_url from "@/utils/backend";
const page = () => {
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    const logout = async () => {
      try {
        const res = await axios.post(
          `${backend_url}/api/auth/logout`,
          {},
          {
            withCredentials: true,
          }
        );
        if (res.status == 200) {
          toast({
            title: "Logged out!",
            description: "You have been successfully logged out.",
          });
          router.replace("/login");
        }
      } catch (error) {
        toast({
          title: "Error!",
          description: "An error occurred while logging out.",
        });
        console.error(error);
      }
    };
    logout();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center mx-auto my-auto">
      <Oval
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default page;
