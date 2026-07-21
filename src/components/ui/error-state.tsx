import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/** Errors pair the Signal Red icon with text — never color alone. */
export function ErrorState({
  title = "לא הצלחנו לטעון את הנתונים",
  description = "אירעה תקלה זמנית. אפשר לנסות שוב, ואם התקלה חוזרת נשמח שתפנו לתמיכה.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center gap-3 px-6 py-16 text-center", className)}
    >
      <AlertCircle className="size-10 text-cm-red" aria-hidden="true" />
      <p className="text-lg font-semibold text-cm-deep-blue">{title}</p>
      <p className="max-w-md text-base text-cm-slate">{description}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          נסו שוב
        </Button>
      ) : null}
    </div>
  );
}
