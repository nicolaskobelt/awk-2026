import * as React from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function AuthGate() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const { error } = await signInWithEmail(email.trim());
    setSubmitting(false);
    if (error) {
      toast.error(error);
      return;
    }
    setSent(true);
    toast.success("Magic link sent — check your email");
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md glass border border-border rounded-3xl p-8 shadow-2xl shadow-black/40">
        <h1 className="text-3xl font-extrabold gradient-text leading-tight mb-2">
          Hola falopeitor
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Pone tu email para entrar.
        </p>

        {sent ? (
          <div className="rounded-2xl border border-border bg-card/40 p-6 text-center">
            <Mail className="mx-auto h-8 w-8 text-accent mb-3" />
            <p className="font-semibold mb-1">Mira tu email</p>
            <p className="text-sm text-muted-foreground">
              Te mande un link a{" "}
              <span className="text-foreground">{email}</span>. Abrilo en este
              dispositivo para entrar.
            </p>
            <button
              type="button"
              className="mt-4 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              onClick={() => setSent(false)}
            >
              Soy falopeitor y me confundi de email
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoFocus
                placeholder="tuvieja@tuvi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Mail /> Mandame el link
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
