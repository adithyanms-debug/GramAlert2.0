import { statusColors } from "../utils/statusColors";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = (status || "").toLowerCase();
  const style = statusColors[normalized] || "bg-gray-100 text-gray-600";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {status || "Pending"}
    </span>
  );
}
