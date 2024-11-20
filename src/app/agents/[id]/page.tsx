"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { notFound } from "next/navigation";
import NewAgentForm from "@/components/new-agent-form";
import { useParams } from "next/navigation";

interface Agent {
  id: string;
  name: string;
  description: string;
  instructions: string;
  web: boolean;
  image_generation: boolean;
  vm: boolean;
  created_at: string;
}

// interface AgentStarter {
//   starter_text: string;
// }

// interface AgentKnowledge {
//   content: string;
// }

export default function AgentPage() {
  const params = useParams();
  const id = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [starters, setStarters] = useState<string[]>([]);
  const [knowledge, setKnowledge] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAgentData() {
      try {
        // Fetch agent details
        const { data: agentData, error: agentError } = await supabase
          .from("agents")
          .select("*")
          .eq("id", id)
          .single();

        if (agentError) throw agentError;
        if (!agentData) return notFound();

        setAgent(agentData);

        // Fetch agent starters
        const { data: startersData, error: startersError } = await supabase
          .from("agent_starters")
          .select("starter_text")
          .eq("agent_id", id);

        if (startersError) throw startersError;

        if (startersData) {
          setStarters(startersData.map((s: { starter_text: string }) => s.starter_text));
        }

        // Fetch agent knowledge
        const { data: knowledgeData, error: knowledgeError } = await supabase
          .from("agent_knowledge")
          .select("knowledge(content)")
          .eq("agent_id", id)
          .single();

        if (knowledgeError) throw knowledgeError;

        if (knowledgeData?.knowledge?.content) {
          setKnowledge(knowledgeData.knowledge.content);
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchAgentData();
    }
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading agent...</div>
      </div>
    );
  }

  if (!agent) {
    return notFound();
  }

  return (
    <div className="mb-8">
        <NewAgentForm
          initialData={{
            id: agent.id,
            name: agent.name,
            description: agent.description,
            instructions: agent.instructions,
            web: agent.web,
            image_generation: agent.image_generation,
            vm: agent.vm,
            starters: starters,
            knowledge: knowledge,
          }}
        />
    </div>
  );
}
