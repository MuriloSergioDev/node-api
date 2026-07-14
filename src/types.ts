export interface Task {
  id: number;
  title: string;
  done: boolean;
}

export interface TaskCreate {
  title: string;
  done?: boolean;
}

export type TaskUpdate = Partial<Pick<Task, 'title' | 'done'>>;
