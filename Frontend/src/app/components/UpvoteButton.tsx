import { useState } from "react";

interface UpvoteButtonProps {
  grievanceId: string | number;
  upvoteCount: number;
  hasUpvoted: boolean;
  onVote: (grievanceId: string | number) => Promise<void> | void;
}

export default function UpvoteButton({
  grievanceId,
  upvoteCount,
  hasUpvoted,
  onVote,
}: UpvoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false);

  const handleClick = async () => {
    if (isVoting) return;
    setIsVoting(true);
    try {
      await onVote(grievanceId);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isVoting}
      title="Support this grievance"
      className={`
        flex flex-col items-center justify-center
        w-12 min-h-[3.25rem]
        px-2 py-2
        rounded-lg border
        transition-all duration-200
        active:scale-95 select-none
        ${
          hasUpvoted
            ? "bg-blue-50 border-blue-300 text-blue-600 shadow-sm shadow-blue-100"
            : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 hover:scale-105"
        }
        ${isVoting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* Heroicons-style chevron-up / arrow-up */}
      <svg
        className={`w-4 h-4 transition-colors duration-200 ${
          hasUpvoted ? "text-blue-600" : "text-gray-400"
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 4.94l-5.53 5.53a.75.75 0 01-1.06-1.06l6.25-6.25a.75.75 0 011.06 0l6.25 6.25a.75.75 0 11-1.06 1.06L10 4.94z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-xs font-semibold leading-tight tabular-nums">
        {upvoteCount}
      </span>
    </button>
  );
}
