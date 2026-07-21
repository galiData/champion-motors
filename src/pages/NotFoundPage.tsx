import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="ltr-nums text-6xl font-bold text-cm-mist">404</p>
      <h1 className="text-3xl font-bold text-cm-deep-blue">הדף לא נמצא</h1>
      <p className="max-w-md text-base text-cm-slate">
        ייתכן שהדף הוסר או שהקישור שגוי. אפשר לחזור למרכז ולהמשיך משם.
      </p>
      <Link to="/" className={buttonVariants({ variant: "primary", size: "md" })}>
        חזרה למרכז
      </Link>
    </div>
  );
}
