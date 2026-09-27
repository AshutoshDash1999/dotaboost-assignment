// Steam64 IDs are Steam32 account IDs offset by this constant
const STEAM64_OFFSET = BigInt("76561197960265728");
const MIN_NAME_LENGTH = 2;

export type PlayerQuery =
  | { kind: "id"; accountId: string }
  | { kind: "name"; q: string }
  | { kind: "empty" };

export function parsePlayerQuery(input: string): PlayerQuery {
  const value = input.trim();

  if (/^\d+$/.test(value)) {
    // BigInt keeps Steam64 IDs exact; they overflow Number's safe range
    const id = BigInt(value);
    const accountId = id >= STEAM64_OFFSET ? id - STEAM64_OFFSET : id;
    return { kind: "id", accountId: accountId.toString() };
  }

  if (value.length < MIN_NAME_LENGTH) return { kind: "empty" };
  return { kind: "name", q: value };
}
