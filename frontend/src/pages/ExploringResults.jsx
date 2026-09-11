// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import AssessmentLayout from '../components/assessment/AssessmentLayout'
// import Button from '../components/common/Button'
// import { Sparkles, ArrowRight, Zap, Loader, Code2, Palette, BarChart3, Brain, Shield, ArrowUpRight, CheckCircle2 } from 'lucide-react'
// import { generateRoadmap, getJourney1Result } from '../api/minervaApi'
// import { useAuth } from '../auth/AuthContext'
// import { saveLatestAssessment, saveJourney1Result, saveRoadmap } from '../utils/userData'
// import { getProfessionalSkillInsight, getSkillInsights } from '../utils/skillInsights'

// const extractJourney1Data = (payload) => payload?.career_recommendation ? payload : null
// const unwrapRoadmapResponse = (payload) => {
//   if (!payload || typeof payload !== 'object') return payload
//   if (payload.data && typeof payload.data === 'object') return unwrapRoadmapResponse(payload.data)
//   return payload
// }

// const careerCards = [
//   { id: 'development', name: 'Software Development', icon: Code2, accent: 'text-blue-700 bg-blue-50 border-blue-100', description: 'Build products, APIs, and reliable systems that solve real problems.' },
//   { id: 'ui_ux', name: 'UI/UX Design', icon: Palette, accent: 'text-pink-700 bg-pink-50 border-pink-100', description: 'Shape clear, useful experiences through research, interaction, and visual craft.' },
//   { id: 'data', name: 'Data & Analytics', icon: BarChart3, accent: 'text-emerald-700 bg-emerald-50 border-emerald-100', description: 'Turn raw information into decisions, stories, and measurable outcomes.' },
//   { id: 'ai', name: 'AI & Machine Learning', icon: Brain, accent: 'text-orange-700 bg-orange-50 border-orange-100', description: 'Create intelligent systems with data, experimentation, and responsible model thinking.' },
//   { id: 'cyber', name: 'Cybersecurity', icon: Shield, accent: 'text-red-700 bg-red-50 border-red-100', description: 'Protect applications and people by thinking like both a builder and an adversary.' },
// ]

// const getCareerPercentage = (careerScores, careerId) => {
//   const score = Array.isArray(careerScores)
//     ? careerScores.find((item) => item?.career_id === careerId)
//     : careerScores?.[careerId]
//   return Number(typeof score === 'object' ? score?.percentage : score || 0)
// }
// const normalizeCareerId = (value) => {
//   const normalized = String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
//   const aliases = {
//     software_development: 'development',
//     software_engineering: 'development',
//     ui_ux_design: 'ui_ux',
//     data_analytics: 'data',
//     artificial_intelligence: 'ai',
//     machine_learning: 'ai',
//     cybersecurity: 'cyber',
//     cyber_security: 'cyber',
//   }
//   return aliases[normalized] || normalized
// }
// const getRoadmapCareer = (roadmap) => roadmap?.career || roadmap?.domain || roadmap?.target_role || roadmap?.targetRole
// const getSignalText = (signal) => {
//   if (typeof signal === 'string') return signal
//   return signal?.description || signal?.signal || signal?.text || signal?.name || JSON.stringify(signal)
// }
// const getSignalCareer = (signal) => signal?.career || signal?.field || signal?.domain || ''
// const fieldMatches = (career, selectedField) => {
//   if (selectedField === 'all' || !career) return true
//   return normalizeCareerId(career) === normalizeCareerId(selectedField)
// }
// const filterByField = (items, selectedField) => items.filter((item) => fieldMatches(item.career, selectedField))
// const generateSampleCurriculum = (domain, matchScore) => {
//   const curriculumByDomain = {
//     'UI/UX Design': {
//       weeks: 12,
//       level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
//       phases: [
//         { week: 1, title: 'Design Fundamentals', topics: ['Color Theory', 'Typography', 'Layout Principles'], status: 'upcoming' },
//         { week: 2, title: 'Wireframing Basics', topics: ['Low Fidelity', 'User Flow', 'Information Architecture'], status: 'upcoming' },
//         { week: 3, title: 'Prototyping Tools', topics: ['Figma', 'Adobe XD', 'Sketch'], status: 'upcoming' },
//         { week: 4, title: 'User Research', topics: ['User Testing', 'Interviews', 'Personas'], status: 'upcoming' },
//       ],
//       resources: [
//         { type: 'course', title: 'UI/UX Design Masterclass', platform: 'Udemy' },
//         { type: 'project', title: 'Redesign Personal Portfolio', difficulty: 'Beginner' },
//         { type: 'practice', title: 'Daily Design Challenge', platform: 'Dribbble' },
//       ]
//     },
//     'Development': {
//       weeks: 16,
//       level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
//       phases: [
//         { week: 1, title: 'JavaScript Fundamentals', topics: ['Variables', 'Functions', 'DOM'], status: 'upcoming' },
//         { week: 2, title: 'React Basics', topics: ['Components', 'State', 'Props'], status: 'upcoming' },
//         { week: 3, title: 'Backend Basics', topics: ['Node.js', 'Express', 'REST APIs'], status: 'upcoming' },
//         { week: 4, title: 'Database', topics: ['SQL', 'MongoDB', 'Data Modeling'], status: 'upcoming' },
//       ],
//       resources: [
//         { type: 'course', title: 'Full Stack Web Development', platform: 'Coursera' },
//         { type: 'project', title: 'Build a Todo App', difficulty: 'Beginner' },
//         { type: 'practice', title: 'LeetCode Problems', platform: 'LeetCode' },
//       ]
//     },
//     'Data Analytics': {
//       weeks: 12,
//       level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
//       phases: [
//         { week: 1, title: 'Data Basics', topics: ['Statistics', 'Probability', 'Excel'], status: 'upcoming' },
//         { week: 2, title: 'Python for Data', topics: ['Pandas', 'NumPy', 'Data Cleaning'], status: 'upcoming' },
//         { week: 3, title: 'Data Visualization', topics: ['Matplotlib', 'Tableau', 'Power BI'], status: 'upcoming' },
//         { week: 4, title: 'SQL & Databases', topics: ['SQL Queries', 'Database Design'], status: 'upcoming' },
//       ],
//       resources: [
//         { type: 'course', title: 'Data Analytics Bootcamp', platform: 'Google Career Certificates' },
//         { type: 'project', title: 'Analyze Public Dataset', difficulty: 'Beginner' },
//         { type: 'practice', title: 'Kaggle Competitions', platform: 'Kaggle' },
//       ]
//     },
//     'Artificial Intelligence': {
//       weeks: 20,
//       level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
//       phases: [
//         { week: 1, title: 'Math Foundations', topics: ['Linear Algebra', 'Calculus', 'Statistics'], status: 'upcoming' },
//         { week: 2, title: 'Python Advanced', topics: ['OOP', 'Data Structures', 'Algorithms'], status: 'upcoming' },
//         { week: 3, title: 'Machine Learning', topics: ['Supervised Learning', 'Unsupervised Learning', 'Scikit-learn'], status: 'upcoming' },
//         { week: 4, title: 'Deep Learning', topics: ['Neural Networks', 'TensorFlow', 'PyTorch'], status: 'upcoming' },
//       ],
//       resources: [
//         { type: 'course', title: 'Machine Learning Specialization', platform: 'Coursera' },
//         { type: 'project', title: 'Build a Classification Model', difficulty: 'Intermediate' },
//         { type: 'practice', title: 'Research Papers', platform: 'ArXiv' },
//       ]
//     },
//     'Cybersecurity': {
//       weeks: 14,
//       level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
//       phases: [
//         { week: 1, title: 'Security Basics', topics: ['Encryption', 'Authentication', 'Firewalls'], status: 'upcoming' },
//         { week: 2, title: 'Network Security', topics: ['TCP/IP', 'VPN', 'Intrusion Detection'], status: 'upcoming' },
//         { week: 3, title: 'Ethical Hacking', topics: ['Penetration Testing', 'Vulnerability Assessment'], status: 'upcoming' },
//         { week: 4, title: 'Compliance & Risk', topics: ['GDPR', 'ISO 27001', 'Risk Management'], status: 'upcoming' },
//       ],
//       resources: [
//         { type: 'course', title: 'Cybersecurity Fundamentals', platform: 'CompTIA Security+' },
//         { type: 'project', title: 'Build a Secure App', difficulty: 'Intermediate' },
//         { type: 'practice', title: 'HackTheBox', platform: 'HackTheBox' },
//       ]
//     }
//   }

