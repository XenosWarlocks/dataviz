import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertCategory } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// === Categories Hooks ===

export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return api.categories.list.responses[200].parse(await res.json());
    },
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: [api.categories.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.categories.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch category");
      return api.categories.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCategory) => {
      const validated = api.categories.create.input.parse(data);
      const res = await fetch(api.categories.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.categories.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create category");
      }
      return api.categories.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.categories.list.path] });
      toast({ title: "Success", description: "Category created successfully" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.categories.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok && res.status !== 404) throw new Error("Failed to delete category");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.categories.list.path] });
      toast({ title: "Success", description: "Category deleted" });
    },
  });
}

// === Entries & Distribution Hooks ===

export function useCategoryDistribution(categoryId: number) {
  return useQuery({
    queryKey: [api.entries.distribution.path, categoryId],
    queryFn: async () => {
      const url = buildUrl(api.entries.distribution.path, { id: categoryId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch distribution");
      return api.entries.distribution.responses[200].parse(await res.json());
    },
    enabled: !!categoryId,
  });
}

export function useAddEntries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ categoryId, rawText }: { categoryId: number; rawText: string }) => {
      const url = buildUrl(api.entries.add.path, { id: categoryId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      if (!res.ok) throw new Error("Failed to add entries");
      return api.entries.add.responses[201].parse(await res.json());
    },
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: [api.entries.distribution.path, categoryId] });
      toast({ title: "Success", description: "Data added successfully" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useMergeTerms() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ categoryId, originalTerms, mergedTerm }: { categoryId: number; originalTerms: string[]; mergedTerm: string }) => {
      const url = buildUrl(api.entries.merge.path, { id: categoryId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalTerms, mergedTerm }),
      });

      if (!res.ok) throw new Error("Failed to merge terms");
      return api.entries.merge.responses[200].parse(await res.json());
    },
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: [api.entries.distribution.path, categoryId] });
      toast({ title: "Merged", description: "Terms merged successfully" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
