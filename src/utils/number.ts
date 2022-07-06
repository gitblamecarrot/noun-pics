
/**
 * Generate a node-safe Hex number from any provided number.
 * @param n A number to generate from
 * @returns The number in hex with 0x prefix.
 */
export const generateHexFromNumber = (n: string | number) => `0x${Number(n).toString(16)}`;