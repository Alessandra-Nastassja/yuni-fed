import { App } from '@tinyhttp/app';
import { cors } from '@tinyhttp/cors';
import { json } from 'milliparsec';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const PORT = 8080;
const adapter = new JSONFile('db.json');
const db = new Low(adapter, {});

const app = new App();

app.use(cors());
app.use(json());

const readDb = async () => {
  await db.read();
  db.data ||= { ativos: [], metas: [] };
};

// Gerar timestamp ISO
const getTimestamp = () => new Date().toISOString();

// Calcular percentual de progresso da meta
const calcularProgresso = (valorAtual, valorObjetivo) => {
  return valorObjetivo > 0 ? ((valorAtual / valorObjetivo) * 100).toFixed(1) : 0;
};

// ===== ATIVOS SIMPLES =====

// GET /api/ativos - Listar todos os ativos
app.get('/api/ativos', async (_req, res) => {
  await readDb();
  res.json({ ativos: db.data.ativos || [] });
});

// GET /api/ativos/:id - Obter ativo por ID
app.get('/api/ativos/:id', async (req, res) => {
  await readDb();
  const id = parseInt(req.params.id);
  const ativo = db.data.ativos.find(a => a.id === id);
  
  if (!ativo) {
    return res.status(404).json({ error: 'Ativo não encontrado' });
  }
  
  res.json({ ativos: [ativo] });
});

// POST /api/ativos - Criar ativo simples
app.post('/api/ativos', async (req, res) => {
  await readDb();
  const payload = req.body || {};
  
  const novoAtivo = {
    id: db.data.ativos.length > 0 ? Math.max(...db.data.ativos.map(a => a.id)) + 1 : 1,
    ...payload,
    dataCriacao: getTimestamp(),
    dataAtualizacao: getTimestamp()
  };
  
  db.data.ativos.push(novoAtivo);
  await db.write();
  
  res.status(201).json({ ativos: [novoAtivo] });
});

// POST /api/ativos/lote - Criar múltiplos ativos
app.post('/api/ativos/lote', async (req, res) => {
  await readDb();
  const { ativos } = req.body || { ativos: [] };
  
  const novosAtivos = ativos.map((ativo, index) => ({
    id: db.data.ativos.length > 0 ? Math.max(...db.data.ativos.map(a => a.id)) + index + 1 : index + 1,
    ...ativo,
    dataCriacao: getTimestamp(),
    dataAtualizacao: getTimestamp()
  }));
  
  db.data.ativos.push(...novosAtivos);
  await db.write();
  
  res.status(201).json({ ativos: novosAtivos });
});

// POST /api/ativos/completo - Criar ativo completo (com investimentos)
app.post('/api/ativos/completo', async (req, res) => {
  await readDb();
  const payload = req.body || {};
  
  // Determinar risco baseado no tipo de investimento
  let risco = 'baixo';
  if (payload.tipoInvestimento === 'renda_variavel') {
    risco = payload.rendaVariavel?.categoriaRiscoRendaVariavel || 'alto';
  } else if (payload.tipoInvestimento === 'renda_fixa') {
    risco = payload.rendaFixa?.categoriaRiscoRendaFixa || 'baixo';
  } else if (payload.tipoInvestimento === 'tesouro_direto') {
    risco = 'baixo';
  }
  
  // Adicionar IDs aos sub-objetos se existirem
  const novoId = db.data.ativos.length > 0 ? Math.max(...db.data.ativos.map(a => a.id)) + 1 : 1;
  
  if (payload.tesouroDireto) {
    payload.tesouroDireto.id = novoId;
    payload.tesouroDireto.risco = 'baixo';
  }
  
  if (payload.rendaFixa) {
    payload.rendaFixa.id = novoId;
  }
  
  if (payload.rendaVariavel) {
    payload.rendaVariavel.id = novoId;
  }
  
  const novoAtivo = {
    id: novoId,
    ...payload,
    risco,
    dataCriacao: getTimestamp(),
    dataAtualizacao: getTimestamp()
  };
  
  db.data.ativos.push(novoAtivo);
  await db.write();
  
  res.status(201).json(novoAtivo);
});

