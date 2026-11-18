export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  if (!date) return "";

  // Stored dates arrive as ISO timestamps ("2026-11-05T00:00:00.000Z") while
  // form dates are "2026-11-05". Keep only the calendar date part.
  const datePart = date.slice(0, 10);
  const parsedDate = new Date(`${datePart}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatServicePeriod(
  serviceFrom: string,
  serviceTo: string,
): string {
  if (!serviceFrom || !serviceTo) return "";

  return `${formatDate(serviceFrom)} – ${formatDate(serviceTo)}`;
}

export function numberToWords(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    return "";
  }

  const number = Math.floor(amount);

  if (number === 0) {
    return "Zero Pakistani Rupees Only";
  }

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertBelowThousand(value: number): string {
    const parts: string[] = [];

    if (value >= 100) {
      parts.push(`${ones[Math.floor(value / 100)]} Hundred`);
      value %= 100;
    }

    if (value >= 20) {
      parts.push(tens[Math.floor(value / 10)]);
      value %= 10;
    }

    if (value > 0) {
      parts.push(ones[value]);
    }

    return parts.join(" ");
  }

  function convert(value: number): string {
    const parts: string[] = [];

    if (value >= 1_000_000) {
      parts.push(
        `${convertBelowThousand(Math.floor(value / 1_000_000))} Million`,
      );
      value %= 1_000_000;
    }

    if (value >= 100_000) {
      parts.push(`${convertBelowThousand(Math.floor(value / 100_000))} Lakh`);
      value %= 100_000;
    }

    if (value >= 1_000) {
      parts.push(`${convertBelowThousand(Math.floor(value / 1_000))} Thousand`);
      value %= 1_000;
    }

    if (value > 0) {
      parts.push(convertBelowThousand(value));
    }

    return parts.join(" ");
  }

  return `${convert(number)} Pakistani Rupees Only`;
}
