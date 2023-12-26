import { StateCreator, create } from "zustand";
import type { Task, TaskStatus } from "../../interfaces";
import { devtools, persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
// import { produce } from "immer";
import { immer } from "zustand/middleware/immer";

interface TaskState {
  draggingTaskId?: string;
  tasks: Record<string, Task>;

  addTask: (title: string, status: TaskStatus) => void;
  getTaskByStatus: (status: TaskStatus) => Task[];
  setDraggingTaskId: (taskId: string) => void;
  removeDraggingTaskId: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;
}

const storeApi: StateCreator<TaskState, [["zustand/immer", unknown]]> = (
  set,
  get
) => ({
  draggingTaskId: undefined,
  tasks: {
    "ABC-1": { id: "ABC-1", title: "task1", status: "open" },
    "ABC-2": { id: "ABC-2", title: "task2", status: "in-progress" },
    "ABC-3": { id: "ABC-3", title: "task3", status: "open" },
    "ABC-4": { id: "ABC-4", title: "task4", status: "open" },
  },
  addTask: (title, status) => {
    const newTask = { id: uuid(), title, status };
    // set(
    //   produce((state: TaskState) => {
    //     state.tasks[newTask.id] = newTask;
    //   })
    // );
    // set(state => ({
    //   tasks: {
    //     ...state.tasks,
    //     [newTask.id]:newTask
    //   }
    // })).
    set((state) => {
      state.tasks[newTask.id] = newTask;
    });
  },
  getTaskByStatus: (status) => {
    return Object.values( get().tasks).filter((task) => task.status === status);
  },
  setDraggingTaskId: (taskId) => {
    set({ draggingTaskId: taskId });
  },
  removeDraggingTaskId: () => {
    set({ draggingTaskId: undefined });
  },
  changeTaskStatus: (taskId, status) => {
    const task = { ...get().tasks[taskId] }
    task.status = status
    set(state => {
      state.tasks[taskId] = {
        ...task
      }
    }
    );
  },
  onTaskDrop: (status) => {
    const taskId = get().draggingTaskId;
    if (!taskId) return;
    get().changeTaskStatus(taskId, status);
    get().removeDraggingTaskId();
  },
});

export const useTaskStore = create<TaskState>()(
  devtools(
    persist(
      immer(storeApi)
    ,{ name: 'task-store' })
  )
);
