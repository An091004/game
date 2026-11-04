import { SAVE_CONFIG, SAVE_TEXT } from "../data/save";
import type { GameState } from "../state/types";
import { migrateSave } from "./migrations";

/** CRC32 phát hiện hỏng dữ liệu, không phải cơ chế chống sửa save. Đồng bộ để flush web khi pagehide. */
export function checksum(text: string): string {
  let crc = 0xffffffff;
  for (const byte of new TextEncoder().encode(text)) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0");
}
export function serialize(state: GameState): string {
  const payload = JSON.stringify(migrateSave(state));
  const encoded = JSON.stringify({
    format: SAVE_CONFIG.format,
    payload,
    checksum: checksum(payload),
  });
  if (encoded.length > SAVE_CONFIG.maxLength) throw Error(SAVE_TEXT.invalid);
  return encoded;
}
export function deserialize(text: string): GameState {
  if (text.length > SAVE_CONFIG.maxLength) throw Error(SAVE_TEXT.invalid);
  const envelope: unknown = JSON.parse(text);
  if (
    !envelope ||
    typeof envelope !== "object" ||
    !("format" in envelope) ||
    envelope.format !== SAVE_CONFIG.format ||
    !("payload" in envelope) ||
    typeof envelope.payload !== "string" ||
    !("checksum" in envelope) ||
    typeof envelope.checksum !== "string"
  )
    throw Error(SAVE_TEXT.invalid);
  if (checksum(envelope.payload) !== envelope.checksum)
    throw Error(SAVE_TEXT.checksum);
  return migrateSave(JSON.parse(envelope.payload));
}
