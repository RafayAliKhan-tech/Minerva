import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Bot, Send, Sparkles } from 'lucide-react'
import Container from '../components/common/Container'

const starters = ['What should I learn next?', 'Which role fits my strengths?', 'Help me prepare for an interview']

function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ from: 'assistant', text: 'I have your latest profile signals in view. What would you like to make clearer today?' }])
  const send = (text = input) => { if (!text.trim()) return; setMessages((items) => [...items, { from: 'user', text }, { from: 'assistant', text: `Based on your current profile, I would start with one practical step around “${text}”. I can turn that into a focused plan or compare it with your target role.` }]); setInput('') }
  return <main className="chat-page"><Container><div className="chat-heading"><div><p className="dashboard-kicker">CONTEXT-AWARE AI ASSISTANT</p><h1>Think out loud with Minerva.</h1><p>Your profile, assessments, roadmap, and resume context stay close to the conversation.</p></div><Link to="/dashboard" className="dashboard-text-link">Dashboard <ArrowUpRight size={15} /></Link></div><div className="chat-shell"><aside className="chat-sidebar"><div className="chat-bot-mark"><Bot size={23} /></div><h2>Minerva</h2><p>Career intelligence, grounded in your progress.</p><div className="chat-context"><span>IN VIEW</span><b>Frontend direction</b><small>64% readiness signal</small></div><Link to="/explore/roadmap" className="dashboard-outline-action">Open roadmap <ArrowUpRight size={15} /></Link></aside><section className="chat-window"><div className="chat-messages">{messages.map((message, index) => <div className={`chat-message ${message.from}`} key={`${message.from}-${index}`}><span>{message.from === 'assistant' ? <Sparkles size={14} /> : 'YOU'}</span><p>{message.text}</p></div>)}</div><div className="chat-starters">{starters.map((starter) => <button key={starter} onClick={() => send(starter)}>{starter}</button>)}</div><form className="chat-composer" onSubmit={(event) => { event.preventDefault(); send() }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your next move..." /><button aria-label="Send message"><Send size={17} /></button></form></section></div></Container></main>
}
export default ChatPage