//   return curriculumByDomain[domain] || {
//     weeks: 12,
//     level: 'Beginner',
//     phases: [],
//     resources: []
//   }
// }

// function ExploringResults() {
//   const navigate = useNavigate()
//   const { user } = useAuth()
//   const [journey1Data, setJourney1Data] = useState(null)
//   const [journey1Result, setJourney1Result] = useState(null)
//   const [resultError, setResultError] = useState('')
//   const [roadmapError, setRoadmapError] = useState('')
//   const [generatingCareer, setGeneratingCareer] = useState('')
//   const [selectedField, setSelectedField] = useState('all')
//   const [showCareerMatches, setShowCareerMatches] = useState(false)

//   useEffect(() => {
//     ;(async () => {
//       const assessmentId = sessionStorage.getItem('journey1AssessmentId')

//       if (!assessmentId) {
//         setResultError('No Journey 1 assessment result is available yet. Please complete the assessment again.')
//         return
//       }

//       try {
//         const server = await getJourney1Result(assessmentId)
//         console.log('GetJourney1Result unwrapped response:', server)
//         const journey1Results = extractJourney1Data(server)

//         if (!journey1Results) {
//           throw new Error('Journey 1 response did not include career recommendation data.')
//         }

//         setJourney1Data(journey1Results)
//         setJourney1Result(server)
//         saveJourney1Result(user, journey1Results)
//         sessionStorage.setItem('journey1Result', JSON.stringify(server))
//         setResultError('')
//         saveLatestAssessment(user, {
//           type: 'exploring',
//           label: 'Exploration assessment',
//           domain: 'exploring',
//           score: null,
//           source: 'journey1',
//           assessmentId,
//         })
//       } catch (e) {
//         console.error('fetch exploring result failed from Journey 1', e)
//         setJourney1Data(null)
//         setResultError('We could not load your Journey 1 result from the backend. Please try again or start the assessment over.')
//       }

//     })()
//   }, [user])

//   if (resultError) {
//     return (
//       <AssessmentLayout onBack={() => navigate('/explore/assessment')} showProgress={false}>
//         <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-card sm:p-12">
//           <h1 className="font-serif text-3xl font-semibold text-brown sm:text-4xl">Journey 1 result unavailable</h1>
//           <p className="mt-4 text-base text-brown-light">{resultError}</p>
//           <div className="mt-8">
//             <Button onClick={() => navigate('/explore/assessment')} variant="dark" size="lg">
//               Restart the assessment
//             </Button>
//           </div>
//         </div>
//       </AssessmentLayout>
//     )
//   }

//   if (!journey1Data) {
//     return (
//       <AssessmentLayout onBack={() => navigate('/')}>
//         <p className="text-center text-brown-light">Loading your Journey 1 results...</p>
//       </AssessmentLayout>
//     )
//   }

//   const careerScores = journey1Data.career_recommendation?.deterministic_career_scores || []
//   const skillInsights = getSkillInsights(journey1Data)
//   const professionalStrengths = skillInsights.strengths.map((skill) => getProfessionalSkillInsight(skill, 'strength'))
//   const professionalDevelopmentAreas = skillInsights.weaknesses.map((skill) => getProfessionalSkillInsight(skill, 'development'))
//   const filteredStrengths = filterByField(professionalStrengths, selectedField)
//   const filteredDevelopmentAreas = filterByField(professionalDevelopmentAreas, selectedField)
//   const strongestSignals = filterByField(
//     (journey1Data.strengths || []).map((signal) => ({
//       text: getSignalText(signal),
//       career: getSignalCareer(signal),
//     })),
//     selectedField,
//   )

//   const handleGenerateRoadmap = async (careerMatch) => {
//     const realAssessmentId = sessionStorage.getItem('journey1AssessmentId')
//     if (!realAssessmentId || !journey1Result) {
//       setRoadmapError('Your backend Journey 1 result is not available. Please complete the assessment again.')
//       return
//     }

