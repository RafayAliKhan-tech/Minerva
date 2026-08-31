import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Bot, Send, Sparkles, Loader } from 'lucide-react'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'
import { sendChatMessage, getChatHistory } from '../api/minervaApi'
import { getDisplayName } from '../utils/userData'

const starters = ['What should I learn next?', 'Which role fits my strengths?', 'Help me prepare for an interview']

function ChatPage() {
  const { user } = useAuth()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const displayName = getDisplayName(user)
  const userId = user?.email || user?.Email || user?.id

  useEffect(() => {
    // Load chat history from API
    if (userId) {
      getChatHistory(userId)
        .then((history) => {
          setMessages(history || [])
        })
        .catch((error) => {
          console.error('Failed to load chat history:', error)
          setMessages([])
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text = input) => {
    if (!text.trim()) return
    
    setInput('')
    setLoading(true)

    try {
      const response = await sendChatMessage({
        message: text,
        userId,
        userProfile: {
          displayName,
        },
      })

      // Get updated chat history from API
      const updatedHistory = await getChatHistory(userId)
      setMessages(updatedHistory || [])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="chat-page">
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p>Loading chat...</p>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="chat-page">
      <Container>
        <div className="chat-heading">
          <div>
            <p className="dashboard-kicker">CONTEXT-AWARE AI ASSISTANT</p>
            <h1>Think out loud with Minerva.</h1>
            <p>Your profile, assessments, roadmap, and resume context stay close to the conversation.</p>
          </div>
          <Link to="/dashboard" className="dashboard-text-link">Dashboard <ArrowUpRight size={15} /></Link>
        </div>
        <div className="chat-shell">
          <aside className="chat-sidebar">
            <div className="chat-bot-mark"><Bot size={23} /></div>
            <h2>Minerva</h2>
            <p>Career intelligence, grounded in your progress.</p>
            <div className="chat-context">
              <span>IN VIEW</span>
              <b>Frontend direction</b>
              <small>64% readiness signal</small>
            </div>
            <Link to="/explore/roadmap" className="dashboard-outline-action">Open roadmap <ArrowUpRight size={15} /></Link>
          </aside>
          <section className="chat-window">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div className={`chat-message ${message.from}`} key={index}>
                  <span>{message.from === 'assistant' ? <Sparkles size={14} /> : 'YOU'}</span>
                  <p>{message.text || message.message}</p>
                </div>
              ))}
              {loading && (
                <div className="chat-message assistant">
                  <span><Sparkles size={14} /></span>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    Thinking...
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {messages.length === 0 && (
              <div className="chat-starters">
                {starters.map((starter) => (
                  <button key={starter} onClick={() => send(starter)} disabled={loading}>
                    {starter}
                  </button>
                ))}
              </div>
            )}
            <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); send() }}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about your next move..."
                disabled={loading}
              />
              <button aria-label="Send message" disabled={loading || !input.trim()}>
                <Send size={17} />
              </button>
            </form>
          </section>
        </div>
      </Container>
    </main>
  )
}

export default ChatPage
