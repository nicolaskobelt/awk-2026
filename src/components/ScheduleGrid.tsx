import * as React from "react";
import {
  computeDayRange,
  fmtTime,
  SETS_BY_DAY,
  STAGE_COLORS,
  stagesForDay,
  type Day,
} from "@/data/schedule";
import { SetBlock } from "@/components/SetBlock";
import { cn } from "@/lib/utils";

interface ScheduleGridProps {
  day: Day;
  searchQuery: string;
  filter: "all" | "mine" | string; // "all", "mine", or a friend's user_id
  picksBySet: Record<string, string[]>;
  highlightUserId?: string;
}

export function ScheduleGrid({
  day,
  searchQuery,
  filter,
  picksBySet,
  highlightUserId,
}: ScheduleGridProps) {
  const stages = stagesForDay(day);
  const { start: rangeStart, end: rangeEnd } = computeDayRange(day);
  const totalRows = (rangeEnd - rangeStart) / 15;
  const sets = SETS_BY_DAY[day];

  const isMobile = useIsMobile();
  const rowH = isMobile ? 20 : 22;
  const timeColW = isMobile ? 46 : 70;
  const stageMinW = isMobile ? 96 : 140;

  const q = searchQuery.toLowerCase().trim();

  return (
    <div className="rounded-2xl border border-border glass overflow-hidden">
      <div className="grid-scroll overflow-auto max-h-[calc(100dvh-280px)] sm:max-h-[calc(100dvh-220px)] min-h-[420px]">
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: `${timeColW}px repeat(${stages.length}, minmax(${stageMinW}px, 1fr))`,
            gridTemplateRows: `40px repeat(${totalRows}, ${rowH}px)`,
          }}
        >
          <div
            className="sticky top-0 left-0 z-30 bg-card/95 backdrop-blur border-b border-r border-border text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-center"
            style={{ gridRow: 1, gridColumn: 1 }}
          >
            TIME
          </div>

          {stages.map((stage, i) => (
            <div
              key={stage}
              className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b border-border flex items-center justify-center"
              style={{ gridRow: 1, gridColumn: i + 2 }}
            >
              <span
                className="text-[11px] sm:text-xs font-extrabold tracking-[0.18em]"
                style={{ color: STAGE_COLORS[stage] }}
              >
                {stage}
              </span>
            </div>
          ))}

          {Array.from({ length: totalRows }, (_, r) => {
            const minute = rangeStart + r * 15;
            const isHour = minute % 60 === 0;
            return (
              <React.Fragment key={r}>
                <div
                  className={cn(
                    "sticky left-0 z-10 bg-card/90 backdrop-blur border-r border-border text-right pr-2",
                    "font-mono text-[10px] sm:text-[11px] tabular-nums",
                    isHour ? "text-foreground font-semibold border-t border-border/80" : "text-muted-foreground",
                  )}
                  style={{
                    gridRow: r + 2,
                    gridColumn: 1,
                    lineHeight: `${rowH}px`,
                    height: rowH,
                  }}
                >
                  {isHour ? fmtTime(minute) : ""}
                </div>
                {stages.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "border-r border-white/[0.03]",
                      isHour
                        ? "border-b border-white/10"
                        : "border-b border-dashed border-white/[0.04]",
                    )}
                    style={{
                      gridRow: r + 2,
                      gridColumn: i + 2,
                      height: rowH,
                    }}
                  />
                ))}
              </React.Fragment>
            );
          })}

          {sets.map((s) => {
            const stageIdx = stages.indexOf(s.stage);
            const matchesSearch = !q || s.name.toLowerCase().includes(q);
            const goers = picksBySet[s.id] ?? [];
            let matchesFilter = true;
            if (filter === "mine") matchesFilter = !!highlightUserId && goers.includes(highlightUserId);
            else if (filter !== "all") matchesFilter = goers.includes(filter);
            const dimmed = !matchesSearch || !matchesFilter;
            return (
              <SetBlock
                key={s.id}
                set={s}
                rangeStart={rangeStart}
                columnIndex={stageIdx}
                dimmed={dimmed}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 640px)").matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}
