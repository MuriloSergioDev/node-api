import express, { Request, Response } from 'express';
import { Task, TaskCreate, TaskUpdate } from './types';

export const app = express();
app.use(express.json());

const tasks: Record<number, Task> = {};
let nextId = 1;

app.get('/tasks', (req: Request, res: Response) => {
  res.json(Object.values(tasks));
});

app.get('/tasks/:id', (req: Request, res: Response) => {
  const task = tasks[Number(req.params.id)];
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.post('/tasks', (req: Request<Record<string, never>, Task, TaskCreate>, res: Response) => {
  const { title, done } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required and must be a string' });
  }

  const task: Task = { id: nextId++, title, done: Boolean(done) };
  tasks[task.id] = task;
  res.status(201).json(task);
});

app.put('/tasks/:id', (req: Request<{ id: string }, Task, TaskUpdate>, res: Response) => {
  const task = tasks[Number(req.params.id)];
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, done } = req.body;
  if (title !== undefined) {
    if (typeof title !== 'string') {
      return res.status(400).json({ error: 'title must be a string' });
    }
    task.title = title;
  }
  if (done !== undefined) task.done = Boolean(done);

  res.json(task);
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!(id in tasks)) return res.status(404).json({ error: 'Task not found' });

  delete tasks[id];
  res.status(204).send();
});
