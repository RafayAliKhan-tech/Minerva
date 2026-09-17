import { useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, Clock3, Compass, ShieldAlert, Star, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import { useAuth } from '../auth/AuthContext'
import { getStoredSkillProfileView } from '../utils/skillProfile'

const level = (value) => value === null || value === undefined ? 'No evidence yet' : `Level ${value}`
const skillText = (skill) => `${skill.name} · ${level(skill.current)} → ${level(skill.target)}`

function SkillProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const view = useMemo(() => getStoredSkillProfileView(user), [user])
  const [selectedFields, setSelectedFields] = useState({})

  const selectField = (journey, value) => setSelectedFields((current) => ({ ...current, [journey]: value }))

  return (
    <main className="skill-profile-page">
      <Container>
        <button type="button" className="back-link" onClick={() => navigate('/dashboard')}><ArrowLeft size={16} /> Back to dashboard</button>
        <header className="skill-profile-hero">
          <p className="dashboard-kicker">UNIFORM SKILL PROFILE</p>
          <h1>Your skills, translated into a clearer next step.</h1>
          <p>One view of the strengths you bring, the skills to build, and the progress you have already made.</p>
        </header>

        {view.sources.length === 0 ? (
          <section className="skill-profile-empty"><Compass size={30} /><h2>Complete an assessment to build your profile.</h2><p>Your skill profile will appear here after Journey 1, 2, or 3 is complete.</p></section>
        ) : view.sources.map((profile) => {
          const selected = selectedFields[profile.journey] || profile.fields[0]?.id
          const field = profile.fields.find((item) => item.id === selected) || profile.fields[0]
          return (
            <section className="skill-profile-section" key={profile.journey}>
              <div className="skill-profile-section-heading">
                <div><span className="skill-profile-icon"><Compass size={18} /></span><div><p className="dashboard-kicker">{profile.journeyLabel}</p><h2>{profile.careers}</h2></div></div>
                {profile.missingCareer && <span className="skill-profile-note">Career was not included in the adapter output.</span>}
              </div>
              {profile.journey === 1 && (
                <div className="skill-profile-career-split">
                  <article><span>Highest scored fields</span><strong>{profile.careers}</strong><small>Based on your assessment scores.</small></article>
                  <article><span>Fields with roadmaps</span><strong>{profile.roadmapFields.length ? profile.roadmapFields.map((item) => item.replace(/[_-]+/g, ' ')).join(' · ') : 'No roadmaps yet'}</strong><small>Goals, strengths, and weak areas below follow the selected roadmap.</small></article>
                </div>
              )}
              {profile.fields.length > 1 && (
                <div className="skill-profile-field-switcher" role="tablist" aria-label={`${profile.journeyLabel} fields`}>
                  {profile.fields.map((item) => <button type="button" role="tab" aria-selected={selected === item.id} className={selected === item.id ? 'is-selected' : ''} key={item.id} onClick={() => selectField(profile.journey, item.id)}>{item.label}</button>)}
                </div>
              )}
              {field ? (
                <div className="skill-profile-grid">
                  <article className="skill-profile-card skill-profile-goal-card">
                    <header><Target size={18} /><div><h3>Goals</h3><p>Current level compared with the target for {field.label}.</p></div></header>
                    <div className="skill-profile-list">{field.skills.map((skill) => <div key={skill.skill_id || skill.name}><strong>{skill.name}</strong><span>{skillText(skill)}</span></div>)}</div>
                  </article>
                  <article className="skill-profile-card">
                    <header><Star size={18} /><div><h3>Strengths</h3><p>Skills closest to the target level.</p></div></header>
                    <div className="skill-profile-list">{field.strengths.length ? field.strengths.map((skill) => <div key={skill.skill_id || skill.name}><strong>{skill.name}</strong><span>{level(skill.current)}</span></div>) : <p className="skill-profile-muted">Your strongest signals will appear as more evidence is collected.</p>}</div>
                  </article>
                  <article className="skill-profile-card">
                    <header><ShieldAlert size={18} /><div><h3>Weak areas</h3><p>Skills with the most room to grow.</p></div></header>
                    <div className="skill-profile-list">{field.weakAreas.length ? field.weakAreas.map((skill) => <div key={skill.skill_id || skill.name}><strong>{skill.name}</strong><span>{skill.gap === null ? 'No evidence yet' : `${skill.gap} level${skill.gap === 1 ? '' : 's'} to close`}</span></div>) : <p className="skill-profile-muted">No significant gaps were identified for this field.</p>}</div>
                  </article>
                </div>
              ) : <p className="skill-profile-muted">Generate a roadmap for a field to see its translated goals.</p>}
            </section>
          )
        })}

        <section className="skill-profile-hours">
          <div><Clock3 size={22} /><div><p className="dashboard-kicker">WORK HOURS</p><h2>{view.completedHours} hours completed</h2><p>Based on roadmap work you have marked complete.</p></div></div>
          <div className="skill-profile-hours-detail"><BookOpen size={18} /> {view.roadmaps.length} roadmap{view.roadmaps.length === 1 ? '' : 's'} tracked</div>
        </section>
      </Container>
    </main>
  )
}

export default SkillProfilePage
