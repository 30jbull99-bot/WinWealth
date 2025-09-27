import { useEffect, useMemo, useState } from 'react'
import {
  firebaseReady,
  logAnalyticsEvent,
  logTaskCompletion,
  saveConsent,
  signInWithGoogle,
  signOut,
  watchAuthState,
} from './firebase'

const translations = {
  en: {
    heroTitle: 'WinWealth — Earn-first mobile web app',
    heroSubtitle:
      'Complete AI-matched quests, spin to win with 80% success odds, and cash out from $5 via PayPal, bank, or crypto.',
    loginCta: 'Sign in with Google',
    logoutCta: 'Sign out',
    onboardingTitle: 'AI Onboarding Quiz',
    onboardingCaption: 'Tell us your goals so we can personalise missions instantly.',
    dashboardTitle: 'Today\'s mission control',
    dashboardSubtitle: 'Start with the high-earning quests curated from trusted affiliate partners.',
    fortuneSpinTitle: 'Daily Fortune Spin (80% win rate)',
    dataOptInTitle: 'Ethical data boost',
    dataOptInDescription:
      'Opt in to anonymous earning stats sharing (GDPR/CCPA compliant) and receive +1 bonus spin instantly.',
    optInToggle: 'I agree to share anonymised stats for insights and extra rewards.',
    optInThanks: 'Consent saved. Thanks for boosting the mission!',
    languageLabel: 'Language',
    teamTitle: 'Power teams',
    payoutTitle: 'Payout tracker',
    passiveTitle: 'Passive boosts',
    leaderboardTitle: 'Squad leaderboard',
    marketingTitle: 'Referral & growth goals',
    admobPlaceholder: 'AdMob placement (replace with live unit ID after approval).',
    premiumPitch: 'Unlock Premium — Unlimited spins + 10% higher bonuses ($4.99/mo).',
    analyticsNote: 'Analytics live. Review funnels daily inside Firebase > Analytics > Events.',
    manualPayout:
      'Track confirmed commissions, pay 70–90% to users weekly via PayPal/Stripe, keep the rest for ops.',
    exportCta: 'Export anonymised CSV',
    addTask: 'Complete',
    spinNow: 'Spin now',
    spinCooldown: 'Come back in {hours}h {minutes}m for your next spin.',
    spinJackpot: 'JACKPOT! Massive boost unlocked!',
    spinHistoryTitle: 'Latest spin results',
    badgesTitle: 'Unlocked badges',
    localisationNote: 'Localized for US, India, Brazil. Add more locales via translations object.',
    consentMissingConfig:
      'Firebase config missing. Add .env.local credentials before enabling login, analytics, and Firestore sync.',
    affiliateCta: 'Open task',
    copySuccess: 'Copied to clipboard!',
    copyError: 'Copy failed',
    welcomeBack: 'Welcome back',
    streakLabel: 'Day streak',
    empireValue: 'Empire value',
    aiSummary: 'AI Summary',
    copySummaryCta: 'Copy summary',
  },
  hi: {
    heroTitle: 'WinWealth — कमाई पहले मोबाइल ऐप',
    heroSubtitle:
      'AI से चुने गए टास्क करें, 80% जीत वाले स्पिन घुमाएँ और सिर्फ $5 पर पेपाल/बैंक/क्रिप्टो में निकासी करें।',
    loginCta: 'Google से साइन इन करें',
    logoutCta: 'साइन आउट',
    onboardingTitle: 'AI ऑनबोर्डिंग क्विज़',
    onboardingCaption: 'अपना लक्ष्य बताएं ताकि मिशन तुरंत पर्सनलाइज़ हो सके।',
    dashboardTitle: 'आज का मिशन कंट्रोल',
    dashboardSubtitle: 'भरोसेमंद पार्टनर्स के हाइ-अर्निंग क्वेस्ट से शुरुआत करें।',
    fortuneSpinTitle: 'डेली फॉर्च्यून स्पिन (80% जीत)',
    dataOptInTitle: 'एथिकल डेटा बूस्ट',
    dataOptInDescription:
      'अनाम कमाई आँकड़े शेयर करने के लिए सहमति दें (GDPR/CCPA पालन) और तुरंत +1 बोनस स्पिन पाएं।',
    optInToggle: 'मैं अतिरिक्त रिवार्ड्स के लिए गुमनाम आँकड़े शेयर करने पर सहमत हूँ।',
    optInThanks: 'सहमति सुरक्षित। मिशन में मदद करने के लिए धन्यवाद!',
    languageLabel: 'भाषा',
    teamTitle: 'पावर टीमें',
    payoutTitle: 'पेआउट ट्रैकर',
    passiveTitle: 'पैसिव बूस्ट्स',
    leaderboardTitle: 'टीम लीडरबोर्ड',
    marketingTitle: 'रेफ़रल और ग्रोथ लक्ष्य',
    admobPlaceholder: 'AdMob प्लेसमेंट (स्वीकृति के बाद असली यूनिट ID जोड़ें)।',
    premiumPitch: 'प्रीमियम अनलॉक करें — अनलिमिटेड स्पिन + 10% अधिक बोनस ($4.99/माह)।',
    analyticsNote: 'एनालिटिक्स लाइव। Firebase > Analytics > Events में रोज़ाना देखें।',
    manualPayout:
      'कन्फर्म कमीशन ट्रैक करें, यूज़र्स को 70–90% साप्ताहिक PayPal/Stripe से दें, बाकी ऑपरेशंस के लिए रखें।',
    exportCta: 'अनाम CSV एक्सपोर्ट',
    addTask: 'पूरा करें',
    spinNow: 'अभी स्पिन करें',
    spinCooldown: '{hours}घं {minutes}म बाद दोबारा आएं।',
    spinJackpot: 'जैकपॉट! भारी इनाम unlocked!',
    spinHistoryTitle: 'ताज़ा स्पिन नतीजे',
    badgesTitle: 'अनलॉक्ड बैज',
    localisationNote: 'US, India, Brazil के लिए स्थानीयकरण। translations ऑब्जेक्ट में और जोड़ें।',
    consentMissingConfig:
      'Firebase कॉन्फ़िग गायब है। लॉगिन, एनालिटिक्स और Firestore sync से पहले .env.local जोड़ें।',
    affiliateCta: 'टास्क खोलें',
    copySuccess: 'क्लिपबोर्ड पर कॉपी हुआ!',
    copyError: 'कॉपी असफल रही',
    welcomeBack: 'वापसी पर स्वागत है',
    streakLabel: 'दिनों की स्ट्रीक',
    empireValue: 'एम्पायर वैल्यू',
    aiSummary: 'AI सारांश',
    copySummaryCta: 'सार कॉपी करें',
  },
  pt: {
    heroTitle: 'WinWealth — App móvel focado em ganhos',
    heroSubtitle:
      'Complete missões sugeridas por IA, gire com 80% de chance de vitória e saque a partir de US$ 5 via PayPal, banco ou cripto.',
    loginCta: 'Entrar com Google',
    logoutCta: 'Sair',
    onboardingTitle: 'Quiz de onboarding com IA',
    onboardingCaption: 'Conte seus objetivos para personalizarmos as missões agora mesmo.',
    dashboardTitle: 'Central de missões de hoje',
    dashboardSubtitle: 'Comece pelas missões de alto ganho dos parceiros confiáveis.',
    fortuneSpinTitle: 'Roleta da Fortuna diária (80% vitória)',
    dataOptInTitle: 'Impulso ético de dados',
    dataOptInDescription:
      'Aceite compartilhar estatísticas anônimas (GDPR/CCPA) e receba +1 giro bônus na hora.',
    optInToggle: 'Concordo em compartilhar estatísticas anônimas para recompensas extras.',
    optInThanks: 'Consentimento salvo. Obrigado por fortalecer a missão!',
    languageLabel: 'Idioma',
    teamTitle: 'Equipes poderosas',
    payoutTitle: 'Controle de pagamentos',
    passiveTitle: 'Boosts passivos',
    leaderboardTitle: 'Ranking da equipe',
    marketingTitle: 'Metas de referral e crescimento',
    admobPlaceholder: 'Espaço AdMob (adicione o ID real após aprovação).',
    premiumPitch: 'Desbloqueie Premium — Giros ilimitados + 10% de bônus extra (US$ 4,99/mês).',
    analyticsNote: 'Analytics ativo. Revise funil diariamente em Firebase > Analytics > Events.',
    manualPayout:
      'Acompanhe comissões confirmadas, pague 70–90% aos usuários semanalmente via PayPal/Stripe e retenha o restante.',
    exportCta: 'Exportar CSV anônimo',
    addTask: 'Concluir',
    spinNow: 'Girar agora',
    spinCooldown: 'Volte em {hours}h {minutes}m para o próximo giro.',
    spinJackpot: 'JACKPOT! Reforço gigantesco!',
    spinHistoryTitle: 'Últimos resultados',
    badgesTitle: 'Insígnias liberadas',
    localisationNote: 'Localizado para EUA, Índia, Brasil. Adicione mais idiomas no objeto translations.',
    consentMissingConfig:
      'Configuração Firebase ausente. Adicione .env.local antes de ativar login, analytics e Firestore.',
    affiliateCta: 'Abrir missão',
    copySuccess: 'Copiado para a área de transferência!',
    copyError: 'Falha ao copiar',
    welcomeBack: 'Bem-vindo de volta',
    streakLabel: 'Sequência de dias',
    empireValue: 'Valor do império',
    aiSummary: 'Resumo IA',
    copySummaryCta: 'Copiar resumo',
  },
}