// PUT /api/ativos/:id - Atualizar ativo
app.put('/api/ativos/:id', async (req, res) => {
  await readDb();
  const id = parseInt(req.params.id);
  const index = db.data.ativos.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Ativo não encontrado' });
  }
  
  const ativoAtualizado = {
    ...db.data.ativos[index],
    ...req.body,
    id,
    dataAtualizacao: getTimestamp()
  };
  
  db.data.ativos[index] = ativoAtualizado;
  await db.write();
  
  res.json({ ativos: [ativoAtualizado] });
});

// DELETE /api/ativos/:id - Deletar ativo
app.delete('/api/ativos/:id', async (req, res) => {
  await readDb();
  const id = parseInt(req.params.id);
  const index = db.data.ativos.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Ativo não encontrado' });
  }
  
  db.data.ativos.splice(index, 1);
  await db.write();
  
  res.status(204).send();
});

// ===== METAS =====

// GET /api/metas - Listar todas as metas
app.get('/api/metas', async (_req, res) => {
  await readDb();
  
  // Calcular percentual de progresso para cada meta
  const metasComProgresso = (db.data.metas || []).map(meta => ({
    ...meta,
    percentualProgresso: parseFloat(calcularProgresso(meta.valorAtual, meta.valorObjetivo))
  }));
  
  res.json({ metas: metasComProgresso });
});

// GET /api/metas/:id - Obter meta por ID
app.get('/api/metas/:id', async (req, res) => {
  await readDb();
  const id = parseInt(req.params.id);
  const meta = db.data.metas.find(m => m.id === id);
  
  if (!meta) {
    return res.status(404).json({ error: 'Meta não encontrada' });
  }
  
  const metaComProgresso = {
    ...meta,
    percentualProgresso: parseFloat(calcularProgresso(meta.valorAtual, meta.valorObjetivo))
  };
  
  res.json({ metas: [metaComProgresso] });
});

// POST /api/metas - Criar meta
app.post('/api/metas', async (req, res) => {
  await readDb();
  const payload = req.body || {};
  
  const novaMeta = {
    id: db.data.metas.length > 0 ? Math.max(...db.data.metas.map(m => m.id)) + 1 : 1,
    ...payload,
    percentualProgresso: parseFloat(calcularProgresso(payload.valorAtual || 0, payload.valorObjetivo)),
    dataCriacao: getTimestamp(),
    dataAtualizacao: getTimestamp()
  };
  
  db.data.metas.push(novaMeta);
  await db.write();
  
  res.status(201).json({ metas: [novaMeta] });
});

// PUT /api/metas/:id - Atualizar meta
app.put('/api/metas/:id', async (req, res) => {
  await readDb();
  const id = parseInt(req.params.id);
  const index = db.data.metas.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Meta não encontrada' });
  }
  
  const metaAtualizada = {
    ...db.data.metas[index],
    ...req.body,
    id,
    percentualProgresso: parseFloat(calcularProgresso(
      req.body.valorAtual || db.data.metas[index].valorAtual,
      req.body.valorObjetivo || db.data.metas[index].valorObjetivo
    )),
    dataAtualizacao: getTimestamp()
  };
  
  db.data.metas[index] = metaAtualizada;
  await db.write();
  
  res.json({ metas: [metaAtualizada] });
});

// DELETE /api/metas/:id - Deletar meta
app.delete('/api/metas/:id', async (req, res) => {
  await readDb();
  const id = parseInt(req.params.id);
  const index = db.data.metas.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Meta não encontrada' });
  }
  
  db.data.metas.splice(index, 1);
  await db.write();
  
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 YUNI API Server running on http://localhost:${PORT}`);
});
