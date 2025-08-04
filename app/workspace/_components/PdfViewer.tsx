import React from 'react'

const PdfViewer = ({fileUrl}:{fileUrl:string}) => {
  return (
    <div>
      <iframe height="100vh" width="100%" src={fileUrl+"#toolbar=0&zoom=110"} className='h-[90vh]' ></iframe>
    </div>
  )}

export default PdfViewer
