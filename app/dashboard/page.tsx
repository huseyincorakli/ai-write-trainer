"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const deleteFile = useMutation(api.fileStorage.deleteFile);
  
  const onDeleteFile = async (fileId: string) => {
    const a = prompt("Are you sure you want to delete this file? Type 'DELETE' or 'delete' to confirm.");
    if (a?.toLocaleLowerCase() !== "delete") {
      return;
    }
    
  await deleteFile({fileId:fileId});
}
  const { user } = useUser();
  const userFiles = useQuery(
    api.fileStorage.getUserFiles,
    user?.primaryEmailAddress
      ? {
          createdBy: user.primaryEmailAddress.emailAddress,
        }
      : "skip"
  );

  const isLoading = userFiles === undefined;

  const timeStampToDate=(value:number)=>{
    return new Date(Math.floor(value))
  }

  
  return (
    <div>
      <h2 className="font-medium text-2xl">Workspace</h2>
      
      {isLoading && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-3">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div
              key={i}
              className="bg-slate-200 rounded-md h-[200px] animate-pulse shadow-md"
            >
              <div className="p-3 space-y-3">
                <div className="bg-slate-300 h-[120px] rounded"></div>
                <div className="bg-slate-300 h-4 rounded"></div>
                <div className="bg-slate-300 h-3 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && userFiles && userFiles.length === 0 && (
        <div className="p-3">
          <h2 className="text-lg">You dont have any files.</h2>
        </div>
      )}

      {!isLoading && userFiles && userFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-3">
          {userFiles.map((file, index) => (
            <div
              key={index}
              className="relative flex flex-col p-3 shadow-md justify-center items-center border transition-all duration-100 hover:shadow-lg"
            > 
              <div onClick={()=>{onDeleteFile(file.fileId)}} className="absolute top-1 right-1  bg-blue-500 text-white rounded-full px-2 py-2 text-xs cursor-pointer hover:bg-red-400">
                <Trash width={18} height={18} />
              </div>
              <Link href={`/workspace/${file.fileId}`} className="flex flex-col items-center text-center">
                <div className="flex justify-center items-center mb-2">
                  <Image
                    src={"/pdf.png"}
                    alt={file.fileName}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
                <h2 className="font-sm mt-2">
                  {file.fileName.replace(".pdf", "").toUpperCase()}
                </h2>
                <h2 className="text-sm text-gray-600">{(timeStampToDate(file._creationTime).toUTCString())}</h2>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;