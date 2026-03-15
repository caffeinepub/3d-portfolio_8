import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob } from "../backend";
import type { Portfolio, Project, SocialLink } from "../backend.d";
import { useActor } from "./useActor";

export type { Portfolio, Project, SocialLink };

export function usePortfolio() {
  const { actor, isFetching } = useActor();
  return useQuery<Portfolio | null>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPortfolio();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getProjects();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useResume() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const resume = await actor.getResume();
        return { url: resume.blob.getDirectURL(), fileName: resume.fileName };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePortfolio() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      tagline,
      about,
    }: { name: string; tagline: string; about: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updatePortfolio(name, tagline, about);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useUpdateSkills() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (skills: string[]) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateSkills(skills);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useUpdateSocialLinks() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (links: SocialLink[]) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateSocialLinks(links);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useAddProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      link,
    }: { title: string; description: string; link: string }) => {
      if (!actor) throw new Error("Not connected");
      return await actor.addProject(title, description, link);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteProject(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useUploadResume() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: { file: File; onProgress?: (pct: number) => void }) => {
      if (!actor) throw new Error("Not connected");
      const bytes = new Uint8Array(await file.arrayBuffer());
      let blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) blob = blob.withUploadProgress(onProgress);
      await actor.uploadResume(file.name, blob);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resume"] }),
  });
}
