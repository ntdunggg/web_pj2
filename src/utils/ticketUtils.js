/**
 * Generate unique ticket ID
 * @returns {string}
 */
export const generateTicketId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `TKT-${timestamp}-${randomStr}`.toUpperCase();
};

/**
 * Calculate seat number from row and column
 * @param {string} zone
 * @param {number} row
 * @param {number} col
 * @returns {string}
 */
export const calculateSeatNumber = (zone, row, col) => {
  const zonePrefix = zone === 'zone_a' ? 'A' : zone === 'zone_b' ? 'B' : 'L2';
  const rowLetter = String.fromCharCode(65 + row); // A, B, C, ...
  return `${zonePrefix}-${rowLetter}${col + 1}`;
};

/**
 * Parse seat number to zone, row, col
 * @param {string} seatNumber
 * @returns {object}
 */
export const parseSeatNumber = (seatNumber) => {
  const match = seatNumber.match(/^([A-Z0-9]+)-([A-Z])(\d+)$/);
  if (!match) return null;

  const [, zonePrefix, rowLetter, colNumber] = match;
  const zone = zonePrefix === 'A' ? 'zone_a' : zonePrefix === 'B' ? 'zone_b' : 'level_2';
  const row = rowLetter.charCodeAt(0) - 65;
  const col = parseInt(colNumber, 10) - 1;

  return { zone, row, col };
};