//     const careerName = careerMatch.id
//     const matchScore = Number(careerMatch.percentage)
//     const payload = {
//       journey: 1,
//       weekly_hours: 5,
//       journey_output: journey1Result,
//       career: careerName,
//       target_role: careerName,
//       use_model: false,
//     }

//     try {
//       setGeneratingCareer(careerName)
//       setRoadmapError('')
//       const created = await generateRoadmap(payload)
//       console.groupCollapsed('[Journey1] Roadmap response')
//       console.debug('raw response:', created)
//       console.debug('engine version:', created?.engine_version || created?.engineVersion || 'missing')
//       console.debug('payload:', JSON.stringify(created, null, 2))
//       console.groupEnd()
//       const envelope = unwrapRoadmapResponse(created)
//       const raw = envelope?.result || envelope || {}
//       const returnedRoadmaps = Array.isArray(raw) ? raw : [raw]
//       console.debug('[Journey1] Returned roadmap careers:', returnedRoadmaps.map(getRoadmapCareer).filter(Boolean))
//       const responseData = Array.isArray(raw)
//         ? raw.find((roadmap) => normalizeCareerId(getRoadmapCareer(roadmap)) === normalizeCareerId(careerName)) || {}
//         : (typeof raw === 'object' ? raw : {})
//       if (Array.isArray(raw) && !getRoadmapCareer(responseData)) {
//         throw new Error(`The backend did not return a roadmap for ${careerName}.`)
//       }
//       const roadmapId = envelope?.roadmap_id || envelope?.roadmapId || envelope?.id || responseData.roadmap_id || responseData.roadmapId || responseData.id

//       if (!roadmapId) {
//         throw new Error(`The Journey 1 roadmap API did not return a valid roadmap ID. Response: ${JSON.stringify(created)}`)
//       }

//       const savedRoadmap = {
//         id: roadmapId,
//         domain: responseData.career || responseData.domain || careerName,
//         domainId: responseData.domainId || payload.domainId || careerMatch.id,
//         matchScore: Number(responseData.matchScore ?? matchScore),
//         strengths: responseData.strengths || payload.strengths || [],
//         areasToImprove: responseData.areasToImprove || payload.areasToImprove || payload.weak_areas || [],
//         curriculum: responseData.curriculum || { phases: responseData.phases || [], weeks: responseData.timeline?.total_duration_weeks || 12 },
//         status: 'generated',
//         createdAt: new Date().toISOString(),
//       }

//       saveRoadmap(user, savedRoadmap)
//       navigate(`/roadmap-detail/${roadmapId}`, {
//         state: {
//           ...savedRoadmap,
//           returnTo: { pathname: '/explore/assessment/results', state: { fromJourney1: true } },
//         },
//       })
//     } catch (error) {
//       console.error('Roadmap generation failed for exploring result:', error, error?.response?.data)
//       setRoadmapError(error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.detail || error?.response?.data?.title || error?.message || 'We could not generate your Journey 1 roadmap. Please try again.')
//     } finally {
//       setGeneratingCareer('')
//     }
//   }

//   return (
//     <AssessmentLayout
//       onBack={() => navigate('/')}
//       showProgress={false}
//       contentClassName="max-w-6xl"
//     >
//       {/* Main card */}
//       <div className="overflow-hidden rounded-[2rem] border border-beige-border bg-white shadow-card">
//         <div className="border-b border-beige-border bg-gradient-to-br from-[#f8f7f4] via-white to-[#efede9] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
//           <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
//             <div className="max-w-2xl">
//               <div className="inline-flex items-center gap-2 rounded-full border border-beige-border bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brown-light">
//                 <Sparkles className="h-3.5 w-3.5 text-orange" aria-hidden="true" />
//                 Journey 1 complete
//               </div>
//               <h1 className="mt-5 max-w-xl font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-brown sm:text-5xl lg:text-6xl">
//                 A clearer view of where you can go next.
//               </h1>
//               <p className="mt-5 max-w-xl text-base leading-relaxed text-brown-light sm:text-lg">
//                 Your assessment highlights the patterns, capabilities, and career directions that are most relevant to you right now.
//               </p>
//             </div>
//             <div className="rounded-2xl border border-beige-border bg-white/80 p-5 shadow-sm lg:min-w-56">
//               <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brown-light">Your result</p>
//               <p className="mt-2 font-serif text-2xl font-semibold text-brown">Personalized insights</p>
//               <p className="mt-2 text-sm leading-relaxed text-brown-light">Use these signals as a starting point, not a limit.</p>
//             </div>
//           </div>
//           <div className="mt-10 grid gap-3 sm:grid-cols-3">
//             {[
//               { value: strongestSignals.length, label: 'strongest signals' },
//               { value: filteredStrengths.length + filteredDevelopmentAreas.length, label: 'profile insights' },
//               { value: careerCards.length, label: 'career directions' },
//             ].map((stat) => (
//               <div key={stat.label} className="rounded-2xl border border-beige-border bg-white/70 px-4 py-4">
//                 <p className="font-serif text-3xl font-semibold text-brown">{stat.value}</p>
//                 <p className="mt-1 text-xs font-semibold uppercase tracking-[0.13em] text-brown-light">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="p-6 sm:p-10 lg:p-14">
//         <div className="max-w-4xl">
//           <section className="rounded-3xl border border-beige-border bg-cream-dark/60 p-6 sm:p-7">
//             <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">01 / Strongest signals</p>
//                 <h2 className="mt-1 font-serif text-2xl font-semibold text-brown">What stands out most</h2>
//                 <p className="mt-2 text-sm text-brown-light">Choose a field to see the signals most relevant to that direction.</p>
//               </div>
//               <label className="text-sm font-semibold text-brown">
//                 Field
//                 <select value={selectedField} onChange={(event) => setSelectedField(event.target.value)} className="mt-2 block w-full rounded-xl border border-beige-border bg-white px-3 py-2 font-medium text-brown sm:w-56">
//                   <option value="all">All fields</option>
//                   {careerCards.map((career) => <option key={career.id} value={career.id}>{career.name}</option>)}
//                 </select>
//               </label>
//             </div>
//             <div className="mt-6 space-y-3">
//               {strongestSignals.length > 0
//                 ? strongestSignals.map((signal, index) => (
//                   <div key={`${signal.text}-${index}`} className="flex gap-3 rounded-2xl border border-beige-border bg-white p-4">
//                     <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-journey-green text-journey-green-dark"><Sparkles className="h-4 w-4" aria-hidden="true" /></div>
//                     <div>
//                       <p className="text-base text-brown-light">{signal.text}</p>
//                       {signal.career && <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-brown-light">{signal.career}</p>}
//                     </div>
//                   </div>
//                 ))
//                 : <p className="rounded-2xl bg-white p-5 text-sm text-brown-light">No strongest signals were found for this field yet.</p>}
//             </div>
//           </section>

