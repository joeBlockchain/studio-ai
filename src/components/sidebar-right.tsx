"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { createClient } from "@/utils/supabase/client";

interface SidebarRightProps extends React.ComponentProps<typeof Sidebar> {
  isOpen: boolean;
  agentId?: string;
}

export function SidebarRight({ isOpen, agentId, ...props }: SidebarRightProps) {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const supabase = createClient();

  React.useEffect(() => {
    async function fetchAgentInstructions() {
      if (!agentId) {
        setMessages([]);
        return;
      }

      try {
        const { data: agentData, error } = await supabase
          .from('agents')
          .select('instructions')
          .eq('id', agentId)
          .single();

        if (error) throw error;
        if (agentData?.instructions) {
          setMessages([{ role: "system", content: `Agent Instructions: ` + agentData.instructions }]);
        }
      } catch (error) {
        console.error("Failed to fetch agent instructions:", error);
      }
    }

    fetchAgentInstructions();
  }, [agentId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          messages: newMessages,
          agentId: agentId
        }),
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <Sidebar
      collapsible="none"
      className={`sticky top-0 h-svh border-l transition-all duration-300
        ${
          isOpen
            ? "w-[23rem] translate-x-0"
            : "w-0 overflow-hidden translate-x-full"
        }
      `}
      {...props}
    >
      {isOpen && (
        <>
          <SidebarHeader>
            <h3 className="px-4 text-lg font-semibold">Chat</h3>
          </SidebarHeader>
          <SidebarContent className="flex flex-col gap-4 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground ml-4"
                    : msg.role === "assistant"
                      ? "bg-muted mr-4"
                      : "bg-accent text-accent-foreground"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <div className="grid w-full gap-2 p-4">
              <Textarea 
                placeholder="Type your message here." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? "Sending..." : "Send message"}
              </Button>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </>
      )}
    </Sidebar>
  );
}
