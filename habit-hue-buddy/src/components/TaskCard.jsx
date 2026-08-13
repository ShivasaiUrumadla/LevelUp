import { Check, Eye, Minus, Plus, TrendingUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TaskCard({ task, value, onIncrement, onDecrement, onMarkDone, onDelete ,load}) {
  const completed = value >= task.target;
  // const delta = value - task.target;
  // const deltaLabel = delta >= 0 ? `+${delta}` : `${delta}`;

  return (
    <div

      className={cn(
        "group relative rounded-2xl bg-card p-6 shadow-card transition-all",
        "hover:-translate-y-0.5 hover:shadow-lg",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <p>{task.title}</p>
          
        </span>
        <button onClick={onDelete}
          
          aria-label="Delete task"
          className="text-muted-foreground  transition-opacity hover:text-danger group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-5xl font-bold tracking-tight tabular-nums text-foreground">
          {value}
        </span>
        <span className="text-lg font-medium text-muted-foreground">{task.unit}</span>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        
      </p>

      <div className="mt-5 flex items-center justify-between">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold",
            completed
              ? "bg-success-soft text-success-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          <span className="tabular-nums"></span>
          <TrendingUp className="h-3.5 w-3.5" />
        </div> 

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onDecrement} aria-label="Decrement" className="h-8 w-8 rounded-full">
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onIncrement} aria-label="Increment" className="h-8 w-8 rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
          {/* <Button
            variant={completed ? "default" : "outline"}
            size="icon"
            
            aria-label={completed ? "Undo done" : "Mark done"}
            className={cn(
              "h-8 w-8 rounded-full",
              completed && "bg-success text-success-foreground hover:bg-success/90",
            )}
          >
            {completed ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button> */}
        </div>
      </div>
    </div>
  );
}
