import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './app';

describe('tasks API', () => {
  it('rejects a task with no title', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
  });

  it('creates, updates, and deletes a task', async () => {
    const created = await request(app).post('/tasks').send({ title: 'write tests' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ title: 'write tests', done: false });

    const id = created.body.id;

    const listed = await request(app).get('/tasks');
    expect(listed.body).toContainEqual(created.body);

    const updated = await request(app).put(`/tasks/${id}`).send({ done: true });
    expect(updated.status).toBe(200);
    expect(updated.body.done).toBe(true);

    const deleted = await request(app).delete(`/tasks/${id}`);
    expect(deleted.status).toBe(204);

    const missing = await request(app).get(`/tasks/${id}`);
    expect(missing.status).toBe(404);
  });
});
