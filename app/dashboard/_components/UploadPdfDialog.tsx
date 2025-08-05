"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useAction, useMutation, useQuery } from "convex/react";
import { AlertCircle, Crown, LoaderCircle, Trash2, Upload } from "lucide-react";
import React, { useState } from "react";
import uuid4 from "uuid4";
import axios from "axios";
import { useDialog } from "@/store/useDialog";

const UploadPdfDialog = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const insertFileEntry = useMutation(api.fileStorage.addFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest);
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>();
  const userFiles = useQuery(
    api.fileStorage.getUserFiles,
    user?.primaryEmailAddress
      ? {
          createdBy: user.primaryEmailAddress.emailAddress,
        }
      : "skip"
  );
  const { toggle, setDialogContent, setDialogTitle } = useDialog();

  const OnFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const OnUpload = async () => {
    if (!file) return;
    if (userFiles && userFiles.length >= 5) {
      setOpen(false);
      setDialogContent(
        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Upload Limit Reached
        </h3>
        <p className="text-gray-600 leading-relaxed">
          You've reached your file upload limit. Upgrade your plan for unlimited uploads.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Files Used</span>
          <span className="text-sm font-bold text-red-600">{userFiles.length} / 5</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(userFiles.length / 5) * 100}%` }}
          ></div>
        </div>
      </div>

    

      <div className="space-y-3">
        <Button className="w-full h-min-[60px]">
          <Crown className="w-5 h-5" />
          Upgrade Plan
        </Button>
        
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Delete existing files to upload new ones, or upgrade for unlimited storage.
      </p>
    </div>
      );
      toggle();

      return;
    }
    setLoading(true);
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });
    const { storageId } = await result.json();
    const fileId = uuid4();
    const userEmail = user?.primaryEmailAddress?.emailAddress || "user-email";
    const fileUrl = (await getFileUrl({ storageId: storageId })) || "file-url";
    await insertFileEntry({
      storageId: storageId,
      createdBy: userEmail,
      fileId: fileId,
      fileName: file.name,
      fileUrl: fileUrl,
    });

    const getPdfResult = (await axios.get("api/pdf-loader?pdfUrl=" + fileUrl))
      .data.result as string[];
    await embeddDocument({ texts: getPdfResult, fileId: fileId });

    setLoading(false);
    setFile(null);
    setOpen(false);
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload PDF File</DialogTitle>
            <DialogDescription asChild>
              <div>
                <div className="mt-2">
                  <div className="p-1 rounded-md">
                    <h2 className="font-bold mt-1">Select a file to upload</h2>
                    <Input
                      id="uploadedPdf"
                      type="file"
                      accept="application/pdf"
                      onChange={(event) => OnFileSelect(event)}
                      required
                    />
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant={"outline"} disabled={loading}>
                Close
              </Button>
            </DialogClose>
            <Button onClick={OnUpload} type="button" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadPdfDialog;
