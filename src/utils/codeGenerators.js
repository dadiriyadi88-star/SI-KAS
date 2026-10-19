/**
 * Generate sequential formatted receipt/transaction codes
 */
export function generateTransactionCode(prefix = 'KAS', count = 1, year = new Date().getFullYear()) {
  const padded = String(count).padStart(6, '0');
  return `${prefix}-${year}-${padded}`;
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
