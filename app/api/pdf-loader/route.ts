import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

// const pdfUrl="https://frugal-badger-312.convex.cloud/api/storage/a6e1f125-485c-474d-8b1c-48891e0368f7"
export async function GET(req: NextRequest) {
  // pdf yükle
  const pdfUrl = req.nextUrl.searchParams.get("pdfUrl");

  if (pdfUrl) {
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);

    const docs = await loader.load();
    const document = docs.map((doc) => doc.pageContent).join();

    //split small chunks

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 20,
      separators: [". "],
    });
    const texts = await textSplitter.splitText(document);

    return NextResponse.json({
      result: texts,
    });
  }
}
