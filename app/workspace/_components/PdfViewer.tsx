import React from 'react'

const PdfViewer = ({fileUrl}:{fileUrl:string}) => {
  return (
    <div>
      <iframe height="90vh" width="100%" src={fileUrl+"#toolbar=0"} className='h-[90vh]' ></iframe>
    </div>
  )}

export default PdfViewer
