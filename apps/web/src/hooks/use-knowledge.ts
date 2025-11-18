import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import {
  KnowledgeBaseItem,
  CreateKnowledgeItemDto,
  UpdateKnowledgeItemDto,
  PaginatedResponse,
} from '@sovereign-self/shared';
import { useToast } from './use-toast';

export function useKnowledgeItems(filters?: Record<string, any>) {
  const queryParams = new URLSearchParams(filters).toString();
  
  return useQuery<PaginatedResponse<KnowledgeBaseItem>>({
    queryKey: ['knowledge-items', filters],
    queryFn: () => apiRequest('get', `/knowledge?${queryParams}`),
  });
}

export function useKnowledgeItem(id: string) {
  return useQuery<KnowledgeBaseItem>({
    queryKey: ['knowledge-item', id],
    queryFn: () => apiRequest('get', `/knowledge/${id}`),
    enabled: !!id,
  });
}

export function useKnowledgeHierarchy() {
  return useQuery({
    queryKey: ['knowledge-hierarchy'],
    queryFn: () => apiRequest('get', '/knowledge/hierarchy'),
  });
}

export function useCreateKnowledgeItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateKnowledgeItemDto) =>
      apiRequest<KnowledgeBaseItem>('post', '/knowledge', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-items'] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-hierarchy'] });
      toast({
        title: 'Success',
        description: 'Knowledge item created',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create item',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateKnowledgeItem(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateKnowledgeItemDto) =>
      apiRequest<KnowledgeBaseItem>('patch', `/knowledge/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-item', id] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-items'] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-hierarchy'] });
      toast({
        title: 'Success',
        description: 'Item saved',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save item',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteKnowledgeItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiRequest('delete', `/knowledge/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-items'] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-hierarchy'] });
      toast({
        title: 'Success',
        description: 'Item deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete item',
        variant: 'destructive',
      });
    },
  });
}

export function useKnowledgeTags() {
  return useQuery<{ tags: string[] }>({
    queryKey: ['knowledge-tags'],
    queryFn: () => apiRequest('get', '/knowledge/tags'),
  });
}

export function useSemanticSearch() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (query: string) =>
      apiRequest('post', '/ai/search/knowledge', { query, limit: 10 }),
    onError: (error: any) => {
      toast({
        title: 'Search failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

