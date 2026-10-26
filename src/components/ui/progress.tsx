import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({
  value = 0,
  className,
  indicatorClassName,
}: {
  value?: number;
  className?: string;
  indicatorClassName?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <ProgressPrimitive.Root
      value={pct}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-border",
        className,
      )}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "size-full bg-accent transition-transform duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)]",
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