//           <section className="mt-8 rounded-3xl border border-beige-border bg-white p-6 shadow-card sm:p-7">
//             <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
//               <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-journey-green text-journey-green-dark"><Sparkles className="h-5 w-5" aria-hidden="true" /></div>
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">02 / Overall skill profile</p>
//                 <h2 className="mt-1 font-serif text-2xl font-semibold text-brown">Strengths and areas to grow</h2>
//                 <p className="mt-2 text-sm leading-relaxed text-brown-light">A more detailed view of what you already do well and what will help you build readiness.</p>
//               </div>
//               </div>
//               <label className="text-sm font-semibold text-brown">
//                 View by field
//                 <select value={selectedField} onChange={(event) => setSelectedField(event.target.value)} className="mt-2 block w-full rounded-xl border border-beige-border bg-cream-dark px-3 py-2 font-medium text-brown sm:w-56">
//                   <option value="all">All fields</option>
//                   {careerCards.map((career) => <option key={career.id} value={career.id}>{career.name}</option>)}
//                 </select>
//               </label>
//             </div>
//             <div className="mt-6 grid gap-6 lg:grid-cols-2">
//               <div>
//                 <h3 className="font-semibold text-brown">Strengths</h3>
//                 <div className="mt-4 space-y-4">
//                   {filteredStrengths.length > 0 ? filteredStrengths.map((skill) => (
//                     <article key={`${skill.career}-${skill.name}`} className="rounded-2xl border border-journey-green-dark/15 bg-cream-dark/50 p-5">
//                       <h4 className="text-lg font-semibold text-brown">{skill.name}</h4>
//                       <p className="mt-1 text-sm font-medium text-brown-light">{skill.career}</p>
//                       <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-journey-green px-3 py-1.5 text-xs font-semibold text-journey-green-dark"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />{skill.proficiency}</div>
//                       <p className="mt-4 text-sm leading-relaxed text-brown-light">{skill.explanation}</p>
//                     </article>
//                   )) : <p className="rounded-2xl bg-cream-dark/50 p-5 text-sm text-brown-light">No strengths are available for this field yet.</p>}
//                 </div>
//               </div>
//               <div>
//                 <h3 className="font-semibold text-brown">Areas for development</h3>
//                 <div className="mt-4 space-y-4">
//                   {filteredDevelopmentAreas.length > 0 ? filteredDevelopmentAreas.map((skill) => (
//                     <article key={`${skill.career}-${skill.name}`} className="rounded-2xl border border-orange/15 bg-orange-pill/50 p-5">
//                       <h4 className="text-lg font-semibold text-brown">{skill.name}</h4>
//                       <p className="mt-1 text-sm font-medium text-brown-light">{skill.career}</p>
//                       <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange-pill px-3 py-1.5 text-xs font-semibold text-brown"><ArrowUpRight className="h-4 w-4" aria-hidden="true" />{skill.proficiency}</div>
//                       <p className="mt-4 text-sm leading-relaxed text-brown-light">{skill.explanation}</p>
//                     </article>
//                   )) : <p className="rounded-2xl bg-orange-pill/50 p-5 text-sm text-brown-light">No development areas are available for this field yet.</p>}
//                 </div>
//               </div>
//             </div>
//           </section>

//           <section className="mt-8 rounded-3xl border border-orange/20 bg-orange-pill p-6 sm:p-7">
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">03 / Recommended next step</p>
//             <h2 className="mt-1 font-serif text-2xl font-semibold text-brown">Turn your insight into a roadmap</h2>
//             <p className="mt-2 text-sm leading-relaxed text-brown-light">{typeof journey1Data.recommended_next_step === 'string' ? journey1Data.recommended_next_step : 'Choose the career direction that feels most motivating, then generate a practical roadmap to build on your strengths.'}</p>
//             <button type="button" onClick={() => setShowCareerMatches((current) => !current)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brown px-5 py-3 font-semibold text-white transition hover:bg-orange">
//               {showCareerMatches ? 'Hide career matches' : 'See career matches'} <ArrowRight className={`h-4 w-4 transition-transform ${showCareerMatches ? 'rotate-90' : ''}`} aria-hidden="true" />
//             </button>
//           </section>

//           {showCareerMatches && (
//             <section className="mt-8">
//               <h2 className="font-serif text-2xl font-semibold text-brown">Career matches</h2>
//               <p className="mt-2 text-sm text-brown-light">Compare your options and generate a roadmap when you are ready.</p>
//               {roadmapError && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{roadmapError}</p>}
//               <div className="mt-5 grid gap-5 sm:grid-cols-2">
//                 {careerCards.map((career) => {
//                   const percentage = getCareerPercentage(careerScores, career.id)
//                   const Icon = career.icon
//                   return (
//                     <article key={career.id} className="group flex h-full flex-col rounded-2xl border border-beige-border bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
//                       <div className="flex items-start justify-between gap-4">
//                         <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${career.accent}`}><Icon className="h-6 w-6" aria-hidden="true" /></div>
//                         <div className="text-right"><p className="text-2xl font-bold text-brown">{percentage}%</p><p className="text-xs font-semibold uppercase tracking-wider text-brown-light">match</p></div>
//                       </div>
//                       <h3 className="mt-5 font-serif text-2xl font-semibold text-brown">{career.name}</h3>
//                       <p className="mt-2 min-h-12 text-sm leading-relaxed text-brown-light">{career.description}</p>
//                       <div className="mt-5 h-2 overflow-hidden rounded-full bg-brown/10"><div className="h-full rounded-full bg-gradient-to-r from-orange to-orange-dark transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} /></div>
//                       <button type="button" onClick={() => handleGenerateRoadmap({ ...career, percentage })} disabled={Boolean(generatingCareer)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brown px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-orange hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
//                         {generatingCareer === career.id ? <><Loader className="h-4 w-4 animate-spin" aria-hidden="true" /> Generating roadmap...</> : <><Zap className="h-4 w-4" aria-hidden="true" /> Generate Roadmap <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></>}
//                       </button>
//                     </article>
//                   )
//                 })}
//               </div>
//             </section>
//           )}

