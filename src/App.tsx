import { useState, useMemo, useEffect, useRef } from 'react'
import './App.css'

const AD_IDS = {
  landing: 'ait.v2.live.f6820d0c4f104613',
  quiz_a:  'ait.v2.live.fb326e51d0ae4e73',
  quiz_b:  'ait.v2.live.340e412a5d12481f',
  result:  'ait.v2.live.fdc51421f96242a8',
}

const isTossWebView = /TOSS|AIT/i.test(navigator.userAgent)

function BannerAd({ slot }: { slot: keyof typeof AD_IDS }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isTossWebView) return
    let destroy: (() => void) | undefined

    import('@apps-in-toss/web-framework').then(({ TossAds }) => {
      try {
        if (!TossAds.initialize.isSupported()) return
        TossAds.initialize({
          callbacks: {
            onInitialized: () => {
              if (!containerRef.current) return
              const attached = TossAds.attachBanner(AD_IDS[slot], containerRef.current, {
                theme: 'auto',
                tone: 'blackAndWhite',
                variant: 'expanded',
              })
              destroy = () => attached?.destroy()
            },
          },
        })
      } catch {}
    }).catch(() => {})

    return () => destroy?.()
  }, [slot])

  return <div ref={containerRef} style={{ width: '100%', height: '96px', marginTop: '24px' }} />
}

type Screen = 'landing' | 'quiz' | 'result'
type ScoreKey = 'sweet' | 'body' | 'acid' | 'aroma' | 'complex' | 'bubble'
type Scores = Record<ScoreKey, number>

type Option = {
  icon: string
  text: string
  scores: Partial<Scores>
}

type Question = {
  q: string
  a: Option
  b: Option
}

type WineRec = {
  emoji: string
  name: string
  store: string
  price: string
}

type WineType = {
  emoji: string
  title: string
  subtitle: string
  character: string
  description: string
  profile: Scores
  wines: WineRec[]
  pairing: string
}

const questions: Question[] = [
  {
    q: '카페에서 자주 시키는 음료는?',
    a: { icon: '☕', text: '아이스 아메리카노 / 콜드브루', scores: { sweet: -2 } },
    b: { icon: '🥛', text: '바닐라라떼 / 카라멜 마키아토', scores: { sweet: 2 } },
  },
  {
    q: '달콤한 거 얼마나 좋아해요?',
    a: { icon: '🍰', text: '단 거 최고! 크림·시럽 듬뿍', scores: { sweet: 2 } },
    b: { icon: '🍫', text: '단 건 좀... 쌉쌀한 게 더 좋아', scores: { sweet: -2 } },
  },
  {
    q: '메인 메뉴 골라봐!',
    a: { icon: '🥩', text: '두툼한 립아이 스테이크', scores: { body: 2 } },
    b: { icon: '🥗', text: '회덮밥 / 냉모밀', scores: { body: -2 } },
  },
  {
    q: '좋아하는 운동/액티비티?',
    a: { icon: '🏋️', text: '헬스 / 클라이밍 / 격투기', scores: { body: 2 } },
    b: { icon: '🧘', text: '요가 / 필라테스 / 산책', scores: { body: -2 } },
  },
  {
    q: '과일 고른다면?',
    a: { icon: '🍋', text: '청포도 / 키위 / 자두 (새콤한 것)', scores: { acid: 4 } },
    b: { icon: '🍑', text: '복숭아 / 바나나 / 망고 (달고 부드러운 것)', scores: { acid: -4 } },
  },
  {
    q: '향수 뿌릴 때는?',
    a: { icon: '💨', text: '지나갈 때 주변 사람이 알아채는 편', scores: { aroma: 4 } },
    b: { icon: '🤫', text: '나만 알 수 있는 은은한 향', scores: { aroma: -4 } },
  },
  {
    q: '영화나 책 한 편 고른다면?',
    a: { icon: '🎬', text: '한 번 봐도 다 이해되는 명쾌한 거', scores: { complex: -3 } },
    b: { icon: '📖', text: '다시 볼 때 다르게 보이는 깊은 거', scores: { complex: 3 } },
  },
  {
    q: '음료 취향은?',
    a: { icon: '🫧', text: '탄산 있어야 맛있어, 톡 쏘는 게 좋아', scores: { bubble: 3 } },
    b: { icon: '🫖', text: '부드럽게 넘어가는 게 좋아, 탄산은 별로', scores: { bubble: -3 } },
  },
]

