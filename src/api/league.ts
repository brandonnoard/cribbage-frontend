import { apiRequest, type GetToken } from "./client";
import type { HealthStatus, League, LeagueFormat } from "../types/api";

export type CreateLeagueInput = Readonly<{
  name: string;
  sizeLimit: number;
  format: LeagueFormat;
  startDate: string;
}>;

export type UpdateLeagueInput = Readonly<{
  name: string;
  sizeLimit: number;
  format: LeagueFormat;
  startDate: string;
}>;

export type AddLeaguePlayerInput = Readonly<{
  playerId: string;
  displayName: string;
  email: string;
}>;

export function healthCheck(): Promise<HealthStatus> {
  return apiRequest<HealthStatus>(undefined, "/v1/leagues/health", { authenticated: false });
}

export function listLeagues(getToken: GetToken): Promise<League[]> {
  return apiRequest<League[]>(getToken, "/v1/leagues");
}

export function getLeague(getToken: GetToken, id: string): Promise<League> {
  return apiRequest<League>(getToken, `/v1/leagues/${encodeURIComponent(id)}`);
}

export function createLeague(getToken: GetToken, input: CreateLeagueInput): Promise<League> {
  return apiRequest<League>(getToken, "/v1/leagues", {
    method: "POST",
    body: input,
  });
}

export function updateLeague(
  getToken: GetToken,
  id: string,
  input: UpdateLeagueInput,
): Promise<League> {
  return apiRequest<League>(getToken, `/v1/leagues/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: input,
  });
}

export function addLeaguePlayer(
  getToken: GetToken,
  leagueId: string,
  input: AddLeaguePlayerInput,
): Promise<League> {
  return apiRequest<League>(getToken, `/v1/leagues/${encodeURIComponent(leagueId)}/players`, {
    method: "POST",
    body: input,
  });
}

export function removeLeaguePlayer(
  getToken: GetToken,
  leagueId: string,
  playerId: string,
): Promise<League> {
  return apiRequest<League>(
    getToken,
    `/v1/leagues/${encodeURIComponent(leagueId)}/players/${encodeURIComponent(playerId)}`,
    { method: "DELETE" },
  );
}
