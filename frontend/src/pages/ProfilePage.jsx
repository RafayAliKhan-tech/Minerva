import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import api from '../api/axiosInstance'

function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [profile, setProfile] = useState({ fullName: '', email: '' })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get('/api/profile/getprofile')
        const data = res.data || {}
        const payload = data.data || data
        if (mounted && payload) {
          const firstName = payload.firstName || payload.FirstName || ''
          const lastName = payload.lastName || payload.LastName || ''
          setProfile({
            fullName:
              payload.fullName ||
              payload.FullName ||
              payload.displayName ||
              payload.DisplayName ||
              [firstName, lastName].filter(Boolean).join(' ') ||
              payload.name ||
              payload.userName ||
              payload.UserName ||
              '',
            email: payload.email || payload.Email || '',
          })
        }
      } catch (err) {
        console.error('Failed to load profile', err)
        if (mounted) setFormError('Unable to load profile from the server.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormMessage('')
    setFormError('')
    try {
      const res = await api.put('/api/profile/updateprofile', profile)
      const data = res.data || {}
      setFormMessage(data?.message || 'Profile updated successfully.')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save profile. Please try again.'
      setFormError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="profile-page">
      <Container>
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <div className="profile-card">
          <p className="dashboard-kicker">Account</p>
          <h1>My profile</h1>
          <p className="dashboard-subtitle" style={{ marginBottom: '1rem' }}>
            Update the name and email associated with your Minerva account.
          </p>
          {loading ? (
            <p className="text-brown-light">Loading profile…</p>
          ) : (
            <form onSubmit={handleSave}>
              <div className="field">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  required
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              {formError && (
                <p className="auth-form-error" role="alert" style={{ marginTop: '1rem' }}>
                  {formError}
                </p>
              )}
              {formMessage && (
                <p className="auth-form-success" role="status" style={{ marginTop: '1rem' }}>
                  {formMessage}
                </p>
              )}
              <div style={{ marginTop: '1.25rem' }}>
                <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={saving}>
                  {saving ? 'Saving…' : 'Save profile'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </main>
  )
}

export default ProfilePage
