
export function formatOpenDateTime(iso: string | null) {
  if (!iso) return { date: "-", time: "-" };
  const d = new Date(iso);
  return {
    date: new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Riyadh",
    }).format(d),
    time: new Intl.DateTimeFormat("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Riyadh",
    }).format(d),
  };
}