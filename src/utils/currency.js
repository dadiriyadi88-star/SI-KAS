/**
 * Format number to Indonesian Rupiah (e.g. 50000 -> "Rp 50.000")
 */
export function formatRupiah(amount, withPrefix = true) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return withPrefix ? 'Rp 0' : '0';
  }
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(amount);
  
  return withPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * Parse string into integer/float amount
 */
export function parseRupiah(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = value.toString().replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}

/**
 * Convert numbers into Indonesian words ("Terbilang")
 * Example: 25000 -> "Dua Puluh Lima Ribu Rupiah"
 */
export function terbilang(nominal) {
  const angka = Math.abs(parseInt(nominal, 10)) || 0;
  const huruf = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];

  function convert(n) {
    if (n < 12) {
      return huruf[n];
    } else if (n < 20) {
      return convert(n - 10) + ' Belas';
    } else if (n < 100) {
      return convert(Math.floor(n / 10)) + ' Puluh ' + convert(n % 10);
    } else if (n < 200) {
      return 'Seratus ' + convert(n - 100);
    } else if (n < 1000) {
      return convert(Math.floor(n / 100)) + ' Ratus ' + convert(n % 100);
    } else if (n < 2000) {
      return 'Seribu ' + convert(n - 1000);
    } else if (n < 1000000) {
      return convert(Math.floor(n / 1000)) + ' Ribu ' + convert(n % 1000);
    } else if (n < 1000000000) {
      return convert(Math.floor(n / 1000000)) + ' Juta ' + convert(n % 1000000);
    } else if (n < 1000000000000) {
      return convert(Math.floor(n / 1000000000)) + ' Miliar ' + convert(n % 1000000000);
    } else {
      return 'Nominal Terlalu Besar';
    }
  }

  if (angka === 0) return 'Nol Rupiah';
  return (convert(angka).replace(/\s+/g, ' ').trim()) + ' Rupiah';
}
