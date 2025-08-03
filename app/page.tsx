"use client";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);

  useEffect(() => {
    user && CheckUser();
  }, [user]);

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

  return (
    <div>
      <UserButton />
    </div>
  );
}