//           {/* Info note */}
//           <div className="mt-12 rounded-2xl bg-orange-pill p-6">
//             <p className="text-sm text-brown">
//               <span className="font-semibold">Note:</span> These career scores are calculated from your Journey 1 assessment results.
//             </p>
//           </div>

//           {/* CTA */}
//           <div className="mt-12 flex flex-col gap-3 sm:flex-row">
//             <Button
//               to="/explore/domain-selection"
//               variant="dark"
//               size="lg"
//               icon={ArrowRight}
//               className="flex-1"
//             >
//               Explore a Domain
//             </Button>
//             <Button
//               to="/dashboard"
//               variant="ghost"
//               size="lg"
//               className="flex-1"
//             >
//               Back to Home
//             </Button>
//           </div>
//         </div>
//         </div>
//       </div>
//     </AssessmentLayout>
//   )
// }

// export default ExploringResults
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AssessmentLayout from '../components/assessment/AssessmentLayout'
import Button from '../components/common/Button'
import { Sparkles, ArrowRight, Zap, Loader, Code2, Palette, BarChart3, Brain, Shield, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { generateRoadmap, getJourney1Result } from '../api/minervaApi'
import { useAuth } from '../auth/AuthContext'
import { saveLatestAssessment, saveJourney1Result, saveRoadmap } from '../utils/userData'
import { getProfessionalSkillInsight, getSkillInsights } from '../utils/skillInsights'

const extractJourney1Data = (payload) => payload?.career_recommendation ? payload : null
const unwrapRoadmapResponse = (payload) => {
  if (!payload || typeof payload !== 'object') return payload
  if (payload.data && typeof payload.data === 'object') return unwrapRoadmapResponse(payload.data)
  return payload
}

const careerCards = [
  { id: 'development', name: 'Software Development', icon: Code2, accent: 'text-blue-700 bg-blue-50 border-blue-100', description: 'Build products, APIs, and reliable systems that solve real problems.' },
  { id: 'ui_ux', name: 'UI/UX Design', icon: Palette, accent: 'text-pink-700 bg-pink-50 border-pink-100', description: 'Shape clear, useful experiences through research, interaction, and visual craft.' },
  { id: 'data', name: 'Data & Analytics', icon: BarChart3, accent: 'text-emerald-700 bg-emerald-50 border-emerald-100', description: 'Turn raw information into decisions, stories, and measurable outcomes.' },
  { id: 'ai', name: 'AI & Machine Learning', icon: Brain, accent: 'text-orange-700 bg-orange-50 border-orange-100', description: 'Create intelligent systems with data, experimentation, and responsible model thinking.' },
  { id: 'cyber', name: 'Cybersecurity', icon: Shield, accent: 'text-red-700 bg-red-50 border-red-100', description: 'Protect applications and people by thinking like both a builder and an adversary.' },
]

const normalizeCareerId = (value) => {
  const normalized = String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  const aliases = {
    software_development: 'development',
    software_engineering: 'development',
    ui_ux_design: 'ui_ux',
    data_analytics: 'data',
    artificial_intelligence: 'ai',
    machine_learning: 'ai',
    cybersecurity: 'cyber',
    cyber_security: 'cyber',
  }
  return aliases[normalized] || normalized
}
const getCareerPercentage = (careerScores, careerId) => {
  const normalizedCareerId = normalizeCareerId(careerId)
  const score = Array.isArray(careerScores)
    ? careerScores.find((item) => normalizeCareerId(item?.career_id || item?.career || item?.name) === normalizedCareerId)
    : Object.entries(careerScores || {}).find(([key]) => normalizeCareerId(key) === normalizedCareerId)?.[1]
  const value = typeof score === 'object' ? score?.percentage : score
  return Number(value ?? 0)
}
const getRoadmapCareer = (roadmap) => roadmap?.career || roadmap?.domain || roadmap?.target_role || roadmap?.targetRole
const getSignalText = (signal) => {
  if (typeof signal === 'string') return signal.includes(':') ? signal.slice(signal.indexOf(':') + 1).trim() : signal
  return signal?.description || signal?.signal || signal?.text || signal?.name || JSON.stringify(signal)
}
const getSignalCareer = (signal) => {
  if (typeof signal === 'string' && signal.includes(':')) return signal.slice(0, signal.indexOf(':')).trim()
  return signal?.career || signal?.field || signal?.domain || ''
}
const fieldMatches = (career, selectedField) => {
  if (selectedField === 'all' || !career) return true
  return normalizeCareerId(career) === normalizeCareerId(selectedField)
}
const filterByField = (items, selectedField) => items.filter((item) => fieldMatches(item.career, selectedField))
const generateSampleCurriculum = (domain, matchScore) => {
  const curriculumByDomain = {
    'UI/UX Design': {
      weeks: 12,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Design Fundamentals', topics: ['Color Theory', 'Typography', 'Layout Principles'], status: 'upcoming' },
        { week: 2, title: 'Wireframing Basics', topics: ['Low Fidelity', 'User Flow', 'Information Architecture'], status: 'upcoming' },
        { week: 3, title: 'Prototyping Tools', topics: ['Figma', 'Adobe XD', 'Sketch'], status: 'upcoming' },
        { week: 4, title: 'User Research', topics: ['User Testing', 'Interviews', 'Personas'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'UI/UX Design Masterclass', platform: 'Udemy' },
        { type: 'project', title: 'Redesign Personal Portfolio', difficulty: 'Beginner' },
        { type: 'practice', title: 'Daily Design Challenge', platform: 'Dribbble' },
      ]
    },
    'Development': {
      weeks: 16,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'JavaScript Fundamentals', topics: ['Variables', 'Functions', 'DOM'], status: 'upcoming' },
        { week: 2, title: 'React Basics', topics: ['Components', 'State', 'Props'], status: 'upcoming' },
        { week: 3, title: 'Backend Basics', topics: ['Node.js', 'Express', 'REST APIs'], status: 'upcoming' },
        { week: 4, title: 'Database', topics: ['SQL', 'MongoDB', 'Data Modeling'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Full Stack Web Development', platform: 'Coursera' },
        { type: 'project', title: 'Build a Todo App', difficulty: 'Beginner' },
        { type: 'practice', title: 'LeetCode Problems', platform: 'LeetCode' },
      ]
    },
    'Data Analytics': {
      weeks: 12,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Data Basics', topics: ['Statistics', 'Probability', 'Excel'], status: 'upcoming' },
        { week: 2, title: 'Python for Data', topics: ['Pandas', 'NumPy', 'Data Cleaning'], status: 'upcoming' },
        { week: 3, title: 'Data Visualization', topics: ['Matplotlib', 'Tableau', 'Power BI'], status: 'upcoming' },
        { week: 4, title: 'SQL & Databases', topics: ['SQL Queries', 'Database Design'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Data Analytics Bootcamp', platform: 'Google Career Certificates' },
        { type: 'project', title: 'Analyze Public Dataset', difficulty: 'Beginner' },
        { type: 'practice', title: 'Kaggle Competitions', platform: 'Kaggle' },
      ]
    },
    'Artificial Intelligence': {
      weeks: 20,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Math Foundations', topics: ['Linear Algebra', 'Calculus', 'Statistics'], status: 'upcoming' },
        { week: 2, title: 'Python Advanced', topics: ['OOP', 'Data Structures', 'Algorithms'], status: 'upcoming' },
        { week: 3, title: 'Machine Learning', topics: ['Supervised Learning', 'Unsupervised Learning', 'Scikit-learn'], status: 'upcoming' },
        { week: 4, title: 'Deep Learning', topics: ['Neural Networks', 'TensorFlow', 'PyTorch'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Machine Learning Specialization', platform: 'Coursera' },
        { type: 'project', title: 'Build a Classification Model', difficulty: 'Intermediate' },
        { type: 'practice', title: 'Research Papers', platform: 'ArXiv' },
      ]
    },
    'Cybersecurity': {
      weeks: 14,
      level: matchScore > 70 ? 'Intermediate' : matchScore > 40 ? 'Beginner' : 'Basic',
      phases: [
        { week: 1, title: 'Security Basics', topics: ['Encryption', 'Authentication', 'Firewalls'], status: 'upcoming' },
        { week: 2, title: 'Network Security', topics: ['TCP/IP', 'VPN', 'Intrusion Detection'], status: 'upcoming' },
        { week: 3, title: 'Ethical Hacking', topics: ['Penetration Testing', 'Vulnerability Assessment'], status: 'upcoming' },
        { week: 4, title: 'Compliance & Risk', topics: ['GDPR', 'ISO 27001', 'Risk Management'], status: 'upcoming' },
      ],
      resources: [
        { type: 'course', title: 'Cybersecurity Fundamentals', platform: 'CompTIA Security+' },
        { type: 'project', title: 'Build a Secure App', difficulty: 'Intermediate' },
        { type: 'practice', title: 'HackTheBox', platform: 'HackTheBox' },
      ]
    }
  }

  return curriculumByDomain[domain] || {
    weeks: 12,
    level: 'Beginner',
    phases: [],
    resources: []
  }
}

function ExploringResults() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [journey1Data, setJourney1Data] = useState(null)
  const [journey1Result, setJourney1Result] = useState(null)
  const [resultError, setResultError] = useState('')
  const [roadmapError, setRoadmapError] = useState('')
  const [generatingCareer, setGeneratingCareer] = useState('')
  const [selectedSignalField, setSelectedSignalField] = useState('all')
  const [selectedProfileField, setSelectedProfileField] = useState('all')
  const [showCareerMatches, setShowCareerMatches] = useState(false)

  useEffect(() => {
    ;(async () => {
      const assessmentId = sessionStorage.getItem('journey1AssessmentId')

      if (!assessmentId) {
        setResultError('No Journey 1 assessment result is available yet. Please complete the assessment again.')
        return
      }

      try {
        const server = await getJourney1Result(assessmentId)
        console.log('GetJourney1Result unwrapped response:', server)
        const journey1Results = extractJourney1Data(server)

        if (!journey1Results) {
          throw new Error('Journey 1 response did not include career recommendation data.')
        }

        setJourney1Data(journey1Results)
        setJourney1Result(server)
        saveJourney1Result(user, journey1Results)
        sessionStorage.setItem('journey1Result', JSON.stringify(server))
        setResultError('')
        saveLatestAssessment(user, {
          type: 'exploring',
          label: 'Exploration assessment',
          domain: 'exploring',
          score: null,
          source: 'journey1',
          assessmentId,
        })
      } catch (e) {
        console.error('fetch exploring result failed from Journey 1', e)
        setJourney1Data(null)
        setResultError('We could not load your Journey 1 result from the backend. Please try again or start the assessment over.')
      }

    })()
  }, [user])

  if (resultError) {
    return (
      <AssessmentLayout showProgress={false}>
        <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-card sm:p-12">
          <h1 className="font-serif text-3xl font-semibold text-brown sm:text-4xl">Journey 1 result unavailable</h1>
          <p className="mt-4 text-base text-brown-light">{resultError}</p>
          <div className="mt-8">
            <Button onClick={() => navigate('/explore/assessment')} variant="dark" size="lg">
              Restart the assessment
            </Button>
          </div>
        </div>
      </AssessmentLayout>
    )
  }

  if (!journey1Data) {
    return (
      <AssessmentLayout showProgress={false}>
        <p className="text-center text-brown-light">Loading your Journey 1 results...</p>
      </AssessmentLayout>
    )
  }

  const careerScores = journey1Data.career_recommendation?.deterministic_career_scores || []
  const skillInsights = getSkillInsights(journey1Data)
  const professionalStrengths = skillInsights.strengths.map((skill) => getProfessionalSkillInsight(skill, 'strength'))
  const professionalDevelopmentAreas = skillInsights.weaknesses.map((skill) => getProfessionalSkillInsight(skill, 'development'))
  const filteredStrengths = filterByField(professionalStrengths, selectedProfileField)
  const filteredDevelopmentAreas = filterByField(professionalDevelopmentAreas, selectedProfileField)
  const strongestSignals = filterByField(
    (journey1Data.strengths || []).map((signal) => ({
      text: getSignalText(signal),
      career: getSignalCareer(signal),
    })),
    selectedSignalField,
  )

  const handleGenerateRoadmap = async (careerMatch) => {
    const realAssessmentId = sessionStorage.getItem('journey1AssessmentId')
    if (!realAssessmentId || !journey1Result) {
      setRoadmapError('Your backend Journey 1 result is not available. Please complete the assessment again.')
      return
    }

    const careerName = normalizeCareerId(careerMatch.id)
    const matchScore = Number(careerMatch.percentage)
    const payload = {
      journey: 1,
      weekly_hours: 5,
      journey_output: journey1Result,
      career: careerName,
      target_role: careerName,
      use_model: false,
    }

    try {
      setGeneratingCareer(careerName)
      setRoadmapError('')
      const created = await generateRoadmap(payload)
      console.groupCollapsed('[Journey1] Roadmap response')
      console.debug('raw response:', created)
      console.debug('engine version:', created?.engine_version || created?.engineVersion || 'missing')
      console.debug('payload:', JSON.stringify(created, null, 2))
      console.groupEnd()
      const envelope = unwrapRoadmapResponse(created)
      const raw = envelope?.result || envelope || {}
      const returnedRoadmaps = Array.isArray(raw) ? raw : [raw]
      console.debug('[Journey1] Returned roadmap careers:', returnedRoadmaps.map(getRoadmapCareer).filter(Boolean))
      const responseData = Array.isArray(raw)
        ? raw.find((roadmap) => normalizeCareerId(getRoadmapCareer(roadmap)) === normalizeCareerId(careerName)) || {}
        : (typeof raw === 'object' ? raw : {})
      if (Array.isArray(raw) && !getRoadmapCareer(responseData)) {
        throw new Error(`The backend did not return a roadmap for ${careerName}.`)
      }
      const roadmapId = envelope?.roadmap_id || envelope?.roadmapId || envelope?.id || responseData.roadmap_id || responseData.roadmapId || responseData.id

      if (!roadmapId) {
        throw new Error(`The Journey 1 roadmap API did not return a valid roadmap ID. Response: ${JSON.stringify(created)}`)
      }

      const savedRoadmap = {
        id: roadmapId,
        domain: responseData.career || responseData.domain || careerName,
        domainId: responseData.domainId || payload.domainId || careerMatch.id,
        matchScore: Number(responseData.matchScore ?? matchScore),
        strengths: responseData.strengths || payload.strengths || [],
        areasToImprove: responseData.areasToImprove || payload.areasToImprove || payload.weak_areas || [],
        curriculum: responseData.curriculum || { phases: responseData.phases || [], weeks: responseData.timeline?.total_duration_weeks || 12 },
        status: 'generated',
        createdAt: new Date().toISOString(),
      }

      saveRoadmap(user, savedRoadmap)
      navigate(`/roadmap-detail/${roadmapId}`, {
        state: {
          ...savedRoadmap,
          returnTo: { pathname: '/explore/assessment/results', state: { fromJourney1: true } },
        },
      })
    } catch (error) {
      console.error('Roadmap generation failed for exploring result:', error, error?.response?.data)
      setRoadmapError(error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.detail || error?.response?.data?.title || error?.message || 'We could not generate your Journey 1 roadmap. Please try again.')
    } finally {
      setGeneratingCareer('')
    }
  }

  return (
    <AssessmentLayout
      showProgress={false}
      contentClassName="max-w-none"
    >
      {/* Main card */}
      <div className="overflow-hidden rounded-[2rem] border border-beige-border bg-white shadow-card">
        <div className="border-b border-beige-border bg-cream-dark/40 px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-beige-border bg-white px-3 py-1.5 text-xs font-semibold text-brown-light">
                <Sparkles className="h-3.5 w-3.5 text-orange" aria-hidden="true" />
                Journey 1 complete
              </div>
              <h1 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-brown sm:text-4xl lg:text-5xl">
                A clearer view of where you can go next.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brown-light sm:text-base">
                Your assessment highlights the patterns, capabilities, and career directions that are most relevant to you right now.
              </p>
            </div>
            <div className="flex shrink-0 gap-5 border-t border-beige-border pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
              {[
                { value: strongestSignals.length, label: 'Strongest signals' },
                { value: filteredStrengths.length + filteredDevelopmentAreas.length, label: 'Profile insights' },
                { value: careerCards.length, label: 'Career directions' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl font-semibold text-brown">{stat.value}</p>
                  <p className="mt-1 max-w-[6rem] text-xs leading-snug text-brown-light">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
        <div className="max-w-none">
          <section className="rounded-2xl border border-beige-border bg-cream-dark/60 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brown text-xs font-semibold text-white">1</span>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-brown">What stands out most</h2>
                <p className="mt-1 text-sm text-brown-light">The signals most relevant to each direction.</p>
              </div>
              </div>
              <label className="text-sm font-semibold text-brown">
                View by field
                <select value={selectedSignalField} onChange={(event) => setSelectedSignalField(event.target.value)} className="mt-1 block w-full rounded-lg border border-beige-border bg-white px-3 py-2 text-sm font-medium text-brown sm:w-52">
                  <option value="all">All fields</option>
                  {careerCards.map((career) => <option key={career.id} value={career.id}>{career.name}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {strongestSignals.length > 0
                ? strongestSignals.map((signal, index) => (
                  <div key={`${signal.text}-${index}`} className="flex items-start gap-3 rounded-xl border border-beige-border bg-white p-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-journey-green text-journey-green-dark"><Sparkles className="h-4 w-4" aria-hidden="true" /></div>
                    <div>
                      <p className="text-base text-brown-light">{signal.text}</p>
                      {signal.career && <p className="mt-2 inline-block rounded-full bg-cream-dark px-2.5 py-1 text-xs font-semibold text-brown-light">{signal.career}</p>}
                    </div>
                  </div>
                ))
                : <p className="rounded-xl border border-dashed border-beige-border bg-white p-4 text-sm text-brown-light md:col-span-2">No strongest signals were found for this field yet. Try another field above.</p>}
            </div>
          </section>

          <section className="mt-5 rounded-2xl border border-beige-border bg-white p-5 shadow-card sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brown text-xs font-semibold text-white">2</span>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-brown">Your overall skill profile</h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-brown-light">What you already do well and where to build readiness.</p>
              </div>
              </div>
              <label className="text-sm font-semibold text-brown">
                View by field
                <select value={selectedProfileField} onChange={(event) => setSelectedProfileField(event.target.value)} className="mt-1 block w-full rounded-lg border border-beige-border bg-cream-dark px-3 py-2 text-sm font-medium text-brown sm:w-52">
                  <option value="all">All fields</option>
                  {careerCards.map((career) => <option key={career.id} value={career.id}>{career.name}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-journey-green-dark" aria-hidden="true" />
                  <h3 className="font-semibold text-brown">Strengths</h3>
                </div>
                <div className="mt-3 space-y-3">
                  {filteredStrengths.length > 0 ? filteredStrengths.map((skill) => (
                    <article key={`${skill.career}-${skill.name}`} className="rounded-xl border border-beige-border border-l-4 border-l-journey-green-dark bg-cream-dark/40 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h4 className="text-lg font-semibold text-brown">{skill.name}</h4>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-journey-green px-2.5 py-1 text-xs font-semibold text-journey-green-dark"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />{skill.proficiency}</span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-brown-light">{skill.career}</p>
                      <p className="mt-3 text-sm leading-relaxed text-brown-light">{skill.explanation}</p>
                    </article>
                  )) : <p className="rounded-2xl border border-dashed border-beige-border bg-cream-dark/40 p-5 text-sm text-brown-light">No strengths are available for this field yet.</p>}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange" aria-hidden="true" />
                  <h3 className="font-semibold text-brown">Areas for development</h3>
                </div>
                <div className="mt-3 space-y-3">
                  {filteredDevelopmentAreas.length > 0 ? filteredDevelopmentAreas.map((skill) => (
                    <article key={`${skill.career}-${skill.name}`} className="rounded-xl border border-beige-border border-l-4 border-l-orange bg-orange-pill/30 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h4 className="text-lg font-semibold text-brown">{skill.name}</h4>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-pill px-2.5 py-1 text-xs font-semibold text-brown"><ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />{skill.proficiency}</span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-brown-light">{skill.career}</p>
                      {skill.category && <p className="mt-1 text-xs capitalize text-brown-light">Question category: {skill.category}</p>}
                      <p className="mt-3 text-sm leading-relaxed text-brown-light">{skill.explanation}</p>
                    </article>
                  )) : <p className="rounded-2xl border border-dashed border-beige-border bg-orange-pill/30 p-5 text-sm text-brown-light">No development areas are available for this field yet.</p>}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 overflow-hidden rounded-2xl border border-orange/25 bg-orange-pill">
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brown text-white"><Zap className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-brown">Turn your insight into a roadmap</h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-brown-light">{typeof journey1Data.recommended_next_step === 'string' ? journey1Data.recommended_next_step : 'Choose the career direction that feels most motivating, then generate a practical roadmap to build on your strengths.'}</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowCareerMatches((current) => !current)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brown px-5 py-3 font-semibold text-white transition hover:bg-orange">
                {showCareerMatches ? 'Hide career matches' : 'See career matches'} <ArrowRight className={`h-4 w-4 transition-transform ${showCareerMatches ? 'rotate-90' : ''}`} aria-hidden="true" />
              </button>
            </div>

            {showCareerMatches && (
              <div className="border-t border-orange/20 bg-white p-6 sm:p-7">
                <h3 className="font-serif text-xl font-semibold text-brown">Career matches</h3>
                <p className="mt-1 text-sm text-brown-light">Compare your options and generate a roadmap when you are ready.</p>
                {roadmapError && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{roadmapError}</p>}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {careerCards.map((career) => {
                    const percentage = getCareerPercentage(careerScores, career.id)
                    const Icon = career.icon
                    return (
                      <article key={career.id} className="group flex h-full flex-col rounded-xl border border-beige-border bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                        <div className="flex items-start justify-between gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${career.accent}`}><Icon className="h-6 w-6" aria-hidden="true" /></div>
                          <div className="text-right"><p className="text-2xl font-bold text-brown">{percentage}%</p><p className="text-xs font-medium text-brown-light">match</p></div>
                        </div>
                        <h3 className="mt-3 font-serif text-xl font-semibold text-brown">{career.name}</h3>
                        <p className="mt-2 min-h-12 text-sm leading-relaxed text-brown-light">{career.description}</p>
                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-brown/10"><div className="h-full rounded-full bg-orange transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} /></div>
                        <button type="button" onClick={() => handleGenerateRoadmap({ ...career, percentage })} disabled={Boolean(generatingCareer)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brown px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60">
                          {generatingCareer === career.id ? <><Loader className="h-4 w-4 animate-spin" aria-hidden="true" /> Generating roadmap...</> : <><Zap className="h-4 w-4" aria-hidden="true" /> Generate Roadmap <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></>}
                        </button>
                      </article>
                    )
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Info note */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-beige-border bg-cream-dark/40 p-4">
            <p className="text-sm leading-relaxed text-brown-light">
              <span className="font-semibold text-brown">Note:</span> These career scores are calculated from your Journey 1 assessment results.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              to="/dashboard"
              variant="ghost"
              size="lg"
              className="flex-1"
            >
              Back to Home
            </Button>
            <Button
              to="/explore/domain-selection"
              variant="dark"
              size="lg"
              icon={ArrowRight}
              className="flex-1"
            >
              Explore a Domain
            </Button>
          </div>
        </div>
        </div>
      </div>
    </AssessmentLayout>
  )
}

export default ExploringResults
