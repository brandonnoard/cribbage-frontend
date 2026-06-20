import type { User } from "../types/api";

function emailsMatch(recordEmail: string, accessTokenEmail: string): boolean {
  return recordEmail.toLowerCase() === accessTokenEmail.toLowerCase();
}

export function canUpdateUser(
  user: User,
  permissions: readonly string[],
  accessTokenEmail: string | undefined,
): boolean {
  if (permissions.includes("user:update")) {
    return true;
  }

  if (
    permissions.includes("user:update:self") &&
    accessTokenEmail !== undefined &&
    emailsMatch(user.email, accessTokenEmail)
  ) {
    return true;
  }

  return false;
}
