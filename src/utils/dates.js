/**
 * Format ISO date string or Date object to Indonesian formatted date
 * e.g., "19 Oktober 2026"
 */
export function formatDate(dateInput, formatType = 'medium') {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  if (formatType === 'short') {
    // 19/10/2026
    return date.toLocaleDateString('id-ID');
  }

  if (formatType === 'iso') {
    // YYYY-MM-DD
    return date.toISOString().split('T')[0];
  }

  // default: 19 Okt 2026 or 19 Oktober 2026
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: formatType === 'long' ? 'long' : 'short',
    year: 'numeric'
  });
}

/**
 * Format with time
 * e.g., "19 Okt 2026, 14:30 WIB"
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '-';

  const dateStr = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const timeStr = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${dateStr}, ${timeStr} WIB`;
}

/**
 * Get Indonesian month name from 1-12 or 0-11
 */
export function getMonthName(monthNumber) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const idx = typeof monthNumber === 'number' ? monthNumber : parseInt(monthNumber, 10);
  return months[idx % 12] || '';
}

/**
 * Return current academic year string like "2026/2027"
 */
export function getCurrentAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 is Jan, 6 is Jul
  // School year in Indonesia starts in July
  if (month >= 6) {
    return `${year}/${year + 1}`;
  } else {
    return `${year - 1}/${year}`;
  }
}
