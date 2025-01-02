"use client";
import { useEffect } from "react";
import { Oval } from "react-loader-spinner";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const Page = () => {
  
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    const logout = async () => {
      try {
          Cookies.remove("token");
          router.replace("/login");
      } catch (error) {
        toast({
          title: "Error!",
          description: "An error occurred while logging out.",
        });
        console.error(error);
      }
    };
    logout();
  }, [router, toast]);
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

export default Page;
