export function formatNumber(num) {
  return num?.toLocaleString('id-ID') ?? '0';
}