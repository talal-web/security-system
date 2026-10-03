import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => query.append(key, entry));
    } else if (value !== undefined) {
      query.set(key, value);
    }
  }

  const queryString = query.toString();
  redirect(`/employees/view${queryString ? `?${queryString}` : ""}`);
}
