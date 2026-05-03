import * as React from "react";
import { LogOut, Sparkles, Users, Star, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { usePicks } from "@/hooks/usePicks";
import { initials } from "@/lib/utils";
import { ColorPicker } from "@/components/ColorPicker";
import { toast } from "sonner";

export function AppHeader({ nav }: { nav?: React.ReactNode }) {
  const { profile, signOut, saveProfile } = useAuth();
  const { profilesById, picks, myPickIds } = usePicks();

  const onColorChange = React.useCallback(
    async (color: string) => {
      if (!profile) return;
      try {
        await saveProfile({ display_name: profile.display_name, color });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not update color");
      }
    },
    [profile, saveProfile],
  );

  const friends = React.useMemo(
    () =>
      Object.values(profilesById)
        .filter((p) => p.id !== profile?.id)
        .sort((a, b) => a.display_name.localeCompare(b.display_name)),
    [profilesById, profile],
  );

  const totalFriends = friends.length;

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 py-4 glass border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {nav && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/40 hover:bg-card/70 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56">
                {nav}
              </PopoverContent>
            </Popover>
          )}
          <div className="hidden sm:flex h-10 w-10 rounded-full bg-gradient-to-br from-primary via-pink-500 to-orange-400 items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-extrabold gradient-text leading-tight truncate">
              Awakenings 2026
            </h1>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider truncate">
              July 10–12 · Friends Schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1.5">
            <Star className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold">{myPickIds.size}</span>
            <span className="text-xs text-muted-foreground">picks</span>
            <span className="mx-1 text-muted-foreground">·</span>
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold">{totalFriends}</span>
            <span className="text-xs text-muted-foreground">friends</span>
            <span className="mx-1 text-muted-foreground">·</span>
            <span className="text-xs font-semibold">{picks.length}</span>
            <span className="text-xs text-muted-foreground">total</span>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-full border border-border bg-card/40 hover:bg-card/70 transition-colors px-2 py-1.5"
                aria-label="Account menu"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback style={{ background: profile?.color }}>
                    {initials(profile?.display_name ?? "?")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold pr-1 max-w-[7ch] sm:max-w-[14ch] truncate">
                  {profile?.display_name}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback style={{ background: profile?.color }}>
                    {initials(profile?.display_name ?? "?")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{profile?.display_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {myPickIds.size} picks
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-3 mb-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                  Your color
                </div>
                {profile && (
                  <ColorPicker
                    value={profile.color}
                    onChange={onColorChange}
                    swatchSize="sm"
                  />
                )}
              </div>
              <div className="border-t border-border pt-3 mb-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                  Friends ({totalFriends})
                </div>
                {friends.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No friends yet — share the link.</p>
                ) : (
                  <ul className="space-y-1.5 max-h-48 overflow-auto pr-1">
                    {friends.map((f) => (
                      <li key={f.id} className="flex items-center gap-2 text-sm">
                        <span
                          className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ background: f.color }}
                        >
                          {initials(f.display_name)}
                        </span>
                        <span className="truncate">{f.display_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => signOut()}
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
