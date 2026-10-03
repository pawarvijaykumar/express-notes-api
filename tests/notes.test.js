process.env.JWT_SECRET = 'test-secret-key';

jest.mock('../models/Note');
const Note = require('../models/Note');
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

// CONCEPT: real login karne ki jagah, seedha ek valid token "generate" kar lete
// hain test ke liye - kyunki humein sirf ye test karna hai ki NOTES routes sahi
// kaam karte hain, auth system already alag se tested hai.
const fakeToken = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET);

describe('Notes routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /notes without token returns 401', async () => {
    const res = await request(app).get('/api/v1/notes');
    expect(res.status).toBe(401);
  });

  test('GET /notes with valid token returns notes list', async () => {
    Note.find.mockResolvedValue([{ _id: 'n1', text: 'note 1', user: 'user123' }]);

    const res = await request(app)
      .get('/api/v1/notes')
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('POST /notes without text returns 400', async () => {
    const res = await request(app)
      .post('/api/v1/notes')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({});

    expect(res.status).toBe(400);
  });

  test('POST /notes with valid text returns 201', async () => {
    Note.create.mockResolvedValue({ _id: 'n1', text: 'new note', user: 'user123' });

    const res = await request(app)
      .post('/api/v1/notes')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ text: 'new note' });

    expect(res.status).toBe(201);
    expect(res.body.text).toBe('new note');
  });

  test('DELETE /notes/:id when note does not exist returns 404', async () => {
    Note.findOneAndDelete.mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/v1/notes/someid123')
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.status).toBe(404);
  });

  test('PUT /notes/:id updates successfully returns 200', async () => {
    Note.findOneAndUpdate.mockResolvedValue({ _id: 'n1', text: 'updated', user: 'user123' });

    const res = await request(app)
      .put('/api/v1/notes/n1')
      .set('Authorization', `Bearer ${fakeToken}`)
      .send({ text: 'updated' });

    expect(res.status).toBe(200);
    expect(res.body.text).toBe('updated');
  });
});