const onboardingQuestions = [
  {
    id: 'time',
    targets: ['surveys', 'gigs', 'cashback'],
    question: {
      en: 'How much time can you invest daily?',
      hi: 'आप रोज़ाना कितना समय दे सकते हैं?',
      pt: 'Quanto tempo pode investir por dia?',
    },
    options: [
      { value: 'micro', label: { en: '10 minutes', hi: '10 मिनट', pt: '10 minutos' } },
      { value: 'medium', label: { en: '30 minutes', hi: '30 मिनट', pt: '30 minutos' } },
      { value: 'long', label: { en: '1 hour+', hi: '1 घंटा+', pt: '1 hora+' } },
    ],
  },
  {
    id: 'goal',
    targets: ['surveys', 'gigs', 'cashback'],
    question: {
      en: 'Pick your primary income focus',
      hi: 'अपना मुख्य कमाई लक्ष्य चुनें',
      pt: 'Escolha seu foco principal de renda',
    },
    options: [
      {
        value: 'surveys',
        label: { en: 'Surveys & studies', hi: 'सर्वे और स्टडीज़', pt: 'Pesquisas e estudos' },
      },
      { value: 'gigs', label: { en: 'Freelance gigs', hi: 'फ्रीलांस गिग्स', pt: 'Gigs freelance' } },
      {
        value: 'cashback',
        label: { en: 'Cashback & shopping', hi: 'कैशबैक और शॉपिंग', pt: 'Cashback e compras' },
      },
    ],
  },
  {
    id: 'confidence',
    targets: ['surveys', 'gigs', 'cashback'],
    question: {
      en: 'How confident are you with digital tools?',
      hi: 'आप डिजिटल टूल्स में कितने आश्वस्त हैं?',
      pt: 'Qual seu nível com ferramentas digitais?',
    },
    options: [
      { value: 'beginner', label: { en: 'New to online earning', hi: 'ऑनलाइन कमाई में नए', pt: 'Iniciante' } },
      { value: 'intermediate', label: { en: 'Comfortable', hi: 'कंफ़र्टेबल', pt: 'Confortável' } },
      { value: 'expert', label: { en: 'Pro level', hi: 'प्रो स्तर', pt: 'Profissional' } },
    ],
  },
]

