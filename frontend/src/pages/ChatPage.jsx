import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3, Loader, MoreVertical, Plus, Send, Sparkles, X } from 'lucide-react'
import Container from '../components/common/Container'
import Logo from '../components/common/Logo'
import { useAuth } from '../auth/AuthContext'
import { sendChatMessage, getChatHistory, getProfile } from '../api/minervaApi'
import {
  apiErrorMessage,
  extractChatAnswer,
  extractHistoryMessages,
  extractSessionId,
} from '../api/backendContract'
import { getStoredHighestScoredField } from '../utils/skillProfile'
import { getDisplayName, getUserEmail } from '../utils/userData'

const SESSION_KEY = 'minervaChatSessionId'
const HISTORY_KEY = 'minervaChatSessions'
const starters = ['What should I learn next?', 'Which role fits my strengths?', 'Help me prepare for an interview']

const chatErrorMessage = (error, fallback) => {
  const status = error?.response?.status
  if (status === 404 || status === 429 || status >= 500) return 'Please try again later.'
  return apiErrorMessage(error, fallback)
}

const getSessionKey = (user) => {
  const email = getUserEmail(user).trim().toLowerCase()
  return email ? `${SESSION_KEY}:${email}` : SESSION_KEY
}

const readStoredSessionId = (user) => {
  try {
    return sessionStorage.getItem(getSessionKey(user)) || ''
  } catch {
    return ''
  }
}

const persistSessionId = (sessionId, user) => {
  if (!sessionId) return
  try {
    sessionStorage.setItem(getSessionKey(user), String(sessionId))
  } catch {
    // Ignore unavailable session storage.
  }
}

const getHistoryKey = (user) => {
  const email = getUserEmail(user).trim().toLowerCase()
  return email ? `${HISTORY_KEY}:${email}` : HISTORY_KEY
}

const readSessions = (user) => {
  try {
    const stored = JSON.parse(localStorage.getItem(getHistoryKey(user)) || '[]')
    return Array.isArray(stored) ? stored.filter((session) => session?.id) : []
  } catch {
    return []
  }
}

const persistSessions = (sessions, user) => {
  try {
    localStorage.setItem(getHistoryKey(user), JSON.stringify(sessions))
  } catch {
    // Keep the chat usable when local storage is unavailable.
  }
}

const formatSessionTitle = (text) => {
  const title = String(text || '').trim().replace(/\s+/g, ' ')
  return title.length > 42 ? `${title.slice(0, 42).trim()}...` : title
}

const getSessionGroup = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const daysAgo = Math.floor((startOfToday - startOfDate) / 86400000)
  if (daysAgo <= 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo <= 7) return 'Previous 7 Days'
  return 'Older'
}

