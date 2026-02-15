const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let people = []; // { id, name }
let expenses = []; // { id, description, amount, payerId, participants: [personId] }
let nextId = 1;

app.get('/api/people', (req, res) => {
  res.json(people);
});

app.post('/api/people', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const p = { id: nextId++, name };
  people.push(p);
  res.status(201).json(p);
});

app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const { description, amount, payerId, participants } = req.body;
  if (!description || !amount || !payerId || !Array.isArray(participants)) {
    return res.status(400).json({ error: 'invalid expense body' });
  }
  const e = { id: nextId++, description, amount: Number(amount), payerId, participants };
  expenses.push(e);
  res.status(201).json(e);
});

// Calcular división: devuelve cuánto debe/recibir cada persona
app.get('/api/split', (req, res) => {
  const totals = {}; // personId -> net balance (positive = should receive)
  people.forEach(p => totals[p.id] = 0);

  expenses.forEach(exp => {
    const share = exp.amount / exp.participants.length;
    // payer paid full amount => others owe share to payer
    exp.participants.forEach(pid => {
      if (pid === exp.payerId) {
        totals[pid] += exp.amount - share; // payer's net after covering own share
      } else {
        totals[pid] -= share;
      }
    });
  });

  const result = people.map(p => ({ id: p.id, name: p.name, balance: Number((totals[p.id] || 0).toFixed(2)) }));
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
