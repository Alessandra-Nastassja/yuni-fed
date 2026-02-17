import { App } from '@tinyhttp/app';
import { cors } from '@tinyhttp/cors';
import { json } from 'milliparsec';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const PORT = 3001;
const adapter = new JSONFile('db.json');
const db = new Low(adapter, {});

const app = new App();

app.use(cors());
app.use(json());

const readDb = async () => {
  await db.read();
  db.data ||= {};
};

app.get('/metas', async (_req, res) => {
  await readDb();
  const metas = db.data?.metas ?? { metas: [] };
  res.json(metas);
});

app.post('/metas', async (req, res) => {
  await readDb();
  const payload = req.body || {};

  if (!db.data?.metas) {
    db.data.metas = { metas: [] };
  }

  db.data.metas.metas ||= [];
  db.data.metas.metas.push(payload);
  await db.write();

  res.status(201).json(payload);
});

app.get('/corretoras', async (_req, res) => {
  await readDb();
  res.json(db.data?.corretoras ?? []);
});

app.get('/perfil', async (_req, res) => {
  await readDb();
  res.json(db.data?.perfil ?? []);
});

app.get('/patrimonio', async (_req, res) => {
  await readDb();
  res.json(db.data?.patrimonio ?? []);
});

app.listen(PORT, () => {
  console.log(`Mock server is running on port ${PORT}`);
});
