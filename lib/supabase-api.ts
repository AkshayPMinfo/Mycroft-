import { createClient } from "@/utils/supabase/client";
import { Project, ChatMessage } from "@/types/domain";
import { mycroftApi } from "@/lib/mock-api";

export const supabaseApi = {
  projects: {
    async get(): Promise<{ projects: Project[], deployments: any[] }> {
      try {
        const supabase = createClient();
        const { data: projects, error } = await supabase.from('projects').select('*');
        
        if (error || !projects || projects.length === 0) {
          console.warn("Supabase returned error or no projects, falling back to mock data.", error);
          return mycroftApi.projects();
        }

        const mappedProjects = projects.map(p => ({
          id: p.id,
          name: p.name,
          subtitle: p.subtitle,
          status: p.status,
          statusLabel: p.status_label,
          deployment: p.deployment,
          activity: p.activity,
          openBugs: p.open_bugs,
          recommendation: p.recommendation,
          updated: p.updated,
          progress: p.progress,
          accent: p.accent,
          stack: p.stack || []
        }));

        // Deployments are currently not in Supabase schema, return mocked deployments
        return { projects: mappedProjects, deployments: mycroftApi.projects().deployments };
      } catch (err) {
        console.error("Failed to connect to Supabase (Projects). Falling back to mock data.", err);
        return mycroftApi.projects();
      }
    },

    async create(project: Project): Promise<void> {
      try {
        const supabase = createClient();
        const payload = {
          id: project.id,
          name: project.name,
          subtitle: project.subtitle,
          status: project.status,
          status_label: project.statusLabel,
          deployment: project.deployment,
          activity: project.activity,
          open_bugs: project.openBugs,
          recommendation: project.recommendation,
          updated: project.updated,
          progress: project.progress,
          accent: project.accent,
          stack: project.stack
        };
        const { error } = await supabase.from('projects').insert(payload);
        if (error) {
          console.error("Failed to create project in Supabase:", error);
        }
      } catch (err) {
        console.error("Supabase API error when creating project:", err);
      }
    }
  },
  chat: {
    async get(): Promise<{ messages: ChatMessage[], quickActions: string[] }> {
      try {
        const supabase = createClient();
        const { data: messages, error } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true });
        
        if (error || !messages || messages.length === 0) {
          console.warn("Supabase returned error or no chat history, falling back to mock data.", error);
          return mycroftApi.chat();
        }

        const mappedMessages = messages.map(m => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          code: m.code || undefined,
          diff: m.diff || undefined
        }));

        return { messages: mappedMessages, quickActions: mycroftApi.chat().quickActions };
      } catch (err) {
        console.error("Failed to connect to Supabase (Chat). Falling back to mock data.", err);
        return mycroftApi.chat();
      }
    },
    
    async saveMessage(message: ChatMessage): Promise<void> {
      try {
        const supabase = createClient();
        const payload = {
          id: message.id,
          role: message.role,
          content: message.content,
          code: message.code,
          diff: message.diff
        };
        const { error } = await supabase.from('chat_messages').insert(payload);
        if (error) {
          console.error("Failed to save message to Supabase:", error);
        }
      } catch (err) {
        console.error("Supabase API error when saving message:", err);
      }
    }
  }
};
