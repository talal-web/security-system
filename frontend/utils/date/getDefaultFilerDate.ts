export function getDefaultFromDate() {
  const today = new Date();

  const month = today.getDate() >= 10 ? today.getMonth() : today.getMonth() - 1;

  const date = new Date(today.getFullYear(), month, 10);

  const year = date.getFullYear();
  const monthNumber = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${monthNumber}-${day}`;
}

export function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
