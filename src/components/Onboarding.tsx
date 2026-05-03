import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/utils";
import { toast } from "sonner";
import { ColorPicker, COLOR_PRESETS } from "@/components/ColorPicker";

export function Onboarding() {
  const { saveProfile, signOut, user } = useAuth();
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState(COLOR_PRESETS[0]);
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await saveProfile({ display_name: name.trim().slice(0, 40), color });
      toast.success("Welcome aboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save profile",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md glass border border-border rounded-3xl p-8 shadow-2xl shadow-black/40">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Una cosita mas
        </p>
        <h1 className="text-3xl font-extrabold gradient-text leading-tight mb-2">
          Ponete un nombre y un color
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Asi tus amigos te ven en el cronograma. Estas logueado como{" "}
          <span className="text-foreground">{user?.email}</span>.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="display_name">Nombre</Label>
            <Input
              id="display_name"
              required
              autoFocus
              maxLength={40}
              placeholder="e.g. Pepe Navajas"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-4 flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white"
              style={{ background: color }}
            >
              {initials(name || "??")}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Vista previa
              </div>
              <div className="font-semibold">{name || "Tu nombre"}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => signOut()}
              className="flex-1"
            >
              Sign out
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={submitting || !name.trim()}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" /> Guardando...
                </>
              ) : (
                "Continuar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
