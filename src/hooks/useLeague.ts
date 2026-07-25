import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLeague, healthCheck, listLeagues, type CreateLeagueInput } from "../api/league";
import { useApiToken } from "../auth/useApiToken";

export const leagueKeys = {
  all: ["leagues"] as const,
  health: ["league", "health"] as const,
};

export function useLeagueHealthCheck() {
  return useQuery({
    queryKey: leagueKeys.health,
    queryFn: healthCheck,
    retry: false,
    staleTime: 30_000,
  });
}

export function useLeaguesList() {
  const getToken = useApiToken();

  return useQuery({
    queryKey: leagueKeys.all,
    queryFn: () => listLeagues(getToken),
  });
}

export function useCreateLeague() {
  const getToken = useApiToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLeagueInput) => createLeague(getToken, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leagueKeys.all });
    },
  });
}
