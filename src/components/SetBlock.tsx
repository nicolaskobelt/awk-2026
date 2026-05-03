import * as React from "react";
import { Star, Users, X } from "lucide-react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  STAGE_COLORS,
  type Set as DjSet,
  setRange,
} from "@/data/schedule";
import { usePicks } from "@/hooks/usePicks";
import { useAuth, type Profile } from "@/hooks/useAuth";
import { cn, initials } from "@/lib/utils";

interface SetBlockProps {
  set: DjSet;
  rangeStart: number;
  columnIndex: number; // 0-based stage column
  dimmed?: boolean;
}

export function SetBlock({ set, rangeStart, columnIndex, dimmed }: SetBlockProps) {
  const { picksBySet, profilesById, togglePick } = usePicks();
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const userIds = picksBySet[set.id] ?? [];
  const friendsGoing: Profile[] = userIds
    .map((id) => profilesById[id])
    .filter(Boolean) as Profile[];
  const isFav = !!user && userIds.includes(user.id);
  const others = friendsGoing.filter((p) => p.id !== user?.id);

  const { sm, em } = setRange(set);
  const startRow = (sm - rangeStart) / 15 + 2;
  const span = (em - sm) / 15;
  const color = STAGE_COLORS[set.stage];

  const visibleChips = others.slice(0, 3);
  const overflow = others.length - visibleChips.length;

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${set.name} — ${set.start} to ${set.end}`}
          className={cn(
            "group absolute-grid-block relative overflow-hidden rounded-md text-left",
            "transition-[transform,box-shadow,opacity] duration-150",
            "border border-white/15 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/40 hover:z-20",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isFav && "ring-2 ring-inset ring-accent shadow-[0_0_18px_hsla(47,100%,64%,0.45)]",
            dimmed && "opacity-20",
          )}
          style={{
            gridColumn: `${columnIndex + 2}`,
            gridRow: `${startRow} / span ${span}`,
            background: `linear-gradient(135deg, ${color}dd, ${color}99)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
          <div className="relative h-full flex flex-col gap-1 p-1.5 sm:p-2 text-white">
            <div className="flex items-start justify-between gap-1">
              <div className="text-[10px] sm:text-[11px] font-mono opacity-85 leading-none">
                {set.start}
              </div>
              {isFav && (
                <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300 drop-shadow" />
              )}
            </div>
            <div className="text-[11px] sm:text-[13px] font-extrabold leading-[1.1] break-words">
              {set.name}
            </div>
            {others.length > 0 && (
              <div className="mt-auto flex items-center gap-1 pt-1">
                <div className="flex -space-x-1.5">
                  {visibleChips.map((p) => (
                    <span
                      key={p.id}
                      title={p.display_name}
                      className="h-5 w-5 rounded-full ring-2 ring-black/30 flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: p.color }}
                    >
                      {initials(p.display_name)}
                    </span>
                  ))}
                </div>
                {overflow > 0 && (
                  <span className="text-[10px] font-semibold opacity-90">
                    +{overflow}
                  </span>
                )}
              </div>
            )}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" onOpenAutoFocus={(e) => e.preventDefault()}>
        <PopoverClose
          aria-label="Close"
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </PopoverClose>
        <div className="flex items-start justify-between gap-2 mb-1 pr-8">
          <div className="min-w-0">
            <div
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ background: `${color}33`, color }}
            >
              {set.stage}
            </div>
            <h3 className="font-extrabold text-base leading-tight break-words">
              {set.name}
            </h3>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {set.day} · {set.start} – {set.end}
            </p>
          </div>
        </div>

        <Button
          onClick={() => togglePick(set.id)}
          variant={isFav ? "outline" : "accent"}
          size="sm"
          className="w-full mt-3"
        >
          <Star className={cn("h-3.5 w-3.5", isFav && "fill-accent text-accent")} />
          {isFav ? "Remove from my schedule" : "Add to my schedule"}
        </Button>

        <div className="border-t border-border mt-4 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            <Users className="h-3 w-3" />
            {friendsGoing.length === 0
              ? "Nobody going yet"
              : `${friendsGoing.length} going`}
          </div>
          {friendsGoing.length > 0 && (
            <ul className="space-y-1.5 max-h-44 overflow-auto pr-1">
              {friendsGoing.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: p.color }}
                  >
                    {initials(p.display_name)}
                  </span>
                  <span className="truncate">
                    {p.display_name}
                    {p.id === user?.id && (
                      <span className="text-muted-foreground"> (you)</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
