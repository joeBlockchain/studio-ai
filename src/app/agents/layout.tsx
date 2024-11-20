"use client";

import React, { useState } from "react";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function AppLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(true);
  const params = useParams();
  const agentId = typeof params?.id === 'string' ? params.id : undefined;

  const toggleSidebarRight = () => setIsSidebarRightOpen((prev) => !prev);

  return (
    <SidebarProvider>
      <SidebarLeft />
      <div className="flex flex-col flex-1">
        {/* Content Header */}
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="flex-1">
              <BreadcrumbList>
              <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Agent
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator orientation="vertical" className="ml-2 h-4" />
            {/* SidebarRight Trigger */}
            <Button
              onClick={toggleSidebarRight}
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label="Toggle Right Sidebar"
            >
              <MessageSquare size={16} />
            </Button>
          </div>
        </header>
        {/* Content Body */}
        <div className="mx-4">
        {children}
        </div>
      </div>

      <SidebarRight isOpen={isSidebarRightOpen} agentId={agentId} />
    </SidebarProvider>
  );
}
