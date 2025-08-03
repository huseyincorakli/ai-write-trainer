"use client"
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import React from 'react'

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  return (
    <ConvexProvider client={convex}>{children}</ConvexProvider>
  )
}

export default Provider