function ChatPage() {
  const { user } = useAuth()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(() => readStoredSessionId(user))
  const [highestScoredField, setHighestScoredField] = useState(null)
  const [profileReady, setProfileReady] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [sending, setSending] = useState(false)
  const [historyError, setHistoryError] = useState('')
  const [sendError, setSendError] = useState('')
  const [profileError, setProfileError] = useState('')
  const [pendingRetry, setPendingRetry] = useState('')
  const [sessions, setSessions] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const messagesRef = useRef(null)

  const upsertSession = (id, title, timestamp = Date.now()) => {
    if (!id) return
    setSessions((currentSessions) => {
      const existing = currentSessions.find((session) => session.id === String(id))
      const nextSession = {
        id: String(id),
        title: existing?.title || formatSessionTitle(title) || 'New conversation',
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
      }
      const nextSessions = [nextSession, ...currentSessions.filter((session) => session.id !== String(id))]
      persistSessions(nextSessions, user)
      return nextSessions
    })
  }

  const captureSessionId = (payload) => {
    const nextSessionId = extractSessionId(payload)
    if (nextSessionId) {
      setSessionId(String(nextSessionId))
      persistSessionId(nextSessionId, user)
      return String(nextSessionId)
    }
    return sessionId
  }

  const loadHistory = async (id) => {
    if (!id) {
      setMessages([])
      setLoadingHistory(false)
      return
    }

    setLoadingHistory(true)
    setHistoryError('')
    try {
      const response = await getChatHistory(id)
      console.log('Chat history response:', response)
      captureSessionId(response)
      const historyMessages = extractHistoryMessages(response)
      setMessages(historyMessages)
      const firstUserMessage = historyMessages.find((message) => message.from === 'user')
      if (firstUserMessage) upsertSession(id, firstUserMessage.text)
    } catch (error) {
      setMessages([])
      setHistoryError(chatErrorMessage(error, 'Unable to load chat history from the backend.'))
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    let mounted = true
    const loadContext = async () => {
      setProfileError('')
      try {
        const profile = await getProfile()
        if (!mounted) return
        setHighestScoredField(getStoredHighestScoredField())
      } catch (error) {
        if (!mounted) return
        setHighestScoredField(null)
        setProfileError(chatErrorMessage(error, 'Unable to load the backend profile required for chatbot context.'))
      } finally {
        if (mounted) setProfileReady(true)
      }
    }

    loadContext()
    return () => {
      mounted = false
    }
  }, [user])

  useEffect(() => {
    const storedSessionId = readStoredSessionId(user)
    setSessions(readSessions(user))
    setSessionId(storedSessionId)
    setMessages([])
    setHistoryError('')
    setSendError('')
    setPendingRetry('')
    if (storedSessionId) {
      loadHistory(storedSessionId)
    } else {
      setLoadingHistory(false)
    }
  }, [user])

  const startNewChat = () => {
    setSessionId('')
    setMessages([])
    setInput('')
    setHistoryError('')
    setSendError('')
    setPendingRetry('')
    setHistoryOpen(false)
    try {
      sessionStorage.removeItem(getSessionKey(user))
    } catch {
      // Keep the new-chat action usable when session storage is unavailable.
    }
  }

  const selectSession = (id) => {
    if (!id || id === sessionId) {
      setHistoryOpen(false)
      return
    }
    setSessionId(String(id))
    persistSessionId(id, user)
    setMessages([])
    setHistoryError('')
    setSendError('')
    setPendingRetry('')
    setHistoryOpen(false)
    loadHistory(String(id))
  }

  useEffect(() => {
    const conversation = messagesRef.current
    if (!conversation) return

    conversation.scrollTo({
      top: conversation.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, sending])

  const send = async (text = input) => {
    const message = String(text || '').trim()
    if (!message || sending) return

    setInput('')
    setSendError('')
    setPendingRetry('')
    setSending(true)
    setMessages((current) => [...current, { id: `user-${current.length}`, from: 'user', text: message }])

    try {
      const payload = { message }
      if (sessionId) payload.sessionId = sessionId
      const response = await sendChatMessage(payload)
      console.log('Chat response:', response)
      if (response?.status === false) {
        throw new Error(response?.message || 'The chat API rejected this message.')
      }

      const nextSessionId = captureSessionId(response)
      upsertSession(nextSessionId, message)
      const answer = extractChatAnswer(response)

      if (nextSessionId) {
        try {
          const history = await getChatHistory(nextSessionId)
          console.log('Chat history response:', history)
          const historyMessages = extractHistoryMessages(history)
          if (historyMessages.length) {
            setMessages(historyMessages)
            return
          }
        } catch (historyLoadError) {
          setHistoryError(chatErrorMessage(historyLoadError, 'Message sent, but chat history could not be reloaded.'))
        }
      }

      if (!answer) {
        throw new Error('The chat API did not return an answer.')
      }

      setMessages((current) => [...current, { id: `assistant-${current.length}`, from: 'assistant', text: String(answer) }])
    } catch (error) {
      setPendingRetry(message)
      setSendError(chatErrorMessage(error, 'The chat API failed. No generated answer is available.'))
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="chat-page">
      <Container>
        {/* <div className="chat-heading"> 
           <div>
            <p className="dashboard-kicker">CONTEXT-AWARE AI ASSISTANT</p>
            <h1>Think out loud with Minerva.</h1>
            <p>Your backend skill profile and highest scored field stay with the conversation.</p>
          </div>
          <Link to="/dashboard" className="dashboard-text-link">Dashboard <ArrowUpRight size={15} /></Link>
        </div> */}
        <div className={`chat-shell${historyOpen ? ' chat-history-open' : ''}`}>
          <aside className="chat-history-sidebar" aria-label="Chat history">
            <div className="chat-history-brand">
              <Logo />
              <button type="button" onClick={() => setHistoryOpen(false)} aria-label="Close chat history"><X size={16} /></button>
            </div>
            <button type="button" className="chat-new-button" onClick={startNewChat}>
              <Plus size={15} /> New Chat
            </button>
            <div className="chat-history-list">
              {['Today', 'Yesterday', 'Previous 7 Days', 'Older'].map((group) => {
                const groupedSessions = sessions.filter((session) => getSessionGroup(session.updatedAt) === group)
                if (!groupedSessions.length) return null
                return (
                  <div className="chat-history-group" key={group}>
                    <span>{group}</span>
                    {groupedSessions.map((session) => (
                      <button
                        type="button"
                        className={`chat-history-item${session.id === sessionId ? ' is-active' : ''}`}
                        key={session.id}
                        onClick={() => selectSession(session.id)}
                        title={session.title}
                      >
                        <span>{session.title}</span>
                        <MoreVertical size={14} />
                      </button>
                    ))}
                  </div>
                )
              })}
              {!sessions.length && <p className="chat-history-empty">Your conversations will appear here.</p>}
            </div>
            <div className="chat-history-profile">
              <span className="chat-history-avatar" aria-hidden="true">{getDisplayName(user).trim().charAt(0).toUpperCase() || 'M'}</span>
              <span>PROFILE</span>
              <strong>{getDisplayName(user)}</strong>
              <small>{getUserEmail(user) || 'Signed-in Minerva account'}</small>
              {profileReady && highestScoredField && <small>Focus: {highestScoredField}</small>}
              <Link to="/dashboard">View profile <ArrowUpRight size={13} /></Link>
            </div>
          </aside>
          <section className="chat-window">
            <button type="button" className="chat-history-toggle" onClick={() => setHistoryOpen((open) => !open)} aria-label="Toggle chat history">
              <Clock3 size={17} />
            </button>
            {(historyError || sendError || profileError) && (
              <div className="api-error-banner" role="alert">
                <p>{sendError || historyError || profileError}</p>
                {pendingRetry ? (
                  <button type="button" onClick={() => send(pendingRetry)} disabled={sending}>Retry last message</button>
                ) : historyError ? (
                  <button type="button" onClick={() => loadHistory(sessionId)} disabled={loadingHistory}>Retry history</button>
                ) : null}
              </div>
            )}
            <div
              ref={messagesRef}
              className={`chat-messages${!loadingHistory && !messages.length ? ' chat-messages-empty' : ''}`}
            >
              {loadingHistory && (
                <div className="chat-message assistant">
                  <span><Sparkles size={14} /></span>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    Loading conversation...
                  </p>
                </div>
              )}
              {!loadingHistory && !historyError && messages.length === 0 && (
                <div className="chat-message assistant">
                  <span><Sparkles size={14} /></span>
                  <p>No conversation history yet. Send a question to start.</p>
                </div>
              )}
              {messages.map((message) => (
                <div className={`chat-message ${message.from}`} key={message.id}>
                  <span>{message.from === 'assistant' ? <Sparkles size={14} /> : 'YOU'}</span>
                  <p>{message.text}</p>
                </div>
              ))}
              {sending && (
                <div className="chat-message assistant">
                  <span><Sparkles size={14} /></span>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    Waiting for the backend answer...
                  </p>
                </div>
              )}
            </div>
            {messages.length === 0 && !loadingHistory && (
              <div className="chat-starters">
                {starters.map((starter) => (
                  <button key={starter} type="button" onClick={() => send(starter)} disabled={sending}>
                    {starter}
                  </button>
                ))}
              </div>
            )}
            <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); send() }}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your message..."
                disabled={sending}
              />
              <button type="submit" aria-label="Send message" disabled={sending || !input.trim()}>
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