const affiliateTasks = [
  {
    id: 'swagbucks-survey',
    partner: 'Swagbucks',
    countries: ['US', 'IN', 'BR'],
    type: 'surveys',
    title: 'High-paying survey streak',
    description: 'Earn up to $1.50 per survey. Complete 3 in a row for a $1 WinWealth boost.',
    link: 'https://www.swagbucks.com/',
    estMinutes: 15,
    estEarnings: '$4.50',
  },
  {
    id: 'fiverr-quick-gig',
    partner: 'Fiverr',
    countries: ['US', 'IN', 'BR'],
    type: 'gigs',
    title: 'Fiverr micro gig starter pack',
    description: 'Offer a 24-hour delivery service (voice note, AI prompt audit) to earn $15+ per client.',
    link: 'https://www.fiverr.com/',
    estMinutes: 60,
    estEarnings: '$15.00+',
  },
  {
    id: 'survey-junkie',
    partner: 'Survey Junkie',
    countries: ['US'],
    type: 'surveys',
    title: 'US demographic surveys',
    description: 'Complete profile-based surveys with 5-minute average payouts.',
    link: 'https://www.surveyjunkie.com/',
    estMinutes: 10,
    estEarnings: '$3.00',
  },
]

const passiveBoosts = [
  {
    id: 'cashback-card',
    title: 'Cashback stack',
    detail: 'Activate Rakuten + card rewards for 12% blended cashback.',
  },
  {
    id: 'ai-prompts',
    title: 'AI script helper',
    detail: 'Use free ChatGPT / Gemini to draft Fiverr gigs in 2 minutes.',
  },
  {
    id: 'ad-watching',
    title: 'Ad pool bonus',
    detail: 'Watch 3 ads to unlock $0.75 extra spin value (AdMob funded).',
  },
]

