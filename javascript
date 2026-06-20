const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// Banco simulado
const DB = {
    produtos: [], clientes: [], pedidos: [], lojas: [],
    afiliados: [], entregadores: [], campanhas: [], recargas: [],
    recomendacoes: [], memorias: []
};

// ============================================
// API COMPLETA
// ============================================

// Produtos
app.post('/api/produtos', (req, res) => {
    const p = { id: Date.now().toString(), ...req.body, data: new Date().toISOString() };
    DB.produtos.push(p);
    res.json({ success: true, produto: p });
});

// Clientes (valida 2 referências)
app.post('/api/clientes', (req, res) => {
    if (!req.body.ref1 || !req.body.ref2) {
        return res.status(400).json({ error: '❌ 2 referências obrigatórias!' });
    }
    const c = { id: Date.now().toString(), ...req.body, data: new Date().toISOString() };
    DB.clientes.push(c);
    res.json({ success: true, cliente: c });
});

// Pedidos
app.post('/api/pedidos', (req, res) => {
    const pedido = {
        id: 'PED-' + Date.now().toString(36).toUpperCase(),
        ...req.body,
        status: 'confirmado',
        data: new Date().toISOString()
    };
    DB.pedidos.push(pedido);
    res.json({ success: true, pedido });
});

// Recarga
app.post('/api/recarga', (req, res) => {
    const rec = {
        id: 'REC-' + Date.now().toString(36).toUpperCase(),
        ...req.body,
        status: 'concluida',
        data: new Date().toISOString()
    };
    DB.recargas.push(rec);
    res.json({ success: true, recarga: rec, mensagem: '✅ Crédito liberado!' });
});

// IA Recomendação
app.post('/api/ia/analisar', (req, res) => {
    const { clienteId, comportamento } = req.body;
    const recomendacao = {
        id: 'REC-' + Date.now().toString(36),
        clienteId,
        sugestao: 'Produto sugerido baseado no perfil',
        confianca: 0.92
    };
    DB.recomendacoes.push(recomendacao);
    res.json({ success: true, recomendacao });
});

// Memória entregadores
app.get('/api/memoria/:regiao', (req, res) => {
    const memorias = DB.memorias.filter(m => m.regiao === req.params.regiao);
    res.json({ memorias });
});

app.post('/api/memoria', (req, res) => {
    const m = { id: Date.now().toString(), ...req.body, data: new Date().toISOString() };
    DB.memorias.push(m);
    res.json({ success: true, memoria: m });
});

// Métricas
app.get('/api/metricas', (req, res) => {
    res.json({
        lojas: DB.lojas.length,
        pedidos: DB.pedidos.length,
        recargas: DB.recargas.length,
        recomendacoes: DB.recomendacoes.length
    });
});

// Servir frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 SmartSystem rodando na porta ${PORT}`);
});