const wineTypes: Record<string, WineType> = {
  champagne: {
    emoji: '🍾',
    title: '샹들리에 같은 너',
    subtitle: '샴페인파',
    character: '특별한 순간을 사랑하는 사람. 일상의 작은 축하도 놓치지 않는, 우아하면서 발랄한 매력. 분위기를 띄우는 모임의 호스트 타입.',
    description: '톡 쏘는 미세 기포 + 시트러스 + 갓 구운 토스트 향. 식전주의 정석이자 모든 축하의 시작.',
    profile: { sweet: -2, body: -1, acid: 3, aroma: 1, complex: 3, bubble: 4 },
    wines: [
      { emoji: '🥂', name: '뵈브 클리코 옐로우 라벨', store: '와인앤모어 · 신세계L&B', price: '110,000원' },
      { emoji: '🍾', name: '모엣 샹동 임페리얼', store: '이마트 · 와인앤모어', price: '89,000원' },
      { emoji: '✨', name: '도멘 생 미셸 브뤼', store: '이마트 · 롯데마트 · 홈플러스', price: '19,800원' },
    ],
    pairing: '굴, 캐비어, 카나페, 튀김, 생일 케이크, 모든 축하의 순간',
  },
  moscato: {
    emoji: '🍬',
    title: '솜사탕 같은 너',
    subtitle: '모스카토파',
    character: '와인이 처음이어도 두렵지 않은 사람. 부담 없이 한 잔, 가볍게 즐기는 게 진리. 햇살 좋은 브런치에 어울리는 산뜻함.',
    description: '도수 5~6%의 미세 기포 + 잘 익은 복숭아와 꿀의 단맛. 와인 입문자의 영원한 친구.',
    profile: { sweet: 3, body: -3, acid: 1, aroma: 3, complex: -3, bubble: 2 },
    wines: [
      { emoji: '🍇', name: '비에티 카신에타 모스카토 다스티', store: '와인앤모어 · 신세계L&B', price: '45,000원' },
      { emoji: '🌸', name: '미켈레 키아를로 니볼레 모스카토 다스티', store: '와인앤모어', price: '25,000원' },
      { emoji: '🍑', name: '발비 소프라니 모스카토 다스티', store: '이마트', price: '17,800원' },
    ],
    pairing: '치즈케이크, 마카롱, 신선한 과일, 가벼운 치즈 플레이트',
  },
  sauvignon: {
    emoji: '🍋',
    title: '풀잎 머금은 청사과 같은 너',
    subtitle: '소비뇽 블랑파',
    character: '깔끔하고 시원한 것을 사랑하는 사람. 군더더기 없는 직선적인 매력. 해산물 파티의 영원한 메인 게스트.',
    description: '자몽, 라임, 풀잎의 청량한 산미. 한 모금에 입안이 상쾌해지는 드라이 화이트의 정석.',
    profile: { sweet: -3, body: -3, acid: 4, aroma: 2, complex: -2, bubble: -1 },
    wines: [
      { emoji: '☁️', name: '클라우디 베이 소비뇽 블랑', store: '와인앤모어 · 신세계L&B', price: '55,000원' },
      { emoji: '🍋', name: '킴 크로포드 소비뇽 블랑', store: '이마트 · 홈플러스', price: '24,900원' },
      { emoji: '🌿', name: '빌라 마리아 소비뇽 블랑', store: '와인앤모어 · GS25', price: '19,800원' },
    ],
    pairing: '굴, 해산물, 샐러드, 카프레제, 페타 치즈, 화이트 피자',
  },
  chardonnay: {
    emoji: '🍞',
    title: '갓 구운 빵 같은 너',
    subtitle: '샤르도네파',
    character: '묵직한 우아함을 아는 사람. 따뜻한 부엌에서 버터 듬뿍 요리하는 분위기. 풍부함을 사랑하는 미식가.',
    description: '오크 숙성한 풀바디 화이트. 버터, 바닐라, 브리오슈의 풍부한 향. 화이트의 끝판왕.',
    profile: { sweet: -2, body: 3, acid: 0, aroma: 1, complex: 1, bubble: -1 },
    wines: [
      { emoji: '🍞', name: '루이 자도 부르고뉴 샤르도네', store: '와인앤모어 · 신세계L&B', price: '65,000원' },
      { emoji: '🥐', name: '타라파카 그란 리제르바 샤르도네', store: '이마트', price: '32,800원' },
      { emoji: '🧈', name: '브라운 브라더스 문스트럭 샤르도네', store: 'CU', price: '18,900원' },
    ],
    pairing: '크림 파스타, 로브스터, 버터 닭요리, 트러플 음식',
  },
  pinotnoir: {
    emoji: '🍵',
    title: '갓 우린 홍차 같은 너',
    subtitle: '피노 누아파',
    character: '섬세하고 깊이 있는 사람. 가벼운 듯하지만 한 자 한 자 음미하는 사색가. 향에 민감한 미식가.',
    description: '가벼운 레드지만 향은 풍부. 체리, 라즈베리, 장미, 이끼가 한 잔에. 미식가의 영원한 사랑.',
    profile: { sweet: -2, body: -1, acid: 3, aroma: 3, complex: 4, bubble: -1 },
    wines: [
      { emoji: '🍷', name: '로쉬 벨렌 부르고뉴 피노 누아 비에이 비뉴', store: '와인앤모어', price: '49,000원' },
      { emoji: '🍒', name: '메오미 피노 누아', store: '이마트 · 코스트코', price: '39,900원' },
      { emoji: '🚲', name: '코노 수르 비시클레타 피노 누아', store: '이마트 · 홈플러스', price: '14,900원' },
    ],
    pairing: '오리, 연어, 버섯 요리, 가벼운 치즈, 트러플 리조토',
  },
  merlot: {
    emoji: '🛋️',
    title: '포근한 담요 같은 너',
    subtitle: '메를로파',
    character: '다정하고 부담 없는, 곁에 있으면 편안한 사람. 누구도 거부할 수 없는 둥글둥글함. 데일리 와인의 최강자.',
    description: '부드러운 미디엄 바디 레드. 자두, 초콜릿, 바닐라가 둥글둥글하게 입을 채워줌.',
    profile: { sweet: -1, body: 2, acid: -3, aroma: -1, complex: -2, bubble: -1 },
    wines: [
      { emoji: '🏔️', name: '몬테스 알파 메를로', store: '와인앤모어 · 이마트', price: '35,000원' },
      { emoji: '🍫', name: '베리 브라더스 앤 러드 트레디셔널 클라렛', store: '홈플러스', price: '19,000원' },
      { emoji: '🍇', name: '슈발리에 드 글라낭 메를로', store: 'CU', price: '12,500원' },
    ],
    pairing: '햄버거, 피자, 미트볼, 양념갈비, 한국식 양념고기',
  },
  cabernet: {
    emoji: '🖋️',
    title: '무게감 있는 만년필 같은 너',
    subtitle: '카베르네 소비뇽파',
    character: '클래식과 정통을 아는 사람. 격식 있고 단단한 매력, 시간이 갈수록 진가가 드러나는 묵직한 타입.',
    description: '풀바디 레드의 왕. 블랙커런트, 삼나무, 가죽향의 깊은 향. 강한 탄닌과 단단한 구조감.',
    profile: { sweet: -3, body: 4, acid: 1, aroma: 1, complex: 3, bubble: -1 },
    wines: [
      { emoji: '🏰', name: '샤또 다우작 마르고 2021', store: '코스트코', price: '77,900원' },
      { emoji: '🏅', name: '1865 카베르네 소비뇽', store: '와인앤모어 · 이마트', price: '45,000원' },
      { emoji: '😈', name: '카시예로 델 디아블로 카베르네 소비뇽', store: '코스트코 · 이마트', price: '14,000원' },
    ],
    pairing: '스테이크, 양고기, 진한 치즈, 다크초콜릿, 짙은 소스의 햄버거',
  },
  malbec: {
    emoji: '💃',
    title: '한밤의 탱고 같은 너',
    subtitle: '말벡파',
    character: '강렬한 자극을 사랑하는 사람. 한 잔에 우주를 담는, 정열적이고 농밀한 매력. 분위기를 휘어잡는 카리스마.',
    description: '농밀한 과실 폭탄. 자두, 블랙베리, 다크초콜릿. 한 모금에 풍성한 풀바디 경험.',
    profile: { sweet: -1, body: 4, acid: -2, aroma: 1, complex: -2, bubble: -1 },
    wines: [
      { emoji: '🔥', name: '카테나 말벡', store: '와인앤모어 · 코스트코', price: '39,000원' },
      { emoji: '💃', name: '트라피체 오크 캐스크 말벡', store: '이마트 · 홈플러스', price: '19,800원' },
      { emoji: '🌄', name: '커클랜드 시그니처 말벡 아르헨티나', store: '코스트코', price: '11,990원' },
    ],
    pairing: '아르헨티나식 스테이크, 양갈비, 바비큐, 매콤한 한식',
  },
}