const teamSnapshots = [
  { id: 'amit-crew', name: 'Amit\'s Survey Crew (IN)', earnings: '$82', members: 18 },
  { id: 'maria-legends', name: 'Maria\'s Hustle Legends (BR)', earnings: '$96', members: 22 },
  { id: 'john-allstars', name: 'John\'s Cashback All-Stars (US)', earnings: '$110', members: 15 },
]

const badges = [
  { id: 'streak-3', label: '3-day streak', description: 'Keep momentum to double boosts.' },
  { id: 'team-builder', label: 'Team builder', description: 'Invite 3 friends to unlock team boosts.' },
  { id: 'data-ally', label: 'Data ally', description: 'Opted into ethical data sharing.' },
]

const spinRewards = [
  { id: 'bonus-1', label: '$1 bonus', value: 1, probability: 0.2, type: 'cash' },
  { id: 'bonus-0-75', label: '$0.75 bonus', value: 0.75, probability: 0.2, type: 'cash' },
  { id: 'bonus-0-5', label: '$0.50 bonus', value: 0.5, probability: 0.2, type: 'cash' },
  { id: 'bonus-0-25', label: '$0.25 bonus', value: 0.25, probability: 0.2, type: 'cash' },
  { id: 'badge-power', label: 'Power badge', value: 0, probability: 0.05, type: 'badge' },
  { id: 'badge-streak', label: 'Streak badge', value: 0, probability: 0.05, type: 'badge' },
  { id: 'badge-team', label: 'Teamwork badge', value: 0, probability: 0.05, type: 'badge' },
  { id: 'jackpot', label: '$10 jackpot', value: 10, probability: 0.05, type: 'jackpot' },
]

const defaultSpinCooldownHours = 24

