"use client";
import { redirect, useParams } from "next/navigation";
import React, { useState } from "react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import PdfViewer from "../_components/PdfViewer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextEditor from "../_components/TextEditor";

const Workspace = () => {
  const { fileId } = useParams();
  const [activeTab, setActiveTab] = useState("editor"); 

  if (!fileId) {
    redirect("dashboard");
  }

  const getFileInfo = useQuery(api.fileStorage.getFileRecord, {
    fileId: fileId!.toString(),
  });

  if (!getFileInfo || getFileInfo.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <WorkspaceHeader fileName={getFileInfo[0].fileName} />
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex border-b bg-white">
        <button
          onClick={() => setActiveTab("editor")}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "editor"
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setActiveTab("pdf")}
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "pdf"
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          PDF
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-5 h-full p-3 lg:p-5">
          {/* Text Editor - Takes more space on larger screens */}
          <div className="md:col-span-1 lg:col-span-1 overflow-hidden">
            <div className="h-full overflow-y-auto bg-white rounded-lg shadow-sm border">
              <TextEditor />
            </div>
          </div>
          
          <div className="md:col-span-1 lg:col-span-1 overflow-hidden">
            <div className="h-full bg-white rounded-lg shadow-sm border">
              <PdfViewer fileUrl={getFileInfo[0].fileUrl} />
            </div>
          </div>
        </div>

        <div className="md:hidden h-full">
          {activeTab === "editor" && (
            <div className="h-full overflow-y-auto bg-white">
              <TextEditor />
            </div>
          )}
          {activeTab === "pdf" && (
            <div className="h-full bg-white">
              <PdfViewer fileUrl={getFileInfo[0].fileUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;