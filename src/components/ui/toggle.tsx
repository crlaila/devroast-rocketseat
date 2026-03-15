import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      label,
      className,
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] =
      React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    const handleClick = () => {
      const next = !checked;
      if (!isControlled) setInternalChecked(next);
      onChange?.(next);
    };

    return (
      <div className={cn("flex items-center gap-3", className)}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={handleClick}
          className={cn(
            "relative flex items-center w-10 h-[22px] rounded-full p-[3px] transition-colors cursor-pointer border-0",
            checked ? "bg-[#22C55E]" : "bg-[#2A2A2A]",
          )}
        >
          <span
            className={cn(
              "block w-4 h-4 rounded-full transition-transform duration-200",
              checked
                ? "translate-x-[18px] bg-[#0A0A0A]"
                : "translate-x-0 bg-[#6B7280]",
            )}
          />
        </button>

        {label && (
          <span
            className={cn(
              "font-['JetBrains_Mono',monospace] text-[12px] font-normal",
              checked ? "text-[#22C55E]" : "text-[#6B7280]",
            )}
          >
            {label}
          </span>
        )}
      </div>
    );
  },
);
Toggle.displayName = "Toggle";

export { Toggle };
