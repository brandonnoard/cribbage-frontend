import { apiRequest, type GetToken } from "./client";
import type { HealthStatus, User } from "../types/api";

export type CreateUserInput = Readonly<{
  email: string;
  displayName: string;
  givenName?: string;
  surname?: string;
}>;

export type UpdateUserInput = Readonly<{
  displayName: string;
  givenName?: string;
  surname?: string;
}>;

export function healthCheck(): Promise<HealthStatus> {
  return apiRequest<HealthStatus>(undefined, "/v1/users/health", { authenticated: false });
}

export function listUsers(getToken: GetToken): Promise<User[]> {
  return apiRequest<User[]>(getToken, "/v1/users");
}

export function getUser(getToken: GetToken, id: string): Promise<User> {
  return apiRequest<User>(getToken, `/v1/users/${encodeURIComponent(id)}`);
}

export function createUser(getToken: GetToken, input: CreateUserInput): Promise<User> {
  return apiRequest<User>(getToken, "/v1/users", {
    method: "POST",
    body: input,
  });
}

export function updateUser(getToken: GetToken, id: string, input: UpdateUserInput): Promise<User> {
  return apiRequest<User>(getToken, `/v1/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: input,
  });
}
