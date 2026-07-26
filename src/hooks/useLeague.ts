import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addLeaguePlayer,
  createLeague,
  getLeague,
  healthCheck,
  listLeagues,
  removeLeaguePlayer,
  type AddLeaguePlayerInput,
  type CreateLeagueInput,
} from "../api/league";
import { useApiToken } from "../auth/useApiToken";

export const leagueKeys = {
  all: ["leagues"] as const,
  detail: (id: string) => ["leagues", id] as const,
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

export function useLeague(id: string | undefined) {
  const getToken = useApiToken();

  return useQuery({
    queryKey: leagueKeys.detail(id ?? ""),
    queryFn: () => {
      if (!id) {
        throw new Error("League id is required");
      }

      return getLeague(getToken, id);
    },
    enabled: Boolean(id),
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

export function useAddLeaguePlayer(leagueId: string) {
  const getToken = useApiToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddLeaguePlayerInput) => addLeaguePlayer(getToken, leagueId, input),
    onSuccess: (league) => {
      queryClient.setQueryData(leagueKeys.detail(leagueId), league);
      void queryClient.invalidateQueries({ queryKey: leagueKeys.all });
    },
  });
}

export function useRemoveLeaguePlayer(leagueId: string) {
  const getToken = useApiToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playerId: string) => removeLeaguePlayer(getToken, leagueId, playerId),
    onSuccess: (league) => {
      queryClient.setQueryData(leagueKeys.detail(leagueId), league);
      void queryClient.invalidateQueries({ queryKey: leagueKeys.all });
    },
  });
}
