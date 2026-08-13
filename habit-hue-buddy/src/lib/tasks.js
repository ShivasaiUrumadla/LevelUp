// import { useCallback, useEffect, useState } from "react";


// const TASKS_KEY = "todo:tasks";
// const PROGRESS_KEY = "todo:progress";

// export function todayKey(d = new Date()) {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

// // function read(key, fallback) {
// //   if (typeof window === "undefined") return fallback;
// //   try {
// //     const raw = window.localStorage.getItem(key);
// //     return raw ? JSON.parse(raw) : fallback;
// //   } catch {
// //     return fallback;
// //   }
// // }

// // function write(key, val) {
// //   if (typeof window === "undefined") return;
// //   window.localStorage.setItem(key, JSON.stringify(val));
// // }

// export function useTasksStore() {
//   const [hydrated, setHydrated] = useState(false);
//   const [tasks, setTasks] = useState([]);
//   const [progress, setProgress] = useState({});

//   useEffect(() => {
//     fetch("http://127.0.0.1:5000/tasks")
//       .then(res => res.json())
//       .then(data => {
//         setTasks(data.tasks);
//         setProgress(data.progress);
//       })

//     setHydrated(true);
//   }, []);
//   console.log("tasks", tasks);
//   console.log("progress", progress);

//   // useEffect(() => {
//   //   if (hydrated) write(TASKS_KEY, tasks);
//   // }, [tasks, hydrated]);

//   // useEffect(() => {
//   //   if (hydrated) write(PROGRESS_KEY, progress);
//   // }, [progress, hydrated]);

//   // const addTask = useCallback((t) => {
//   //   setTasks((prev) => [
//   //     ...prev,
//   //     { ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
//   //   ]);
//   // }, []);

//   // const removeTask = useCallback((id) => {
//   //   setTasks((prev) => prev.filter((t) => t.id !== id));
//   //   setProgress((prev) => {
//   //     const next = {};
//   //     for (const [date, entries] of Object.entries(prev)) {
//   //       const { [id]: _drop, ...rest } = entries;
//   //       next[date] = rest;
//   //     }
//   //     return next;
//   //   });
//   // }, []);

//   // const setProgressValue = useCallback((taskId, value, date = todayKey()) => {
//   //   setProgress((prev) => ({
//   //     ...prev,
//   //     [date]: { ...(prev[date] ?? {}), [taskId]: Math.max(0, value) },
//   //   }));
//   // }, []);

//   // const incrementProgress = useCallback((taskId, delta = 1, date = todayKey()) => {
//   //   setProgress((prev) => {
//   //     const current = prev[date]?.[taskId] ?? 0;
//   //     return {
//   //       ...prev,
//   //       [date]: { ...(prev[date] ?? {}), [taskId]: Math.max(0, current + delta) },
//   //     };
//   //   });
//   // }, []);

//   // const markDone = useCallback((taskId, target, date = todayKey()) => {
//   //   setProgress((prev) => {
//   //     const current = prev[date]?.[taskId] ?? 0;
//   //     const next = current >= target ? 0 : target;
//   //     return {
//   //       ...prev,
//   //       [date]: { ...(prev[date] ?? {}), [taskId]: next },
//   //     };
//   //   });
//   // }, []);

//   return {
//     hydrated,
//     tasks,
//     progress
//     // addTask,
//     // removeTask,
//     // setProgressValue,
//     // incrementProgress,
//     // markDone,
//   };
// }

// export function dayStatus(tasks, progress, date) {
//   if (tasks.length === 0) return "none";
//   const dayEntries = progress[date] ?? {};
//   const completed = tasks.filter((t) => (dayEntries[t.id] ?? 0) >= t.target).length;
//   if (completed === 0) return "empty";
//   const ratio = completed / tasks.length;
//   if (ratio >= 1) return "high";
//   if (ratio > 0.5) return "mid";
//   return "low";
// }
