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
  db.data ||= { ativos: [], metas: [], usuarios: [] };
  db.data.ativos ||= [];
  db.data.metas ||= [];
  db.data.usuarios ||= [];
};

// Gerar timestamp ISO
const getTimestamp = () => new Date().toISOString();

const buildError = (status, error, message, path) => ({
  timestamp: getTimestamp(),
  status,
  error,
  message,
  path,
});

// Calcular percentual de progresso da meta
const calcularProgresso = (valorAtual, valorMeta) => {
  return valorMeta > 0 ? ((valorAtual / valorMeta) * 100).toFixed(1) : 0;
};

// ===== ATIVOS SIMPLES =====

// GET /ativos - Listar todos os ativos
app.get('/ativos', async (_req, res) => {
  await readDb();
  res.json({ ativos: db.data.ativos || [] });
});

// GET /ativos/:id - Obter ativo por ID
app.get('/ativos/:id', async (req, res) => {
  await readDb();
  const id = parseInt(req.params.id);
  const ativo = db.data.ativos.find(a => a.id === id);
  
  if (!ativo) {
    return res.status(404).json({ error: 'Ativo não encontrado' });
  }
  
  res.json({ ativos: [ativo] });
});

// POST /ativos - Criar ativo simples
app.post('/ativos', async (req, res) => {
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

// POST /ativos/lote - Criar múltiplos ativos
app.post('/ativos/lote', async (req, res) => {
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

// POST /ativos/completo - Criar ativo completo (com investimentos)
app.post('/ativos/completo', async (req, res) => {
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

// PUT /ativos/:id - Atualizar ativo
app.put('/ativos/:id', async (req, res) => {
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

// DELETE /ativos/:id - Deletar ativo
app.delete('/ativos/:id', async (req, res) => {
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

// GET /metas - Listar todas as metas
app.get('/metas', async (_req, res) => {
  await readDb();
  
  // Calcular percentual de progresso para cada meta
  const metasComProgresso = (db.data.metas || []).map(meta => ({
    ...meta,
    percentualProgresso: parseFloat(calcularProgresso(meta.valorAtual, meta.valorMeta))
  }));
  
  res.json({ metas: metasComProgresso });
});

// GET /metas/:id - Obter meta por ID
app.get('/metas/:id', async (req, res) => {
  await readDb();
  const id = parseInt(req.params.id);
  const meta = db.data.metas.find(m => m.id === id);
  
  if (!meta) {
    return res.status(404).json({ error: 'Meta não encontrada' });
  }
  
  const metaComProgresso = {
    ...meta,
    percentualProgresso: parseFloat(calcularProgresso(meta.valorAtual, meta.valorMeta))
  };
  
  res.json({ metas: [metaComProgresso] });
});

// POST /metas - Criar meta
app.post('/metas', async (req, res) => {
  await readDb();
  const payload = req.body || {};
  
  const novaMeta = {
    id: db.data.metas.length > 0 ? Math.max(...db.data.metas.map(m => m.id)) + 1 : 1,
    ...payload,
    percentualProgresso: parseFloat(calcularProgresso(payload.valorAtual || 0, payload.valorMeta)),
    dataCriacao: getTimestamp(),
    dataAtualizacao: getTimestamp()
  };
  
  db.data.metas.push(novaMeta);
  await db.write();
  
  res.status(201).json({ metas: [novaMeta] });
});

// PUT /metas/:id - Atualizar meta
app.put('/metas/:id', async (req, res) => {
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
      req.body.valorMeta || db.data.metas[index].valorMeta
    )),
    dataAtualizacao: getTimestamp()
  };
  
  db.data.metas[index] = metaAtualizada;
  await db.write();
  
  res.json({ metas: [metaAtualizada] });
});

// DELETE /metas/:id - Deletar meta
app.delete('/metas/:id', async (req, res) => {
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

// ===== USUARIOS E AUTENTICACAO =====

app.post('/usuarios', async (req, res) => {
  await readDb();
  const { nome, email, senha } = req.body || {};

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, e-mail e senha sao obrigatorios' });
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const usuarioExistente = db.data.usuarios.find(
    u => String(u.email).trim().toLowerCase() === emailNormalizado
  );

  if (usuarioExistente) {
    return res.status(409).json({ error: 'Ja existe usuario com este e-mail' });
  }

  const novoUsuario = {
    id: db.data.usuarios.length > 0 ? Math.max(...db.data.usuarios.map(u => u.id)) + 1 : 1,
    nome: String(nome).trim(),
    email: emailNormalizado,
    senha,
    dataCriacao: getTimestamp(),
    dataAtualizacao: getTimestamp()
  };

  db.data.usuarios.push(novoUsuario);
  await db.write();

  const { senha: _senha, ...usuarioSemSenha } = novoUsuario;
  res.status(201).json({ usuario: usuarioSemSenha });
});

app.post('/auth/login', async (req, res) => {
  await readDb();
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha sao obrigatorios' });
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const usuario = db.data.usuarios.find(
    u => String(u.email).trim().toLowerCase() === emailNormalizado && u.senha === senha
  );

  if (!usuario) {
    return res.status(401).json({ error: 'Credenciais invalidas' });
  }

  const { senha: _senha, ...usuarioSemSenha } = usuario;
  res.json({ usuario: usuarioSemSenha });
});

// ===== API CADASTROS (COMPATIBILIDADE COM BACKEND PRINCIPAL) =====

app.post('/api/cadastros', async (req, res) => {
  await readDb();
  const { nome, email, senha } = req.body || {};

  if (!nome || !email || !senha) {
    return res.status(400).json(
      buildError(400, 'Bad Request', 'Nome, email e senha sao obrigatorios', '/api/cadastros')
    );
  }

  const emailNormalizado = String(email).trim().toLowerCase();
  const usuarioExistente = db.data.usuarios.find(
    u => String(u.email).trim().toLowerCase() === emailNormalizado
  );

  if (usuarioExistente) {
    return res.status(400).json(
      buildError(400, 'Bad Request', `Email ja cadastrado: ${emailNormalizado}`, '/api/cadastros')
    );
  }

  const novoUsuario = {
    id: db.data.usuarios.length > 0 ? Math.max(...db.data.usuarios.map(u => u.id)) + 1 : 1,
    nome: String(nome).trim(),
    email: emailNormalizado,
    senha,
    dataCriacao: getTimestamp(),
    dataAtualizacao: null,
    ativo: true,
  };

  db.data.usuarios.push(novoUsuario);
  await db.write();

  const { senha: _senha, ...usuarioSemSenha } = novoUsuario;
  res.status(201).json(usuarioSemSenha);
});

app.post('/api/cadastros/autenticar', async (req, res) => {
  await readDb();
  const email = String(req.query.email || '').trim().toLowerCase();
  const senha = String(req.query.senha || '');

  if (!email || !senha) {
    return res.status(400).json(
      buildError(400, 'Bad Request', 'Email ou senha invalidos', '/api/cadastros/autenticar')
    );
  }

  const usuario = db.data.usuarios.find(
    u => String(u.email).trim().toLowerCase() === email && u.senha === senha && (u.ativo ?? true)
  );

  if (!usuario) {
    return res.status(400).json(
      buildError(400, 'Bad Request', 'Email ou senha invalidos', '/api/cadastros/autenticar')
    );
  }

  const { senha: _senha, ...usuarioSemSenha } = usuario;
  res.json(usuarioSemSenha);
});

app.listen(PORT, () => {
  console.log(`🚀 YUNI API Server running on http://localhost:${PORT}`);
});
