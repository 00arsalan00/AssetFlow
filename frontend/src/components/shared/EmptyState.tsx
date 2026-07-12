import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { scaleIn } from "@/lib/motion";

export type IllustrationVariant =
  | "assets"
  | "bookings"
  | "maintenance"
  | "notifications"
  | "search"
  | "reports"
  | "settings";

interface IllustrationProps {
  variant: IllustrationVariant;
  className?: string;
}

export function Illustration({ variant, className = "w-48 h-48" }: IllustrationProps) {
  const gradients: Record<IllustrationVariant, [string, string]> = {
    assets: ["#7C3AED", "#A78BFA"],
    bookings: ["#3B82F6", "#60A5FA"],
    maintenance: ["#F59E0B", "#FBBF24"],
    notifications: ["#8B5CF6", "#C4B5FD"],
    search: ["#6366F1", "#818CF8"],
    reports: ["#10B981", "#34D399"],
    settings: ["#64748B", "#94A3B8"],
  };

  const [c1, c2] = gradients[variant];

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="100" cy="100" r="80" fill={`url(#grad-${variant})`} opacity="0.12" />
      <circle cx="100" cy="100" r="60" fill={`url(#grad-${variant})`} opacity="0.08" />
      {variant === "assets" && (
        <>
          <rect x="55" y="70" width="90" height="65" rx="8" fill="white" stroke={c1} strokeWidth="2" />
          <rect x="65" y="80" width="70" height="8" rx="2" fill={c2} opacity="0.4" />
          <rect x="65" y="95" width="50" height="6" rx="2" fill={c1} opacity="0.3" />
          <rect x="65" y="108" width="60" height="6" rx="2" fill={c1} opacity="0.2" />
          <circle cx="130" cy="55" r="18" fill={c1} opacity="0.9" />
          <path d="M124 55 L128 59 L136 51" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {variant === "bookings" && (
        <>
          <rect x="50" y="55" width="100" height="90" rx="10" fill="white" stroke={c1} strokeWidth="2" />
          <rect x="50" y="55" width="100" height="24" rx="10" fill={c1} opacity="0.15" />
          <circle cx="70" cy="95" r="6" fill={c2} />
          <rect x="82" y="90" width="55" height="6" rx="2" fill={c1} opacity="0.3" />
          <circle cx="70" cy="115" r="6" fill={c2} opacity="0.5" />
          <rect x="82" y="110" width="40" height="6" rx="2" fill={c1} opacity="0.2" />
        </>
      )}
      {variant === "maintenance" && (
        <>
          <circle cx="100" cy="100" r="35" fill="white" stroke={c1} strokeWidth="2" />
          <path d="M100 75 L100 100 L118 118" stroke={c1} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="4" fill={c1} />
          <rect x="130" y="60" width="30" height="8" rx="4" fill={c2} transform="rotate(45 145 64)" />
        </>
      )}
      {variant === "notifications" && (
        <>
          <path d="M100 55 C85 55 75 68 75 85 L75 110 L65 120 L135 120 L125 110 L125 85 C125 68 115 55 100 55Z" fill="white" stroke={c1} strokeWidth="2" />
          <circle cx="100" cy="130" r="8" fill={c1} />
          <circle cx="130" cy="65" r="10" fill={c2} />
          <text x="130" y="69" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">3</text>
        </>
      )}
      {variant === "search" && (
        <>
          <circle cx="95" cy="95" r="30" fill="white" stroke={c1} strokeWidth="2.5" />
          <line x1="118" y1="118" x2="140" y2="140" stroke={c1} strokeWidth="4" strokeLinecap="round" />
          <circle cx="95" cy="95" r="15" fill={c2} opacity="0.2" />
        </>
      )}
      {variant === "reports" && (
        <>
          <rect x="55" y="120" width="20" height="40" rx="3" fill={c2} />
          <rect x="85" y="95" width="20" height="65" rx="3" fill={c1} />
          <rect x="115" y="75" width="20" height="85" rx="3" fill={c2} opacity="0.6" />
          <path d="M55 75 Q100 55 145 65" stroke={c1} strokeWidth="2" fill="none" strokeDasharray="4 4" />
        </>
      )}
      {variant === "settings" && (
        <>
          <circle cx="100" cy="100" r="28" fill="white" stroke={c1} strokeWidth="2" />
          <circle cx="100" cy="100" r="12" fill={c2} opacity="0.3" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <circle
              key={angle}
              cx={100 + 38 * Math.cos((angle * Math.PI) / 180)}
              cy={100 + 38 * Math.sin((angle * Math.PI) / 180)}
              r="6"
              fill={c1}
              opacity="0.7"
            />
          ))}
        </>
      )}
      <defs>
        <linearGradient id={`grad-${variant}`} x1="0" y1="0" x2="200" y2="200">
          <stop stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface EmptyStateProps {
  variant: IllustrationVariant;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ variant, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <Illustration variant={variant} className="w-40 h-40 sm:w-48 sm:h-48 mb-6" />
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
