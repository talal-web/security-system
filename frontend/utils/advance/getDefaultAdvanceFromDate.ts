export function getDefaultAdvanceFromDate() {
  const today = new Date();

  const month = today.getDate() >= 10 ? today.getMonth() : today.getMonth() - 1;

  const date = new Date(today.getFullYear(), month, 10);

  const year = date.getFullYear();
  const monthNumber = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${monthNumber}-${day}`;
}