const AXES: Array<{ key: ScoreKey; left: string; right: string }> = [
  { key: 'sweet', left: '드라이', right: '단맛' },
  { key: 'body', left: '가벼움', right: '묵직' },
  { key: 'acid', left: '부드러움', right: '산미' },
  { key: 'aroma', left: '은은한 향', right: '진한 향' },
  { key: 'complex', left: '직관', right: '복합' },
  { key: 'bubble', left: '잔잔', right: '톡톡' },
]

const emptyScores: Scores = { sweet: 0, body: 0, acid: 0, aroma: 0, complex: 0, bubble: 0 }

function findBestMatch(scores: Scores): string {
  let bestKey = 'merlot'
  let minDist = Infinity
  for (const [key, wine] of Object.entries(wineTypes)) {
    let dist = 0
    for (const axis of Object.keys(emptyScores) as ScoreKey[]) {
      const diff = scores[axis] - wine.profile[axis]
      dist += diff * diff
    }
    if (dist < minDist) {
      minDist = dist
      bestKey = key
    }
  }
  return bestKey
}

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState<Scores>({ ...emptyScores })

  const matchedKey = useMemo(() => findBestMatch(scores), [scores])
  const wine = wineTypes[matchedKey]
  const progress = ((currentQ + 1) / questions.length) * 100

  const startQuiz = () => {
    setCurrentQ(0)
    setScores({ ...emptyScores })
    setScreen('quiz')
  }

  const answer = (option: Option) => {
    const next = { ...scores }
    for (const [k, v] of Object.entries(option.scores)) {
      next[k as ScoreKey] += v
    }
    setScores(next)
    if (currentQ + 1 < questions.length) {
      setCurrentQ(q => q + 1)
    } else {
      setScreen('result')
    }
  }

  const shareResult = () => {
    const text = `🍷 내 와인 캐릭터: ${wine.title} (${wine.subtitle})\n${wine.character}`
    const url = 'https://jhee086.github.io/winestyle/'

    if (navigator.share) {
      navigator.share({ title: '취향와인 · 내 와인 캐릭터는?', text, url })
    } else {
      navigator.clipboard?.writeText(`${text}\n\n${url}`).then(() => alert('복사됐어요! 🍷'))
    }
  }

  return (
    <div className="app">
      {screen === 'landing' && (
        <div className="screen landing">
          <div className="landing-icon">🍷</div>
          <div className="landing-title">내 와인 캐릭터는?</div>
          <div className="landing-subtitle">일상 취향으로 찾는 내 와인 스타일</div>
          <div className="landing-tag">8문항 · 8가지 타입</div>
          <div className="landing-description">
            와인 한 잔 마셔본 적 없어도 OK!<br />
            와인 몰라도, 취향은 알잖아요
          </div>
          <button className="btn-primary" onClick={startQuiz}>시작하기</button>
          <BannerAd slot="landing" />
        </div>
      )}

      {screen === 'quiz' && (
        <div className="screen quiz">
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="quiz-number">Q{currentQ + 1} / {questions.length}</div>
          <div className="quiz-question">{questions[currentQ].q}</div>
          <div className="options">
            <button className="option" onClick={() => answer(questions[currentQ].a)}>
              <div className="option-icon">{questions[currentQ].a.icon}</div>
              <div className="option-text">{questions[currentQ].a.text}</div>
            </button>
            <button className="option" onClick={() => answer(questions[currentQ].b)}>
              <div className="option-icon">{questions[currentQ].b.icon}</div>
              <div className="option-text">{questions[currentQ].b.text}</div>
            </button>
          </div>
          <BannerAd slot={currentQ % 2 === 0 ? 'quiz_a' : 'quiz_b'} />
        </div>
      )}

      {screen === 'result' && (
        <div className="screen result-screen">
          <div className="result-code">내 와인 캐릭터는?</div>
          <div className="result-emoji">{wine.emoji}</div>
          <div className="result-title">{wine.title}</div>
          <div className="result-subtitle">{wine.subtitle}</div>
          <div className="result-character">{wine.character}</div>
          <div className="result-description">🍷 {wine.description}</div>

          <div className="profile">
            <div className="profile-label">📊 내 취향 프로필</div>
            {AXES.map(({ key, left, right }) => {
              const percent = Math.max(5, Math.min(95, ((scores[key] + 4) / 8) * 100))
              return (
                <div className="profile-row" key={key}>
                  <div className="profile-axis-left">{left}</div>
                  <div className="profile-bar-container">
                    <div className="profile-bar-fill" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="profile-axis-right">{right}</div>
                </div>
              )
            })}
          </div>

          <BannerAd slot="result" />
          <div className="section-label">🍷 추천 와인</div>
          <div className="wine-list">
            {wine.wines.map((w) => (
              <div className="wine-card" key={w.name}>
                <div className="wine-icon">{w.emoji}</div>
                <div className="wine-info">
                  <div className="wine-name">{w.name}</div>
                  <div className="wine-meta">{w.store}</div>
                </div>
                <div className="wine-price">{w.price}</div>
              </div>
            ))}
          </div>

          <div className="pairing">
            <div className="pairing-label">🍽️ 함께 먹으면 좋은</div>
            <div className="pairing-text">{wine.pairing}</div>
          </div>

          <div className="actions">
            <button className="btn-restart" onClick={startQuiz}>다시하기</button>
            <button className="btn-secondary" onClick={shareResult}>결과 공유</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
