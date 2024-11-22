"use client";

import { createClient } from "@/utils/supabase/client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { Card } from "./ui/card";

const formSchema = z.object({
  agent_name: z.string(),
  agent_description: z.string().optional(),
  agent_instructions: z.string(),
  agent_starters: z.array(z.string()).default([""]),
  agent_knowledge: z
    .array(z.instanceof(File))
    .optional(),
  agent_web: z.boolean().optional(),
  agent_image: z.boolean().optional(),
  agent_vm: z.boolean().optional(),
});

interface KnowledgeFile {
  id: string;
  knowledge_id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

interface NewAgentFormProps {
  initialData?: {
    id?: string;
    name: string;
    description?: string;
    instructions: string;
    web?: boolean;
    image_generation?: boolean;
    vm?: boolean;
    starters?: string[];
    knowledge?: string;
    files?: KnowledgeFile[];
  };
}

export default function NewAgentForm({ initialData }: NewAgentFormProps) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [existingFiles, setExistingFiles] = useState<KnowledgeFile[]>(
    initialData?.files || []
  );

  const supabase = createClient();
  const router = useRouter();

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agent_name: initialData?.name || "",
      agent_description: initialData?.description || "",
      agent_instructions: initialData?.instructions || "",
      agent_starters: initialData?.starters ? [...initialData.starters, ""] : [""],
      agent_knowledge: [],
      agent_web: initialData?.web || false,
      agent_image: initialData?.image_generation || false,
      agent_vm: initialData?.vm || false,
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Create or update agent first to get agentId
      let agentId: string;
      if (initialData?.id) {
        agentId = initialData.id;
        const { error: agentError } = await supabase
          .from('agents')
          .update({
            name: values.agent_name,
            description: values.agent_description,
            instructions: values.agent_instructions,
            web: values.agent_web || false,
            image_generation: values.agent_image || false,
            vm: values.agent_vm || false,
          })
          .eq('id', agentId);

        if (agentError) throw agentError;
      } else {
        const { data: agent, error: agentError } = await supabase
          .from('agents')
          .insert({
            name: values.agent_name,
            description: values.agent_description,
            instructions: values.agent_instructions,
            web: values.agent_web || false,
            image_generation: values.agent_image || false,
            vm: values.agent_vm || false,
          })
          .select()
          .single();

        if (agentError) throw agentError;
        agentId = agent.id;
      }

      // Handle file-based knowledge
      if (files && files.length > 0) {
        for (const file of files) {
          // Read the file content
          const content = await file.text();

          // Insert or get existing knowledge
          const { data: existingKnowledge, error: fetchError } = await supabase
            .from('knowledge')
            .select('id')
            .eq('content', content)
            .single();

          let knowledgeId: string;
          
          if (fetchError && fetchError.code === 'PGRST116') {
            // Knowledge doesn't exist, create new
            const { data: newKnowledge, error: insertError } = await supabase
              .from('knowledge')
              .insert({ content })
              .select()
              .single();

            if (insertError) throw insertError;
            knowledgeId = newKnowledge.id;
          } else if (fetchError) {
            throw fetchError;
          } else {
            knowledgeId = existingKnowledge.id;
          }

          // Associate knowledge with agent
          const { error: assocError } = await supabase
            .from('agent_knowledge')
            .upsert({
              agent_id: agentId,
              knowledge_id: knowledgeId,
            });

          if (assocError) throw assocError;

          // Upload file to storage
          const filePath = `agent_${agentId}/${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('knowledge_files')
            .upload(filePath, file, {
              upsert: false,
            });

          if (uploadError) throw uploadError;

          // Get public URL and store file reference
          const { data: { publicUrl } } = supabase
            .storage
            .from('knowledge_files')
            .getPublicUrl(uploadData.path);

          const { error: fileInsertError } = await supabase
            .from('agent_knowledge_files')
            .insert({
              knowledge_id: knowledgeId,
              file_url: publicUrl,
              file_name: file.name,
            });

          if (fileInsertError) throw fileInsertError;
        }
      }

      // Insert agent starters
      if (values.agent_starters && values.agent_starters.length > 0) {
        const starters = values.agent_starters
          .filter(starter => starter.trim() !== '')
          .map(starter => ({
            agent_id: agentId,
            starter_text: starter,
          }));
  
        if (starters.length > 0) {
          const { error: startersError } = await supabase
            .from('agent_starters')
            .insert(starters);
  
          if (startersError) throw startersError;
        }
      }

      if (initialData?.id) {
        toast.success("Agent updated successfully!");
      } else {
        toast.success("Agent created successfully!");
        router.push(`/agents/${agentId}`);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  async function handleDeleteFile(fileId: string) {
    try {
      const fileToDelete = existingFiles.find(f => f.id === fileId);
      if (!fileToDelete) return;

      const { error } = await supabase
        .from('agent_knowledge_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      // Update the UI
      setExistingFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
        className="space-y-8 max-w-3xl mx-auto my-0 py-0"
      >
        <FormField
          control={form.control}
          name="agent_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Sally from Middle Office"
                  type=""
                  {...field}
                />
              </FormControl>
              <FormDescription>Name your agent.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agent_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Sally is knowledgeable about the Middle Office in banking."
                  type=""
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short description about what this agent does.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agent_instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="You are the middle office manager in banking.  You are to support the front office.  "
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What does this Agent do? How does it behave? What should it
                avoid doing?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agent_starters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conversation starters</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value.map((starter, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Has the trade booked?"
                        value={starter}
                        onChange={(e) => {
                          const newValue = [...field.value];
                          newValue[index] = e.target.value;
                          field.onChange(newValue);
                          
                          // Add a new empty field if this is the last one and it's not empty
                          if (index === field.value.length - 1 && e.target.value !== "") {
                            field.onChange([...newValue, ""]);
                          }
                        }}
                      />
                      {index !== field.value.length - 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newValue = field.value.filter((_, i) => i !== index);
                            field.onChange(newValue);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                Add conversation starters or questions for the agent.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Display existing files */}
        {existingFiles.length > 0 && (
          <div className="space-y-4">
            <FormLabel>Existing Knowledge Files</FormLabel>
            <div className="space-y-2">
              {existingFiles.map(file => (
                <Card key={file.id} className="flex items-center justify-between p-2">
                  <a 
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-2"
                  >
                    <Paperclip className="h-4 w-4" />
                    {file.file_name}
                  </a>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    Delete
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}        

        <FormField
          control={form.control}
          name="agent_knowledge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Knowledge</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-border"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-muted-foreground w-10 h-10" />
                      <p className="mb-1 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files &&
                      files.length > 0 &&
                      files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormDescription>
                If you upload files under Knowledge, conversations with your
                Agent may include file contents.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

<div className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="agent_web"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Web Search</FormLabel>
                <FormDescription>Enable web search.</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agent_image"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Image Generation</FormLabel>
                <FormDescription>Ability to generate images.</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agent_vm"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Code Interpreter & Data Analysis</FormLabel>
                <FormDescription>
                  Ability for agent to run code in a virtual environment.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />
        </div>


        <Button type="submit" className="w-full">
          {initialData?.id ? "Update Agent" : "Create Agent"}
        </Button>
      </form>
    </Form>
  );
}
