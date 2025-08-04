"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.user.createUser);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        CheckUser().then(() => {
          router.push("/dashboard");
        });
      } else {
        router.push("/sign-in");
      }
    }
  }, [user, isLoaded, router]);

  const CheckUser = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    const imageUrl = user?.imageUrl;
    const userName = user?.fullName;

    if (!email || !imageUrl || !userName) {
      return;
    }

    await createUser({
      email,
      imageUrl,
      userName,
    });
  };

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return null;
}