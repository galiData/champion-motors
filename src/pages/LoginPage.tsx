import { Navigate, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/**
 * Sign-in shell. There is no real credential check yet — submitting signs in the
 * mock employee. Swapping in real authentication touches `AuthProvider.signIn`
 * and this handler only.
 */
export function LoginPage() {
  const { isAuthenticated, signIn } = useCurrentUser();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn();
    navigate("/", { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cm-navy p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8">
        <div className="mb-8 flex flex-col gap-1">
          <p className="text-sm font-semibold text-cm-blue">צ'מפיון מוטורס</p>
          <h1 className="text-3xl font-bold text-cm-deep-blue">פורטל עובדים</h1>
          <p className="text-base text-cm-slate">כניסה עם חשבון החברה שלכם.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-cm-graphite">
              דואר אלקטרוני
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              dir="ltr"
              autoComplete="username"
              placeholder="name@championmotors.co.il"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-cm-graphite">
              סיסמה
            </label>
            <Input id="password" type="password" name="password" autoComplete="current-password" />
          </div>

          <Button type="submit" className="mt-2 w-full">
            כניסה
          </Button>
        </form>
      </div>
    </main>
  );
}
