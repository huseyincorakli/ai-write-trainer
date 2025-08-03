"use client"
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
import { useAction, useMutation } from "convex/react";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import uuid4 from "uuid4";
import axios from 'axios'

const UploadPdfDialog = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const insertFileEntry = useMutation(api.fileStorage.addFileEntryToDb)
  const getFileUrl= useMutation(api.fileStorage.getFileUrl)
  const embeddDocument=useAction(api.myAction.ingest)
  const {user}= useUser();
  const [file, setFile] = useState<File | null>(null);
  const [loading,setLoading]=useState<boolean>(false);
  const [open, setOpen]=useState<boolean>();

  const OnFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const OnUpload =async()=>{
    if(!file) return;
    
    setLoading(true)
    const postUrl= await generateUploadUrl();

     const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });
    const { storageId } = await result.json();
    const fileId= uuid4()
    const userEmail = (user?.primaryEmailAddress?.emailAddress) || "user-email"
    const fileUrl= await getFileUrl({storageId:storageId}) || "file-url"
    await insertFileEntry({
      storageId:storageId,
      createdBy:userEmail,
      fileId:fileId,
      fileName:file.name,
      fileUrl:fileUrl
    })
    
    const getPdfResult = (await axios.get('api/pdf-loader?pdfUrl='+fileUrl)).data.result as string[]
    await embeddDocument({texts:getPdfResult,fileId:fileId})
    
    setLoading(false)
    setFile(null)
    setOpen(false);

  }
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
            <Button onClick={OnUpload} type="button" disabled={loading} >
              {loading ? <LoaderCircle className="animate-spin"/> : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadPdfDialog;
