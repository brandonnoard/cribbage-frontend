import { apiRequest, type GetToken } from "./client";
import type { HealthStatus, League, LeagueFormat } from "../types/api";

export type CreateLeagueInput = Readonly<{
  name: string;
  sizeLimit: number;
  format: LeagueFormat;
  startDate: string;
}>;

export function healthCheck(): Promise<HealthStatus> {
  return apiRequest<HealthStatus>(undefined, "/v1/leagues/health", { authenticated: false });
}

export function listLeagues(getToken: GetToken): Promise<League[]> {
  return apiRequest<League[]>(getToken, "/v1/leagues");
}

export function createLeague(getToken: GetToken, input: CreateLeagueInput): Promise<League> {
  return apiRequest<League>(getToken, "/v1/leagues", {
    method: "POST",
    body: input,
  });
}
