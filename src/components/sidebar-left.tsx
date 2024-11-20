"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Trash2,
} from "lucide-react";

import { createClient } from "@/utils/supabase/client";

import { NavAgents } from "@/components/nav-agents";
import { NavMain } from "@/components/nav-main";
import { NavReferences } from "@/components/nav-references";
import { NavSecondary } from "@/components/nav-secondary";
import { TeamSwitcher } from "@/components/team-switcher";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Joe Taylor",
    email: "jtaylor@fintegrity.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Truist",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Wells Fargo",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "JPMorgan Chase",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  References: [
    // {
    //   name: "Calypso Documentation",
    //   pages: [
    //     {
    //       name: "Interest Rate Swap",
    //       url: "#",
    //     },
    //     {
    //       name: "Swaption",
    //       url: "#",
    //     },
    //     {
    //       name: "Collar",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   name: "CID Documentation",
    //   pages: [
    //     {
    //       name: "Fundamentals",
    //       url: "#",
    //     },
    //     {
    //       name: "Webhooks",
    //       url: "#",
    //     },
    //     {
    //       name: "Full Text Search",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   name: "DSOM Guide",
    //   pages: [
    //     {
    //       name: "Pre-Trade",
    //       url: "#",
    //     },
    //     {
    //       name: "Post-Trade",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   name: "Bloomberg",
    //   pages: [
    //     {
    //       name: "Custom Screens",
    //       url: "#",
    //     },
    //     {
    //       name: "Markets",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
};

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [agents, setAgents] = React.useState<Array<{ id: string; name: string; url: string }>>([]);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient();

  React.useEffect(() => {
    async function fetchAgents() {
      try {
        const { data: agentsData, error } = await supabase
          .from('agents')
          .select('id, name')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching agents:', error);
          return;
        }

        // Transform the data to match the expected format
        const formattedAgents = agentsData.map(agent => ({
          id: agent.id,
          name: agent.name,
          url: `/agents/${agent.name.toLowerCase().replace(/\s+/g, '-')}`,
        }));

        setAgents(formattedAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();

    // Subscribe to changes in the agents table
    const channel = supabase
      .channel('agents-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'agents' 
        }, 
        () => {
          fetchAgents();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw error;
    }
  };

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="flex w-full">
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavAgents agents={agents} onDeleteAgent={handleDeleteAgent} />
        <NavReferences references={data.References} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="h-16 border-b border-sidebar-border">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
