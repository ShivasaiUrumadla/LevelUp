// import { Sparkles } from "lucide-react";
// import { AddTaskDialog } from "@/components/AddTaskDialog";
// import { ConsistencyMap } from "@/components/ConsistencyMap";
// import { TaskCard } from "@/components/TaskCard";
// import { todayKey, useTasksStore } from "@/lib/tasks";

export default function App() {
  // const {
  //   hydrated,
  //   tasks,
  //   progress,
  //   addTask,
  //   removeTask,
  //   incrementProgress,
  //   markDone,
  // } = useTasksStore();
  // console.log("tasks", tasks);
  // const today = todayKey();
  // // const todayEntries = progress[today] ?? {};
  // // const completedCount = tasks.filter(
  // //   (t) => (todayEntries[t.id] ?? 0) >= t.target,
  // // ).length;

  // const now = new Date();
  // const dateLabel = now.toLocaleDateString(undefined, {
  //   weekday: "long",
  //   month: "long",
  //   day: "numeric",
  // });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
        <header className="flex flex-row items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {dateLabel}
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Today
            </h1>
            <p className="mt-2 text-muted-foreground">
              {tasks.length == 0
                ? "Add your first daily task to get started."
                : `${completedCount} of ${tasks.length} done — keep the streak going.`}
            </p>
          </div>
          <div className="shrink-0 pt-6">
            <AddTaskDialog onAdd={addTask} />
          </div>
        </header>

        <section className="mt-10">
          {hydrated && tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  value={todayEntries[task.id] ?? 0}
                  onIncrement={() => incrementProgress(task.id, 1)}
                  onDecrement={() => incrementProgress(task.id, -1)}
                  onMarkDone={() => markDone(task.id, task.target)}
                  onDelete={() => removeTask(task.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <ConsistencyMap tasks={tasks} progress={progress} />
        </section>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Saved locally on this device.
        </footer>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success-foreground">
        <Sparkles className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Start small, stay consistent
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a task like "Read a book" with a daily target of 3 pages.
      </p>
    </div>
  );
}
