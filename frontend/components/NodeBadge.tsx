"use client";

import { ENTITY_TYPE_LABELS, NODE_COLORS } from "@/lib/graph-utils";
import type { EntityType } from "@/types/graph";

interface NodeBadgeProps {
  type: EntityType;
  size?: "sm" | "md";
}

export function NodeBadge({ type, size = "md" }: NodeBadgeProps) {
  const color = NODE_COLORS[type];
  const label = ENTITY_TYPE_LABELS[type];

  const sizeClasses = size === "sm"
    ? "text-xs px-1.5 py-0.5"
    : "text-xs px-2 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-medium tracking-wide uppercase ${sizeClasses}`}
      style={{
        backgroundColor: `${color}22`,
        color: color,
        border: `1px solid ${color}44`,
      }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
