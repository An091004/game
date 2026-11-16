import { CHARACTER, CHARACTER_TEXT } from "../data/character";
import type { CharacterProfile } from "./types";

/** Dùng cùng một bộ kiểm tra cho save và form; không biến profile lỗi thành mặc định. */
export function parseCharacter(value: unknown): CharacterProfile | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object" || Array.isArray(value))
    throw Error(CHARACTER_TEXT.invalid);
  const raw = value as Record<string, unknown>;
  if (typeof raw.name !== "string") throw Error(CHARACTER_TEXT.invalid);
  const name = raw.name.normalize("NFC").trim().replace(/\s+/gu, " ");
  if (
    !name ||
    Array.from(name).length > CHARACTER.maxNameLength ||
    /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(raw.name) ||
    !CHARACTER.genders.some((g) => g.id === raw.gender) ||
    !CHARACTER.hairstyles.some((h) => h.id === raw.hair) ||
    !CHARACTER.robes.some((r) => r.id === raw.robe)
  )
    throw Error(CHARACTER_TEXT.invalid);
  return {
    name,
    gender: raw.gender,
    hair: raw.hair,
    robe: raw.robe,
  } as CharacterProfile;
}
