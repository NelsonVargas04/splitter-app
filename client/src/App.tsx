import React, { useEffect, useState } from 'react'

const API = 'http://localhost:3000/api'

export default function App() {
  const [people, setPeople] = useState([])
  const [expenses, setExpenses] = useState([])
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [payerId, setPayerId] = useState('')
  const [participants, setParticipants] = useState([])
  const [split, setSplit] = useState([])

  useEffect(() => { fetchPeople(); fetchExpenses(); fetchSplit(); }, [])

  function fetchPeople() {
    fetch(API + '/people').then(r=>r.json()).then(setPeople)
  }
  function fetchExpenses() {
    fetch(API + '/expenses').then(r=>r.json()).then(setExpenses)
  }
  function fetchSplit() {
    fetch(API + '/split').then(r=>r.json()).then(setSplit)
  }

  async function addPerson(e: any) {
    e.preventDefault()
    if(!name) return
    await fetch(API + '/people', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name }) })
    setName('')
    fetchPeople(); fetchSplit()
  }

  function toggleParticipant(id: any) {
    setParticipants(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id])
  }

  async function addExpense(e: any) {
    e.preventDefault()
    if(!desc || !amount || !payerId || participants.length===0) return
    await fetch(API + '/expenses', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ description:desc, amount: Number(amount), payerId: Number(payerId), participants }) })
    setDesc(''); setAmount(''); setParticipants([])
    fetchExpenses(); fetchSplit()
  }

  return (
    <div className="container">
      <h1>SplitApp</h1>

      <section>
        <h2>People</h2>
        <form onSubmit={addPerson}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
          <button>Add</button>
        </form>
        <ul>
          {people.map((p:any)=> <li key={p.id}>{p.name} (id: {p.id})</li>)}
        </ul>
      </section>

      <section>
        <h2>Expenses</h2>
        <form onSubmit={addExpense}>
          <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" />
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" type="number" step="0.01" />
          <select value={payerId} onChange={e=>setPayerId(e.target.value)}>
            <option value="">Payer</option>
            {people.map((p:any)=> <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div>
            <small>Participants:</small>
            {people.map((p:any)=> (
              <label key={p.id}><input type="checkbox" checked={participants.includes(p.id)} onChange={()=>toggleParticipant(p.id)} /> {p.name}</label>
            ))}
          </div>
          <button>Add expense</button>
        </form>

        <ul>
          {expenses.map((ex:any)=> <li key={ex.id}>{ex.description} — {ex.amount} — paid by: {ex.payerId}</li>)}
        </ul>
      </section>

      <section>
        <h2>Summary (balance)</h2>
        <button onClick={fetchSplit}>Refresh</button>
        <ul>
          {split.map((s:any)=> <li key={s.id}>{s.name}: {s.balance}</li>)}
        </ul>
      </section>
    </div>
  )
}