const simulateAISummary = (language, focusArea) => {
  const summaries = {
    surveys: {
      en: 'Focus on survey streaks this week. Aim for 3x Swagbucks surveys + 1 Survey Junkie for daily $5.',
      hi: 'इस सप्ताह सर्वे स्ट्रीक पर ध्यान दें। रोज़ $5 के लिए 3 Swagbucks + 1 Survey Junkie करें।',
      pt: 'Foque em sequências de pesquisas. Faça 3 Swagbucks + 1 Survey Junkie por dia para US$ 5.',
    },
    gigs: {
      en: 'Pitch Fiverr clients with AI-crafted scripts. Close 2 gigs to hit $30+ in 48 hours.',
      hi: 'AI स्क्रिप्ट से Fiverr क्लाइंट पिच करें। 48 घंटों में 2 गिग्स से $30+ लक्ष्य रखें।',
      pt: 'Envie propostas no Fiverr com roteiros de IA. Feche 2 gigs para US$ 30+ em 48h.',
    },
    cashback: {
      en: 'Stack cashback apps while shopping. Use AdMob boosts to fund extra spins for $7 passive gains.',
      hi: 'शॉपिंग के साथ कैशबैक ऐप्स मिलाएं। अतिरिक्त स्पिन के लिए AdMob बूस्ट इस्तेमाल कर $7 पैसिव कमाई जोड़ें।',
      pt: 'Combine apps de cashback nas compras. Use boosts do AdMob para ganhar US$ 7 passivos extras.',
    },
  }

  if (!focusArea) return summaries.surveys[language]
  const content = summaries[focusArea]
  return content?.[language] ?? summaries.surveys.en
}

const getTranslation = (language, key, replacements = {}) => {
  const fallback = translations.en[key] ?? key
  const base = translations[language]?.[key] ?? fallback
  return Object.keys(replacements).reduce((acc, currentKey) => {
    return acc.replace(`{${currentKey}}`, replacements[currentKey])
  }, base)
}

const formatTimeDiff = (diffMs) => {
  const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return { hours, minutes }
}

