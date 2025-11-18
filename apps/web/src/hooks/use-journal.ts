import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import {
  JournalEntry,
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  PaginatedResponse,
} from '@sovereign-self/shared';
import { useToast } from './use-toast';

export function useJournalEntries(filters?: Record<string, any>) {
  const queryParams = new URLSearchParams(filters).toString();
  
  return useQuery<PaginatedResponse<JournalEntry>>({
    queryKey: ['journal-entries', filters],
    queryFn: () => apiRequest('get', `/journal?${queryParams}`),
  });
}

export function useJournalEntry(id: string) {
  return useQuery<JournalEntry>({
    queryKey: ['journal-entry', id],
    queryFn: () => apiRequest('get', `/journal/${id}`),
    enabled: !!id,
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateJournalEntryDto) => 
      apiRequest<JournalEntry>('post', '/journal', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast({
        title: 'Success',
        description: 'Journal entry created',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create entry',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateJournalEntry(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateJournalEntryDto) =>
      apiRequest<JournalEntry>('patch', `/journal/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entry', id] });
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast({
        title: 'Success',
        description: 'Entry saved',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save entry',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiRequest('delete', `/journal/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast({
        title: 'Success',
        description: 'Entry deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete entry',
        variant: 'destructive',
      });
    },
  });
}

export function useJournalStats() {
  return useQuery({
    queryKey: ['journal-stats'],
    queryFn: () => apiRequest('get', '/journal/stats'),
  });
}

export function useJournalTags() {
  return useQuery<{ tags: string[] }>({
    queryKey: ['journal-tags'],
    queryFn: () => apiRequest('get', '/journal/tags'),
  });
}

