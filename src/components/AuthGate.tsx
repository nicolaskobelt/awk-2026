import * as React from "react";
import { Mail, Loader2, Sparkles } from "lucide-react";
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
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-accent" />
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Awakenings 2026
          </p>
        </div>
        <h1 className="text-3xl font-extrabold gradient-text leading-tight mb-2">
          Plan it together.
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Sign in to pick the DJs you want to see, and discover which sets your friends are
          heading to.
        </p>

        {sent ? (
          <div className="rounded-2xl border border-border bg-card/40 p-6 text-center">
            <Mail className="mx-auto h-8 w-8 text-accent mb-3" />
            <p className="font-semibold mb-1">Check your inbox</p>
            <p className="text-sm text-muted-foreground">
              We sent a magic link to <span className="text-foreground">{email}</span>. Open it on
              this device to sign in.
            </p>
            <button
              type="button"
              className="mt-4 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              onClick={() => setSent(false)}
            >
              Use a different email
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
                placeholder="you@friend.com"
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
                  <Loader2 className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Mail /> Send magic link
                </>
              )}
            </Button>
          </form>
        )}

        <p className="text-[11px] text-muted-foreground mt-6 text-center">
          July 10–12 · Hilvarenbeek · for friends only
        </p>
      </div>
    </div>
  );
}
