import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

type Person = { id: number; name: string };
type Expense = { id: number; description: string; amount: number; payerId: number; participants: number[] };

let people: Person[] = [];
let expenses: Expense[] = [];
let nextId = 1;

app.get('/api/people', (req, res) => {
  res.json(people);
});

app.post('/api/people', (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name) return res.status(400).json({ error: 'name required' });
  const p = { id: nextId++, name };
  people.push(p);
  res.status(201).json(p);
});

app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const { description, amount, payerId, participants } = req.body as any;
  if (!description || !amount || !payerId || !Array.isArray(participants)) {
    return res.status(400).json({ error: 'invalid expense body' });
  }
  const e = { id: nextId++, description, amount: Number(amount), payerId, participants } as Expense;
  expenses.push(e);
  res.status(201).json(e);
});

app.get('/api/split', (req, res) => {
  const totals: Record<number, number> = {};
  people.forEach(p => totals[p.id] = 0);

  expenses.forEach(exp => {
    const share = exp.amount / exp.participants.length;
    exp.participants.forEach(pid => {
      if (pid === exp.payerId) {
        totals[pid] += exp.amount - share;
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