function App() {
  const [language, setLanguage] = useState('en')
  const [user, setUser] = useState(null)
  const [consentSaved, setConsentSaved] = useState(false)
  const [consentError, setConsentError] = useState('')
  const [selectedOptions, setSelectedOptions] = useState({})
  const [focusArea, setFocusArea] = useState('surveys')
  const [earnings, setEarnings] = useState(20)
  const [streak] = useState(2)
  const [empireValue, setEmpireValue] = useState(125)
  const [spinCooldownUntil, setSpinCooldownUntil] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState(null)
  const [spinHistory, setSpinHistory] = useState([])
  const [badgeCollection, setBadgeCollection] = useState(['streak-3'])
  const [copyMessage, setCopyMessage] = useState('')

  useEffect(() => {
    const unsubscribe = watchAuthState((currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        logAnalyticsEvent('user_login', { provider: 'google' })
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      setEarnings((prev) => Math.round((prev + Math.random() * 0.2) * 100) / 100)
      setEmpireValue((prev) => Math.round((prev + Math.random() * 0.5) * 100) / 100)
    }, 45000)

    return () => clearInterval(interval)
  }, [user])

  const recommendedTasks = useMemo(() => {
    const goal = selectedOptions.goal || focusArea
    return affiliateTasks
      .filter((task) => task.type === goal)
      .concat(affiliateTasks.filter((task) => task.type !== goal))
  }, [selectedOptions, focusArea])

  const handleOptionSelect = (questionId, value) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: value }))
    if (questionId === 'goal') {
      setFocusArea(value)
    }
  }

  const handleSignIn = async () => {
    try {
      const loggedIn = await signInWithGoogle()
      setUser(loggedIn)
    } catch (error) {
      setConsentError(error.message)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  const handleConsentToggle = async (event) => {
    if (!user) {
      setConsentError('Sign in first to manage consent preferences.')
      return
    }
    const optedIn = event.target.checked
    setConsentError('')
    try {
      await saveConsent({
        uid: user.uid,
        optedIn,
        locale: language,
        earningsFocus: focusArea,
      })
      setConsentSaved(true)
      if (optedIn) {
        setSpinCooldownUntil(null)
        setSpinHistory((prev) => [{ label: '+1 bonus spin unlocked', type: 'bonus' }, ...prev].slice(0, 5))
      }
    } catch (error) {
      setConsentError(error.message)
    }
  }

  const pickReward = () => {
    const randomValue = Math.random()
    let cumulative = 0
    for (const reward of spinRewards) {
      cumulative += reward.probability
      if (randomValue <= cumulative) {
        return reward
      }
    }
    return spinRewards[0]
  }

  const handleSpin = async () => {
    if (isSpinning) return

    if (spinCooldownUntil && spinCooldownUntil > Date.now()) {
      return
    }

    setIsSpinning(true)
    const reward = pickReward()

    setTimeout(async () => {
      setIsSpinning(false)
      setSpinResult(reward)
      setSpinHistory((prev) => [reward, ...prev].slice(0, 6))

      if (reward.type === 'cash') {
        setEarnings((prev) => Math.round((prev + reward.value) * 100) / 100)
        setEmpireValue((prev) => Math.round((prev + reward.value * 4) * 100) / 100)
      }
      if (reward.type === 'badge') {
        setBadgeCollection((prev) => (prev.includes(reward.id) ? prev : [...prev, reward.id]))
      }
      if (reward.type === 'jackpot') {
        setEarnings((prev) => Math.round((prev + reward.value) * 100) / 100)
        setEmpireValue((prev) => Math.round((prev + reward.value * 5) * 100) / 100)
      }

      const cooldownDate = Date.now() + defaultSpinCooldownHours * 60 * 60 * 1000
      setSpinCooldownUntil(cooldownDate)

      if (user) {
        await logTaskCompletion({
          uid: user.uid,
          taskId: 'fortune-spin',
          rewardLabel: reward.label,
          rewardValue: reward.value,
        })
        logAnalyticsEvent('fortune_spin', { reward: reward.label, type: reward.type })
      }
    }, 1200)
  }

  const handleTaskComplete = async (task) => {
    setEarnings((prev) => Math.round((prev + 1.5) * 100) / 100)
    setEmpireValue((prev) => Math.round((prev + 3) * 100) / 100)
    setSpinHistory((prev) => [{ label: `Completed ${task.title}`, type: 'task' }, ...prev].slice(0, 6))

    if (user) {
      await logTaskCompletion({
        uid: user.uid,
        taskId: task.id,
        rewardLabel: task.estEarnings,
        rewardValue: parseFloat(task.estEarnings.replace(/[^0-9.]/g, '')) || 0,
      })
    }
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyMessage(getTranslation(language, 'copySuccess'))
      setTimeout(() => setCopyMessage(''), 2500)
    } catch (err) {
      console.error('Copy failed', err)
      setCopyMessage(getTranslation(language, 'copyError'))
      setTimeout(() => setCopyMessage(''), 2500)
    }
  }

  const spinCooldownMessage = useMemo(() => {
    if (!spinCooldownUntil) return ''
    const now = Date.now()
    if (now >= spinCooldownUntil) return ''
    const diff = spinCooldownUntil - now
    const { hours, minutes } = formatTimeDiff(diff)
    return getTranslation(language, 'spinCooldown', { hours, minutes })
  }, [language, spinCooldownUntil])

  const aiSummary = useMemo(() => simulateAISummary(language, focusArea), [language, focusArea])

  return (
    <div className="min-h-screen bg-transparent px-4 pb-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-8 lg:flex-row">
        <main className="mobile-max-w mx-auto flex w-full flex-1 flex-col gap-6">
          <header className="grid-card gradient-card card-shadow text-white">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-2xl font-bold">{getTranslation(language, 'heroTitle')}</h1>
                <select
                  className="rounded-full border border-white/40 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <p className="text-sm text-white/90">{getTranslation(language, 'heroSubtitle')}</p>
              <div className="flex flex-wrap items-center gap-3">
                {user ? (
                  <button className="btn-secondary" onClick={handleSignOut}>
                    {getTranslation(language, 'logoutCta')}
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={handleSignIn}
                    disabled={!firebaseReady}
                  >
                    {getTranslation(language, 'loginCta')}
                  </button>
                )}
                {!firebaseReady && (
                  <span className="text-xs font-semibold text-white/90">
                    {getTranslation(language, 'consentMissingConfig')}
                  </span>
                )}
              </div>
            </div>
          </header>

          <section className="grid-card">
            <div className="mb-5 flex items-start justify-between gap-2">
              <div>
                <h2 className="section-title">{getTranslation(language, 'onboardingTitle')}</h2>
                <p className="section-subtitle">{getTranslation(language, 'onboardingCaption')}</p>
              </div>
              {user && (
                <div className="badge-chip">
                  {getTranslation(language, 'welcomeBack')} {user.displayName?.split(' ')[0] ?? ''}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {onboardingQuestions.map((question) => (
                <div key={question.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="mb-3 text-sm font-semibold text-slate-700">
                    {question.question[language] ?? question.question.en}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          selectedOptions[question.id] === option.value
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                        onClick={() => handleOptionSelect(question.id, option.value)}
                      >
                        {option.label[language] ?? option.label.en}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid-card">
            <div className="mb-5 flex items-center justify-between gap-2">
              <div>
                <h2 className="section-title">{getTranslation(language, 'dashboardTitle')}</h2>
                <p className="section-subtitle">{getTranslation(language, 'dashboardSubtitle')}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600">
                <div className="rounded-2xl bg-blue-50 px-3 py-2">
                  <p className="text-[0.65rem] uppercase tracking-wide text-blue-500">
                    {getTranslation(language, 'streakLabel')}
                  </p>
                  <p className="text-base text-slate-900">{streak}🔥</p>
                </div>
                <div className="rounded-2xl bg-orange-50 px-3 py-2">
                  <p className="text-[0.65rem] uppercase tracking-wide text-orange-500">Cash</p>
                  <p className="text-base text-slate-900">${earnings.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-3 py-2">
                  <p className="text-[0.65rem] uppercase tracking-wide text-emerald-500">
                    {getTranslation(language, 'empireValue')}
                  </p>
                  <p className="text-base text-slate-900">${empireValue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {recommendedTasks.map((task) => (
                <article key={task.id} className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                      <p className="text-xs text-slate-600">{task.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                        <span className="badge-chip">{task.partner}</span>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                          {task.estMinutes} min
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                          {task.estEarnings}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <a
                        className="btn-secondary text-xs"
                        href={task.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getTranslation(language, 'affiliateCta')}
                      </a>
                      <button className="btn-primary text-xs" onClick={() => handleTaskComplete(task)}>
                        {getTranslation(language, 'addTask')}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid-card">
            <div className="mb-4">
              <h2 className="section-title">{getTranslation(language, 'fortuneSpinTitle')}</h2>
              <p className="section-subtitle">
                80% cash wins · 15% badges · 5% jackpots · spins reset every 24h. Premium unlocks unlimited spins.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="spin-pointer" />
                <div className={`spin-wheel ${isSpinning ? 'animate-pulse' : ''}`}>
                  {isSpinning ? 'Spinning...' : spinResult?.label ?? 'Tap to win'}
                </div>
              </div>
              <button
                className="btn-primary"
                onClick={handleSpin}
                disabled={isSpinning || (spinCooldownUntil && spinCooldownUntil > Date.now())}
              >
                {getTranslation(language, 'spinNow')}
              </button>
              {spinCooldownMessage && (
                <p className="text-xs font-semibold text-slate-500">{spinCooldownMessage}</p>
              )}
              {spinResult?.type === 'jackpot' && (
                <p className="text-sm font-bold text-orange-600">
                  {getTranslation(language, 'spinJackpot')}
                </p>
              )}
              <div className="w-full">
                <h3 className="mb-2 text-sm font-semibold text-slate-700">
                  {getTranslation(language, 'spinHistoryTitle')}
                </h3>
                <ul className="flex flex-col gap-2 text-xs text-slate-600">
                  {spinHistory.map((entry, index) => (
                    <li key={`${entry.label}-${index}`} className="rounded-xl bg-slate-50 px-3 py-2">
                      {entry.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="grid-card">
            <div className="mb-4">
              <h2 className="section-title">{getTranslation(language, 'dataOptInTitle')}</h2>
              <p className="section-subtitle">{getTranslation(language, 'dataOptInDescription')}</p>
            </div>
            <label className="flex items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-sm text-slate-600">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                onChange={handleConsentToggle}
                disabled={!user}
              />
              <span>{getTranslation(language, 'optInToggle')}</span>
            </label>
            {consentSaved && (
              <p className="text-xs font-semibold text-emerald-600">
                {getTranslation(language, 'optInThanks')}
              </p>
            )}
            {consentError && <p className="text-xs font-semibold text-red-500">{consentError}</p>}
            <p className="mt-3 text-xs text-slate-500">
              {getTranslation(language, 'localisationNote')}
            </p>
          </section>
        </main>

        <aside className="flex w-full max-w-md flex-col gap-6">
          <section className="grid-card">
            <h2 className="section-title">{getTranslation(language, 'aiSummary')}</h2>
            <p className="text-sm text-slate-600">{aiSummary}</p>
            <button
              className="mt-4 btn-secondary text-xs"
              onClick={() => handleCopy(aiSummary)}
            >
              {getTranslation(language, 'copySummaryCta')}
            </button>
            {copyMessage && <p className="mt-2 text-xs font-semibold text-emerald-600">{copyMessage}</p>}
          </section>

          <section className="grid-card">
            <h2 className="section-title">{getTranslation(language, 'teamTitle')}</h2>
            <div className="flex flex-col gap-3">
              {teamSnapshots.map((team) => (
                <div key={team.id} className="leaderboard-item">
                  <div>
                    <p>{team.name}</p>
                    <p className="text-[0.65rem] font-medium text-slate-500">{team.members} members</p>
                  </div>
                  <span className="text-sm text-emerald-600">{team.earnings}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="grid-card">
            <h2 className="section-title">{getTranslation(language, 'passiveTitle')}</h2>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              {passiveBoosts.map((boost) => (
                <li key={boost.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-800">{boost.title}</p>
                  <p className="text-xs text-slate-600">{boost.detail}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid-card">
            <h2 className="section-title">{getTranslation(language, 'badgesTitle')}</h2>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge.id}
                  className={`badge-chip ${
                    badgeCollection.includes(badge.id) ? 'bg-orange-100 text-orange-600' : 'opacity-50'
                  }`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </section>

          <section className="grid-card">
            <h2 className="section-title">{getTranslation(language, 'payoutTitle')}</h2>
            <p className="text-sm text-slate-600">{getTranslation(language, 'manualPayout')}</p>
            <div className="mt-3 rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">Manual flow</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                <li>Export CSV consent + task log from Firestore.</li>
                <li>Verify affiliate commission dashboards (Swagbucks, Fiverr, Survey Junkie).</li>
                <li>Approve payouts in PayPal/Stripe dashboard (batch every Friday).</li>
                <li>Record payment confirmation back in Firestore (collection: payouts).</li>
              </ol>
            </div>
          </section>

          <section className="grid-card">
            <h2 className="section-title">{getTranslation(language, 'marketingTitle')}</h2>
            <p className="text-sm text-slate-600">
              Launch referrals now: share on Reddit, TikTok, X, and WhatsApp groups. Target 100–500 signups today.
            </p>
            <div className="mt-3 rounded-2xl bg-orange-50 px-4 py-3 text-xs font-semibold text-orange-600">
              {getTranslation(language, 'premiumPitch')}
            </div>
            <div className="mt-3 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-600">
              {getTranslation(language, 'admobPlaceholder')}
            </div>
            <p className="mt-3 text-xs text-slate-500">{getTranslation(language, 'analyticsNote')}</p>
            <button
              className="btn-secondary mt-3 text-xs"
              onClick={() =>
                handleCopy(
                  'node scripts/exportAnonymizedData.js exports/userConsents.json exports/taskHistory.json',
                )
              }
            >
              {getTranslation(language, 'exportCta')}
            </button>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default App
