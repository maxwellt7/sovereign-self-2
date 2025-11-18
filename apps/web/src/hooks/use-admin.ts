import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { User, PaginatedResponse } from '@sovereign-self/shared';
import { useToast } from './use-toast';

export function useAdminUsers(filters?: Record<string, any>) {
  const queryParams = new URLSearchParams(filters).toString();
  
  return useQuery<PaginatedResponse<User>>({
    queryKey: ['admin-users', filters],
    queryFn: () => apiRequest('get', `/admin/users?${queryParams}`),
  });
}

export function useAdminSystemStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiRequest('get', '/admin/stats'),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'USER' | 'ADMIN' }) =>
      apiRequest('patch', `/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Success',
        description: 'User role updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => apiRequest('delete', `/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Success',
        description: 'User deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    },
  });
}

