export const normalizeCnic = (cnic = "") => {
  const digits = cnic.replace(/\D/g, "");

  // Format: 35202-1234567-1
  if (digits.length === 13) {
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  }

  return digits;
};

export const normalizePhone = (phone = "") => {
  let digits = phone.replace(/\D/g, "");

  // Convert 92xxxxxxxxxx -> 03xxxxxxxxx
  if (digits.startsWith("92") && digits.length === 12) {
    digits = "0" + digits.slice(2);
  }

  // Format: 0300-1234567
  if (digits.length === 11) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return digits;
};

export const normalizeDate = (date = new Date()) => {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "";
  }

  return d.toISOString().split("T")[0];
};
