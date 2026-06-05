import { MAX_ROLEPLAY_ROLES } from "../constants";
import { RoleplayRole } from "../types";

const isRoleId = (value: string): boolean => /^[a-z0-9_-]+$/i.test(value);

const parseRole = (value: unknown): RoleplayRole | null => {
  if (!value || typeof value !== "object") return null;

  const role = value as Record<string, unknown>;
  if (typeof role.id !== "string" || typeof role.label !== "string")
    return null;
  if (typeof role.prompt !== "string") return null;

  const id = role.id.trim();
  const label = role.label.trim();
  const prompt = role.prompt.trim();

  if (!id || !isRoleId(id) || !label || !prompt) return null;
  if (label.length > 80) return null;

  return { id, label, prompt };
};

export const parseRoleplayRoles = (value: unknown): RoleplayRole[] => {
  if (!Array.isArray(value)) return [];

  const roles: RoleplayRole[] = [];
  const seenIds = new Set<string>();

  for (const item of value) {
    const role = parseRole(item);
    if (!role || seenIds.has(role.id)) continue;

    seenIds.add(role.id);
    roles.push(role);
    if (roles.length >= MAX_ROLEPLAY_ROLES) break;
  }

  return roles;
};
