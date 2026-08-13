import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { dayStatus, todayKey } from "@/lib/tasks";
import { cn } from "@/lib/utils";

export function ConsistencyMap({ tasks, progress, days = 35 }) {
  const cells = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push({
        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
        label: d.getDate(),
      });
    }
    return arr;
  }, [days]);

  const currentKey = todayKey();

  return (
    <div className="rounded-2xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Consistency map</h3>
          <p className="text-xs text-muted-foreground">Last {days} days</p>
        </div>
        <Legend />
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2 sm:grid-cols-10 md:grid-cols-[repeat(14,minmax(0,1fr))]">
        {cells.map((cell) => {
          const status = dayStatus(tasks, progress, cell.date);
          const isToday = cell.date === currentKey;
          return (
            <div
              key={cell.date}
              title={`${cell.date} — ${status}`}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-lg text-[10px] font-medium transition-colors",
                status === "none" && "bg-muted text-muted-foreground/60",
                status === "empty" && "bg-muted text-muted-foreground/70",
                status === "low" && "bg-danger-soft text-danger",
                status === "mid" && "bg-warning-soft text-warning-foreground",
                status === "high" && "bg-success-soft text-success-foreground",
                isToday && "ring-2 ring-foreground/70 ring-offset-2 ring-offset-card",
              )}
            >
              {status === "high" ? (
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              ) : status === "low" ? (
                <X className="h-3.5 w-3.5" strokeWidth={3} />
              ) : (
                <span>{cell.label}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    { label: "None", cls: "bg-muted" },
    { label: "< half", cls: "bg-danger-soft" },
    { label: "> half", cls: "bg-warning-soft" },
    { label: "All", cls: "bg-success-soft" },
  ];
  return (
    <div className="flex items-center gap-2">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-1.5">
          <span className={cn("h-3 w-3 rounded-sm", i.cls)} />
          <span className="text-[10px] text-muted-foreground">{i.label}</span>
        </div>
      ))}
    </div>
  );
}
