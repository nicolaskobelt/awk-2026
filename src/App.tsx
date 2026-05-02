import * as React from "react";
import { Search, Users, Star, Sparkles, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { usePicks } from "@/hooks/usePicks";
import { AuthProvider } from "@/hooks/useAuth";
import { PicksProvider } from "@/hooks/usePicks";
import { AuthGate } from "@/components/AuthGate";
import { Onboarding } from "@/components/Onboarding";
import { AppHeader } from "@/components/AppHeader";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import { DAYS, type Day } from "@/data/schedule";
import { cn, initials } from "@/lib/utils";

function AppShell() {
  const [day, setDay] = React.useState<Day>("FRIDAY");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "mine" | string>("all");

  const { user, profile } = useAuth();
  const { profilesById, picksBySet } = usePicks();

  const friends = React.useMemo(
    () =>
      Object.values(profilesById)
        .filter((p) => p.id !== profile?.id)
        .sort((a, b) => a.display_name.localeCompare(b.display_name)),
    [profilesById, profile],
  );

  const activeFriend =
    filter !== "all" && filter !== "mine" ? profilesById[filter] : null;

  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
        <Tabs value={day} onValueChange={(v) => setDay(v as Day)}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <TabsList>
              {DAYS.map((d) => (
                <TabsTrigger key={d} value={d}>
                  {d}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artist…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <Button
                variant={filter === "mine" ? "accent" : "outline"}
                size="sm"
                onClick={() => setFilter(filter === "mine" ? "all" : "mine")}
                aria-pressed={filter === "mine"}
              >
                <Star className={cn("h-3.5 w-3.5", filter === "mine" && "fill-white")} />
                <span className="hidden sm:inline">My picks</span>
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={activeFriend ? "accent" : "outline"}
                    size="sm"
                    aria-label="Filter by friend"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                      {activeFriend ? activeFriend.display_name : "Friend"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                    Show picks by…
                  </div>
                  <button
                    onClick={() => setFilter("all")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-lg hover:bg-card text-sm transition-colors",
                      filter === "all" && "bg-card",
                    )}
                  >
                    Everyone
                  </button>
                  {friends.length === 0 ? (
                    <p className="text-xs text-muted-foreground mt-2 px-2">
                      No friends signed up yet.
                    </p>
                  ) : (
                    <ul className="max-h-64 overflow-auto mt-1 pr-1">
                      {friends.map((f) => (
                        <li key={f.id}>
                          <button
                            onClick={() => setFilter(f.id)}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors hover:bg-card",
                              filter === f.id && "bg-card",
                            )}
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarFallback
                                style={{ background: f.color }}
                                className="text-[10px]"
                              >
                                {initials(f.display_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate flex-1 text-left">
                              {f.display_name}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Tabs>

        {activeFriend && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/40 border border-border rounded-full px-3 py-1.5 w-fit">
            <Sparkles className="h-3 w-3 text-accent" />
            Highlighting <span className="text-foreground font-semibold">{activeFriend.display_name}</span>'s picks
            <button onClick={() => setFilter("all")} aria-label="Clear filter">
              <X className="h-3 w-3 hover:text-foreground" />
            </button>
          </div>
        )}

        <ScheduleGrid
          day={day}
          searchQuery={searchQuery}
          filter={filter}
          picksBySet={picksBySet}
          highlightUserId={user?.id}
        />

        <p className="text-xs text-muted-foreground text-center pt-2">
          Tap any block to add it to your schedule and see who else is going.
        </p>
      </main>
    </div>
  );
}

function Gate() {
  const { loading, user, profile } = useAuth();
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return <AuthGate />;
  if (!profile) return <Onboarding />;
  return (
    <PicksProvider>
      <AppShell />
    </PicksProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
      <Toaster />
    </AuthProvider>
  );
}
