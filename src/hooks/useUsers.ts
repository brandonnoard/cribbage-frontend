import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiToken } from "../auth/useApiToken";
import {
  createUser,
  getUser,
  healthCheck,
  listUsers,
  updateUser,
  type CreateUserInput,
  type UpdateUserInput,
} from "../api/users";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
  health: ["health"] as const,
};

export function useHealthCheck() {
  return useQuery({
    queryKey: userKeys.health,
    queryFn: healthCheck,
    retry: false,
    staleTime: 30_000,
  });
}

export function useUsersList() {
  const getToken = useApiToken();

  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => listUsers(getToken),
  });
}

export function useUser(id: string | undefined) {
  const getToken = useApiToken();

  return useQuery({
    queryKey: userKeys.detail(id ?? ""),
    queryFn: () => {
      if (!id) {
        throw new Error("User id is required");
      }

      return getUser(getToken, id);
    },
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const getToken = useApiToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(getToken, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUser(id: string) {
  const getToken = useApiToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(getToken, id, input),
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.detail(id), user);
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
