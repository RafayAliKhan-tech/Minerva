import { useEffect, useState } from 'react'
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
        // unwrap common shapes
        const payload = data.data || data
        if (mounted && payload) {
          const firstName = payload.firstName || payload.FirstName || ''
          const lastName = payload.lastName || payload.LastName || ''
          setProfile({ fullName: payload.fullName || payload.FullName || payload.displayName || payload.DisplayName || [firstName, lastName].filter(Boolean).join(' ') || payload.name || payload.userName || payload.UserName || '', email: payload.email || payload.Email || '' })
        }
      } catch (err) {
        console.error('Failed to load profile', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
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
      console.error(err)
      const msg = err?.response?.data?.message || 'Failed to save profile. Please try again.'
      setFormError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container as="section" className="py-16">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="mb-4 text-4xl font-display leading-tight text-brown">My Profile</h1>
        {loading ? (
          <p className="text-brown-light">Loading profile...</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Full Name</label>
              <input
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-beige-border bg-white/80 px-4 py-3 text-sm text-brown placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-orange/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-brown">Email Address</label>
              <input
                required
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-beige-border bg-white/80 px-4 py-3 text-sm text-brown placeholder:text-brown-light focus:outline-none focus:ring-2 focus:ring-orange/20"
              />
            </div>

            <div>
              {formError && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{formError}</p>}
              {formMessage && <p className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700" role="status">{formMessage}</p>}
              <Button type="submit" variant="dark" size="lg" className="w-full" disabled={saving}>
                {saving ? 'Saving…' : 'Save Profile'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Container>
  )
}

export default ProfilePage
