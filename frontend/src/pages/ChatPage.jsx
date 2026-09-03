import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Bot, Send, Sparkles, Loader } from 'lucide-react'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'
import { sendChatMessage, getChatHistory, getProfile } from '../api/minervaApi'
import {
  apiErrorMessage,
  extractChatAnswer,
  extractHighestScoredField,
  extractHistoryMessages,
  extractSessionId,
  extractSkillProfile,
} from '../api/backendContract'

const SESSION_KEY = 'minervaChatSessionId'
const starters = ['What should I learn next?', 'Which role fits my strengths?', 'Help me prepare for an interview']

const readStoredSessionId = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) || ''
  } catch {
    return ''
  }
}

const persistSessionId = (sessionId) => {
  if (!sessionId) return
  try {
    sessionStorage.setItem(SESSION_KEY, String(sessionId))
  } catch {
    // Ignore unavailable session storage.
  }
}

function ChatPage() {
  const { user } = useAuth()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(() => readStoredSessionId())
  const [skillProfile, setSkillProfile] = useState(null)
  const [highestScoredField, setHighestScoredField] = useState(null)
  const [profileReady, setProfileReady] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [sending, setSending] = useState(false)
  const [historyError, setHistoryError] = useState('')
  const [sendError, setSendError] = useState('')
  const [profileError, setProfileError] = useState('')
  const [pendingRetry, setPendingRetry] = useState('')
  const messagesEndRef = useRef(null)

  const captureSessionId = (payload) => {
    const nextSessionId = extractSessionId(payload)
    if (nextSessionId) {
      setSessionId(String(nextSessionId))
      persistSessionId(nextSessionId)
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
      setMessages(extractHistoryMessages(response))
    } catch (error) {
      setMessages([])
      setHistoryError(apiErrorMessage(error, 'Unable to load chat history from the backend.'))
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
        setSkillProfile(extractSkillProfile(profile))
        setHighestScoredField(extractHighestScoredField(profile))
      } catch (error) {
        if (!mounted) return
        setSkillProfile(null)
        setHighestScoredField(null)
        setProfileError(apiErrorMessage(error, 'Unable to load the backend profile required for chatbot context.'))
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
    const storedSessionId = readStoredSessionId()
    if (storedSessionId) {
      setSessionId(storedSessionId)
      loadHistory(storedSessionId)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
      if (skillProfile != null) payload.skillProfile = skillProfile
      if (highestScoredField) payload.highestScoredField = highestScoredField

      const response = await sendChatMessage(payload)
      console.log('Chat response:', response)
      if (response?.status === false) {
        throw new Error(response?.message || 'The chat API rejected this message.')
      }

      const nextSessionId = captureSessionId(response)
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
          setHistoryError(apiErrorMessage(historyLoadError, 'Message sent, but chat history could not be reloaded.'))
        }
      }

      if (!answer) {
        throw new Error('The chat API did not return an answer.')
      }

      setMessages((current) => [...current, { id: `assistant-${current.length}`, from: 'assistant', text: String(answer) }])
    } catch (error) {
      setPendingRetry(message)
      setSendError(apiErrorMessage(error, 'The chat API failed. No generated answer is available.'))
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="chat-page">
      <Container>
        <div className="chat-heading">
          <div>
            <p className="dashboard-kicker">CONTEXT-AWARE AI ASSISTANT</p>
            <h1>Think out loud with Minerva.</h1>
            <p>Your backend skill profile and highest scored field stay with the conversation.</p>
          </div>
          <Link to="/dashboard" className="dashboard-text-link">Dashboard <ArrowUpRight size={15} /></Link>
        </div>
        <div className="chat-shell">
          <aside className="chat-sidebar">
            <div className="chat-bot-mark"><Bot size={23} /></div>
            <h2>Minerva</h2>
            <p>Career intelligence from the backend profile, not a local fallback.</p>
            <div className="chat-context">
              <span>IN VIEW</span>
              {profileReady && highestScoredField ? (
                <>
                  <b>{highestScoredField}</b>
                  <small>Highest scored field from backend profile</small>
                </>
              ) : (
                <>
                  <b>Incomplete profile</b>
                  <small>{profileError || 'The backend has not provided a highest scored field yet. Complete an assessment first.'}</small>
                </>
              )}
            </div>
            <Link to="/explore/roadmap" className="dashboard-outline-action">Open roadmap <ArrowUpRight size={15} /></Link>
          </aside>
          <section className="chat-window">
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
            <div className="chat-messages">
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
              <div ref={messagesEndRef} />
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
                placeholder="Ask about your next move..."
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
