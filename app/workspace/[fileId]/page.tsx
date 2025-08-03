"use client"
import { redirect, useParams } from 'next/navigation'
import React from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader';
import PdfViewer from '../_components/PdfViewer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TextEditor from '../_components/TextEditor';

const Workspace = () => {
  const { fileId } = useParams();

  if (!fileId) {
    redirect('dashboard');
  }

  const getFileInfo = useQuery(api.fileStorage.getFileRecord, {
    fileId: fileId!.toString(),
  });

  if (!getFileInfo || getFileInfo.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className='' >
      <WorkspaceHeader />

      <div className='grid grid-cols-2 gap-5'>
        <div><TextEditor/></div>
        <div>
          <PdfViewer fileUrl={getFileInfo[0].fileUrl} />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
