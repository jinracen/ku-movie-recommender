// ==========================================
// KOREA UNIVERSITY MOVIE RECOMMENDER SYSTEM
// Renderer Process & Application Logic
// ==========================================

// Global state
let currentUser = null;
let selectedMood = null;

// Embedded movies dataset to prevent CORS issues when opening index.html via file:// protocol
const moviesDataset = [
  {
    "id": 1,
    "title": "써니",
    "genre": "코미디/드라마",
    "rating": "15세이상관람가",
    "moodTags": ["기쁨", "신남"],
    "keywords": ["친구", "추억", "우정", "학창시절", "시험", "종강"],
    "description": "찬란하게 빛나는 학창시절의 칠공주 '써니'가 25년 만에 다시 모여 생애 최고의 순간을 되찾는 유쾌하고 감동적인 이야기.",
    "recommendationReason": "시험이나 과제가 끝난 오늘, 오랜 친구들과의 소중한 추억을 되새기며 유쾌하게 웃고 울 수 있는 최고의 힐링 영화입니다!",
    "posterUrl": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&q=80"
  },
  {
    "id": 2,
    "title": "라라랜드",
    "genre": "로맨스/뮤지컬",
    "rating": "12세이상관람가",
    "moodTags": ["기쁨", "신남", "불안"],
    "keywords": ["사랑", "꿈", "재즈", "낭만", "대학", "캠퍼스"],
    "description": "인생의 가장 빛나는 순간, 서로의 무대를 완성해가는 두 예술가 세바스찬과 미아의 거짓말 같은 사랑과 꿈의 멜로디.",
    "recommendationReason": "캠퍼스의 낭만과 예술적 영감을 채우고 싶은 학우님께 선사하는, 눈과 귀가 황홀해지는 인생 뮤지컬 영화입니다.",
    "posterUrl": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80"
  },
  {
    "id": 3,
    "title": "극한직업",
    "genre": "코미디/액션",
    "rating": "15세이상관람가",
    "moodTags": ["기쁨", "신남"],
    "keywords": ["치킨", "경찰", "웃음", "스트레스", "동아리", "종강"],
    "description": "해체 위기의 마약반 5인방이 범죄조직 소탕을 위해 위장창업한 치킨집이 일약 맛집으로 입소문이 나면서 벌어지는 코믹 수사극.",
    "recommendationReason": "오늘 하루 전공 시험과 과제로 쌓인 엄청난 스트레스를 아무 생각 없이 시원한 치맥과 함께 날려버릴 수 있는 폭소 보장 코미디입니다!",
    "posterUrl": "https://images.unsplash.com/photo-1562967914-6c8f6397e58a?w=500&q=80"
  },
  {
    "id": 4,
    "title": "어바웃 타임",
    "genre": "로맨스/판타지",
    "rating": "15세이상관람가",
    "moodTags": ["기쁨", "신남", "슬픔"],
    "keywords": ["시간", "가족", "사랑", "인생", "하루", "선택"],
    "description": "성인이 되자마자 시간 여행 능력이 있다는 가문의 비밀을 알게 된 팀이 첫눈에 반한 메리와의 완벽한 사랑을 이루기 위해 특별한 시간 여행을 시작하는 이야기.",
    "recommendationReason": "오늘이라는 평범한 하루가 얼마나 특별하고 소중한 선물인지 깨닫게 해주는 가슴 따뜻한 인생 로맨스 영화입니다.",
    "posterUrl": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80"
  },
  {
    "id": 5,
    "title": "월터의 상상은 현실이 된다",
    "genre": "모험/드라마",
    "rating": "12세이상관람가",
    "moodTags": ["기쁨", "신남", "피곤"],
    "keywords": ["여행", "도전", "상상", "일상", "모험", "방학"],
    "description": "16년째 잡지사에서 일하며 상상으로만 모험을 즐기던 월터가 사라진 전설의 사진을 찾아 그린란드, 아이슬란드 등으로 진짜 모험을 떠나는 이야기.",
    "recommendationReason": "매일 똑같은 일상이 답답하거나 다가오는 방학에 진짜 나를 찾는 모험을 꿈꾸는 고대 학우님들께 용기를 주는 모험 활극입니다.",
    "posterUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80"
  },
  {
    "id": 6,
    "title": "세 얼간이",
    "genre": "코미디/드라마",
    "rating": "12세이상관람가",
    "moodTags": ["기쁨", "신남", "불안"],
    "keywords": ["대학", "공부", "우정", "성공", "인생", "꿈"],
    "description": "일류 명문 공대에 입학한 세 친구가 주입식 교육에 반기를 들며 진정한 배움과 꿈을 찾아 나가는 좌충우돌 학창시절 이야기.",
    "recommendationReason": "'알 이즈 웰(All is well)!' 학업과 학점 경쟁에 치여 불안해하는 고대생들에게 인생의 진짜 행복과 나아가야 할 방향을 알려주는 힐링 수작입니다.",
    "posterUrl": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80"
  },
  {
    "id": 7,
    "title": "소울",
    "genre": "애니메이션/판타지",
    "rating": "전체관람가",
    "moodTags": ["기쁨", "피곤", "슬픔"],
    "keywords": ["영혼", "인생", "재즈", "위로", "꿈", "힐링"],
    "description": "뉴욕에서 재즈 피아니스트로 서기 직전 불의의 사고로 영혼이 된 '조'가 지구에 가기 싫어하는 시니컬한 영혼 '22'의 멘토가 되어 펼치는 놀라운 여정.",
    "recommendationReason": "대단한 목표나 성공을 이루지 않아도, 우리가 살아 숨 쉬는 매 순간의 일상이 얼마나 아름다운 가치인지 따뜻하게 어루만져 줍니다.",
    "posterUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80"
  },
  {
    "id": 8,
    "title": "스파이더맨: 뉴 유니버스",
    "genre": "애니메이션/액션",
    "rating": "12세이상관람가",
    "moodTags": ["기쁨", "신남"],
    "keywords": ["히어로", "성장", "멀티버스", "만화", "힙합", "친구"],
    "description": "평범한 고등학생 마일스 모랄레스가 새로운 스파이더맨이 되어 다른 평행 우주에서 온 스파이더맨들과 힘을 합쳐 위기를 헤쳐나가는 스펙터클 성장기.",
    "recommendationReason": "트렌디한 비주얼과 화려한 힙합 OST, 눈이 번쩍 뜨이는 애니메이션 연출로 신나고 파워풀한 에너지를 200% 충전하고 싶을 때 강추합니다!",
    "posterUrl": "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&q=80"
  },
  {
    "id": 9,
    "title": "노트북",
    "genre": "로맨스/드라마",
    "rating": "15세이상관람가",
    "moodTags": ["슬픔", "우울"],
    "keywords": ["사랑", "이별", "첫사랑", "약속", "눈물", "감동"],
    "description": "17살에 만난 노아와 앨리의 불꽃 같은 첫사랑, 신분 차이와 전쟁이라는 장벽을 뛰어넘어 평생 동안 이어지는 기적 같은 러브스토리.",
    "recommendationReason": "애절하고 위대한 사랑 이야기를 보며 가슴속 깊이 묻어둔 감정을 쏟아내고 깊은 눈물을 흘리며 위로받고 싶은 분께 추천합니다.",
    "posterUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80"
  },
  {
    "id": 10,
    "title": "이터널 선샤인",
    "genre": "로맨스/SF",
    "rating": "15세이상관람가",
    "moodTags": ["슬픔", "우울", "불안"],
    "keywords": ["기억", "이별", "사랑", "삭제", "아픔", "그리움"],
    "description": "이별의 아픔을 지우기 위해 서로의 기억을 지우는 수술을 받은 조엘과 클레멘타인. 기억이 지워질수록 오히려 사랑했던 순간들이 더 선명하게 되살아나는 신비로운 멜로.",
    "recommendationReason": "최근 이별을 겪었거나 지나간 사랑의 기억에 가슴 아파하고 계시다면, 기억을 지워도 마음속에 남는 사랑의 본질을 통해 따뜻한 위안을 줄 것입니다.",
    "posterUrl": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80"
  },
  {
    "id": 11,
    "title": "500일의 썸머",
    "genre": "로맨스/코미디",
    "rating": "15세이상관람가",
    "moodTags": ["슬픔", "우울", "기쁨"],
    "keywords": ["연애", "이별", "현실", "성장", "오해", "운명"],
    "description": "운명적 사랑을 믿는 톰과 사랑은 환상일 뿐이라 생각하는 썸머의 500일간의 뜨겁고 쌉싸름한 현실 연애 기록.",
    "recommendationReason": "실연의 아픔으로 우울해하고 있다면, 연애의 민낯을 아주 현실적으로 해부하여 톰의 성장 과정을 통해 이별을 극복할 건강한 에너지를 전해줍니다.",
    "posterUrl": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&q=80"
  },
  {
    "id": 12,
    "title": "인생은 아름다워",
    "genre": "드라마/전쟁",
    "rating": "12세이상관람가",
    "moodTags": ["슬픔", "우울", "기쁨"],
    "keywords": ["가족", "부성애", "전쟁", "유머", "희망", "눈물"],
    "description": "제2차 세계대전 당시 유대인 수용소의 참혹한 현실 속에서도, 어린 아들의 동심을 지켜주기 위해 수용소 생활을 하나의 거대한 놀이로 위장하는 아버지 귀도의 감동 실화.",
    "recommendationReason": "슬프고 비극적인 상황 속에서도 잃지 않는 유머와 눈물겨운 부성애를 통해 삶이 왜 아름다운지 묵직하게 보여주는 인류 역사상 최고의 감동작입니다.",
    "posterUrl": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80"
  },
  {
    "id": 13,
    "title": "매드맥스: 분노의 도로",
    "genre": "액션/SF",
    "rating": "15세이상관람가",
    "moodTags": ["화남", "신남"],
    "keywords": ["사막", "자동차", "추격", "폭발", "과제", "스트레스"],
    "description": "물과 기름을 차지한 독재자 임모탄에 맞서 사막을 질주하며 살아남으려는 통제 불능의 전사 맥스와 여전사 퓨리오사의 목숨을 건 광란의 추격전.",
    "recommendationReason": "과제 폭탄이나 인간관계로 가슴속 깊은 분노가 끓어오를 때! 시원하게 폭발하는 질주와 짜릿한 락 비트로 억눌린 답답함을 한방에 해소하세요!",
    "posterUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80"
  },
  {
    "id": 14,
    "title": "존 윅",
    "genre": "액션/스릴러",
    "rating": "청소년관람불가",
    "moodTags": ["화남"],
    "keywords": ["복수", "총격전", "강아지", "타격감", "분노", "해소"],
    "description": "더 이상 잃을 것이 없는 전설의 킬러 존 윅이 자신의 유일한 위안이었던 강아지를 죽인 조직을 향해 벌이는 무자비하고 화려한 복수극.",
    "recommendationReason": "스트레스로 인해 모든 것을 파괴하고 싶은 기분일 때, 존 윅의 스타일리시하고 가차 없는 복수 액션을 보며 대리만족และ 짜릿함을 즐겨보세요.",
    "posterUrl": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80"
  },
  {
    "id": 15,
    "title": "베테랑",
    "genre": "액션/드라마",
    "rating": "15세이상관람가",
    "moodTags": ["화남", "신남"],
    "keywords": ["정의", "경찰", "재벌", "사이다", "복수", "시원함"],
    "description": "한 번 꽂히면 끝장을 보는 베테랑 광역수사대 형사 서도철과 안하무인 유아독존인 재벌 3세 조태오의 자존심을 건 한판 승부.",
    "recommendationReason": "부조리한 세상이나 얌체 같은 사람에게 잔뜩 화가 났을 때, 나쁜 놈을 법과 주먹으로 가차 없이 징벌하는 사이다 액션으로 속을 뻥 뚫어 드립니다.",
    "posterUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80"
  },
  {
    "id": 16,
    "title": "위플래쉬",
    "genre": "드라마/음악",
    "rating": "15세이상관람가",
    "moodTags": ["화남", "불안", "신남"],
    "keywords": ["드럼", "천재", "폭언", "광기", "집착", "한계"],
    "description": "최고의 드럼 연주자가 되고 싶은 신입생 앤드류와 그의 천재성을 폭력적인 방식으로 끌어내는 악명 높은 폭군 플레쳐 교수의 불꽃 튀는 광기의 대결.",
    "recommendationReason": "학업이나 진로 때문에 스스로의 한계에 부딪혀 짜증이 나고 자신감이 떨어졌을 때, 폭발하는 드럼 비트와 광기에 동화되어 한계를 돌파해보세요.",
    "posterUrl": "https://images.unsplash.com/photo-1524567214243-00d301c18e12?w=500&q=80"
  },
  {
    "id": 17,
    "title": "리틀 포레스트",
    "genre": "드라마/힐링",
    "rating": "전체관람가",
    "moodTags": ["피곤", "지침", "우울"],
    "keywords": ["고향", "시골", "요리", "친구", "사계절", "자연"],
    "description": "시험, 연애, 취업 등 뭐 하나 마음대로 되지 않는 혜원이 도시를 떠나 고향으로 돌아와 친구들과 직접 농사지은 작물로 정성스런 끼니를 만들어 먹으며 겨울, 봄, 여름, 가을을 보내는 휴식 이야기.",
    "recommendationReason": "취업 걱정, 학점 관리로 방전되어 버린 고대생 학우님들에게 따뜻한 시골 밥상과 조용한 사계절 풍경으로 가만히 손을 잡아주는 최고의 무공해 힐링 영화입니다.",
    "posterUrl": "https://images.unsplash.com/photo-1505232458729-26417ff63cfa?w=500&q=80"
  },
  {
    "id": 18,
    "title": "인턴",
    "genre": "코미디/드라마",
    "rating": "12세이상관람가",
    "moodTags": ["피곤", "지침", "기쁨"],
    "keywords": ["직장", "인생선배", "조언", "성공", "워킹맘", "우정"],
    "description": "창업 1년 반 만에 직원을 220명으로 키운 열정적인 젊은 CEO 줄스 밑으로, 70세의 황혼기를 보내는 지혜롭고 매너 넘치는 벤이 시니어 인턴으로 입사하며 벌어지는 훈훈한 성장 드라마.",
    "recommendationReason": "인생의 갈림길에서 불안하고 지친 청춘들에게, 따뜻한 눈빛으로 '너는 지금도 아주 잘하고 있어'라고 조언해주는 든든한 멘토를 만나보세요.",
    "posterUrl": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80"
  },
  {
    "id": 19,
    "title": "굿 윌 헌팅",
    "genre": "드라마",
    "rating": "15세이상관람가",
    "moodTags": ["피곤", "지침", "불안"],
    "keywords": ["수학", "천재", "상처", "위로", "스승", "상담"],
    "description": "천재적인 두뇌를 가졌으나 어린 시절의 상처로 마음을 닫고 MIT 청소부로 살아가던 윌 헌팅이 심리학 교수 숀 맥과이어를 만나며 상처를 치유하고 마음을 여는 이야기.",
    "recommendationReason": "전공이나 진로 고민으로 무기력해지고 나 자신을 부정하고 싶을 때, 주인공의 아픔에 공감하며 '네 잘못이 아니야(It's not your fault)'라는 진정한 위로를 느낄 수 있습니다.",
    "posterUrl": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80"
  },
  {
    "id": 20,
    "title": "마션",
    "genre": "SF/모험",
    "rating": "12세이상관람가",
    "moodTags": ["불안", "신남", "피곤"],
    "keywords": ["우주", "화성", "생존", "감자", "유머", "긍정"],
    "description": "화성 탐사 중 낙오되어 홀로 살아남아야 하는 우주비행사이자 식물학자 마크 와트니가 유쾌한 긍정성과 과학적 지식을 총동원하여 화성에서 살아남는 유쾌한 생존기.",
    "recommendationReason": "취업, 시험, 연애 등 막막하고 고독한 상황에 닥쳐 불안감이 가득할 때, 와트니의 긍정적인 극복기를 통해 용기와 해낼 수 있다는 자신감을 심어줍니다.",
    "posterUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80"
  },
  {
    "id": 21,
    "title": "인셉션",
    "genre": "SF/액션",
    "rating": "12세이상관람가",
    "moodTags": ["불안", "신남"],
    "keywords": ["꿈", "의식", "도둑", "압도적", "반전", "몰입"],
    "description": "타인의 꿈에 침투하여 머릿속 정보를 훔치거나 새로운 생각을 심는 작전을 수행하는 특수 보안 요원 돔 코브의 상상력을 초월하는 마지막 임무.",
    "recommendationReason": "다가오는 시험의 부담감이나 막막한 미래에 대한 불안으로 머릿속이 복잡할 때, 다른 생각은 전혀 할 수 없도록 압도하는 연출력과 탄탄한 스토리에 온전히 몰입해보세요.",
    "posterUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&q=80"
  },
  {
    "id": 22,
    "title": "히든 피겨스",
    "genre": "드라마/실화",
    "rating": "전체관람가",
    "moodTags": ["불안", "기쁨", "지침"],
    "keywords": ["우주", "실화", "천재", "인종차별", "성공", "극복"],
    "description": "1960년대 미국과 러시아의 우주 개발 경쟁에서 천재적인 수학 능력을 통해 NASA의 궤도 계산을 해냈지만, 인종과 여성이라는 차별의 장벽에 맞서야 했던 세 명의 흑인 여성 과학자들의 실화 드라마.",
    "recommendationReason": "내가 속한 환경이나 나의 한계 때문에 미래가 불안하고 주저앉고 싶을 때, 온갖 역경을 뚫고 끝내 빛을 발한 위대한 성취 실화를 보며 강력한 도전 의식을 얻을 수 있습니다.",
    "posterUrl": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&q=80"
  },
  {
    "id": 23,
    "title": "월-E",
    "genre": "애니메이션/SF",
    "rating": "전체관람가",
    "moodTags": ["피곤", "지침", "기쁨"],
    "keywords": ["우주", "로봇", "힐링", "지구", "사랑", "소박함"],
    "description": "텅 빈 지구에 홀로 남아 수백 년 동안 묵묵히 쓰레기를 치우던 지구 청소기 로봇 월-E가 우주에서 온 세련된 로봇 이브를 만나 사랑에 빠지고 인류의 미래를 구하는 모험.",
    "recommendationReason": "대사 한 마디 없이 소박하고 사랑스러운 눈빛만으로 깊은 따스함을 선사하는 명작입니다. 몸과 마음이 완전히 지친 날, 순수한 감동을 느껴보세요.",
    "posterUrl": "https://images.unsplash.com/photo-1608889174637-3c44f6326f1a?w=500&q=80"
  },
  {
    "id": 24,
    "title": "셔터 아일랜드",
    "genre": "미스터리/스릴러",
    "rating": "15세이상관람가",
    "moodTags": ["불안"],
    "keywords": ["정신병원", "형사", "실종", "음모", "반전", "긴장감"],
    "description": "보스턴 셔터 아일랜드의 정신병원에서 환자가 실종되는 사건이 발생하자 수사를 위해 투입된 연방보안관 테디가 병원의 숨겨진 충격적인 진실과 마주하는 미스터리 스릴러.",
    "recommendationReason": "숨 막히는 심리전과 치밀한 연출로 손에 땀을 쥐게 만드는 몰입도 100% 스릴러입니다. 일상의 소소한 불안을 잊게 할 정도로 강렬한 미스터리를 선사합니다.",
    "posterUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80"
  },
  {
    "id": 25,
    "title": "기생충",
    "genre": "드라마/스릴러",
    "rating": "15세이상관람가",
    "moodTags": ["불안", "우울"],
    "keywords": ["가족", "빈부격차", "반전", "몰입", "사회", "봉준호"],
    "description": "전원 백수인 기택네 장남 기우가 고액 과외 면접을 위해 박사장네 집에 발을 들이면서 시작되는 두 가족의 만남이 걷잡을 수 없는 사건으로 번져가는 희비극.",
    "recommendationReason": "칸 영화제 황금종려상 및 아카데미 4관왕에 빛나는 걸작입니다. 현실적인 블랙 유머와 팽팽한 긴장감으로 몰입하여 관람할 수 있습니다.",
    "posterUrl": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&q=80"
  },
  {
    "id": 26,
    "title": "킹스맨: 시크릿 에이전트",
    "genre": "액션/코미디",
    "rating": "청소년관람불가",
    "moodTags": ["화남", "신남"],
    "keywords": ["스파이", "슈트", "액션", "사이다", "B급감성", "우산"],
    "description": "학교를 중퇴하고 루저로 살아가던 에그시가 전설적인 베테랑 요원 해리 하트를 만나 국제 비밀정보기구 '킹스맨'의 최정예 요원으로 성장해 나가는 액션 블록버스터.",
    "recommendationReason": "'매너가 사람을 만든다.' 답답하고 화나는 상황을 날려버리는 스타일리시하고 잔인하지만 유쾌한 B급 감성 액션의 극치입니다. (미성년자 관람 불가에 주의하세요!)",
    "posterUrl": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80"
  },
  {
    "id": 27,
    "title": "카모메 식당",
    "genre": "드라마/힐링",
    "rating": "전체관람가",
    "moodTags": ["피곤", "지침"],
    "keywords": ["음식", "핀란드", "식당", "일상", "힐링", "조용함"],
    "description": "핀란드 헬싱키에 오니기리(주먹밥)를 대표 메뉴로 내건 조그만 일식집을 열어둔 사치에와 그녀를 찾아온 손님들의 잔잔하고 소소한 일상 교감 이야기.",
    "recommendationReason": "잔잔한 호흡과 정갈한 요리 냄새가 마음의 허기를 조용히 채워줍니다. 복잡하고 시끄러운 현실에서 탈출하고 싶은 피곤한 날에 따스한 쉼표를 찍어줍니다.",
    "posterUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80"
  },
  {
    "id": 28,
    "title": "타이타닉",
    "genre": "로맨스/드라마",
    "rating": "15세이상관람가",
    "moodTags": ["슬픔", "우울"],
    "keywords": ["사랑", "선박", "재난", "비극", "희생", "인생"],
    "description": "1912년 초호화 여객선 타이타닉호에 탑승한 자유로운 영혼의 청년 잭과 상류사회에 숨막혀 하던 로즈의 신분을 초월한 불꽃 같은 사랑과 거대한 비극의 대서사시.",
    "recommendationReason": "우울한 마음을 씻어내 줄 거대한 감동과 슬픔이 필요할 때, 역사상 가장 위대한 사랑 실화와 아름다운 선율의 주제가로 가슴을 적셔 보세요.",
    "posterUrl": "https://images.unsplash.com/photo-1500099817043-86d46000d58f?w=500&q=80"
  },
  {
    "id": 29,
    "title": "러브레터",
    "genre": "로맨스/드라마",
    "rating": "전체관람가",
    "moodTags": ["슬픔", "우울"],
    "keywords": ["첫사랑", "편지", "눈", "겨울", "그리움", "오구라"],
    "description": "사고로 세상을 떠난 약혼자 후지이 이츠키에게 보낸 러브레터에 예기치 못한 동명이인으로부터 답장이 오며 시작되는 아련한 첫사랑의 비밀 추적.",
    "recommendationReason": "'오겡끼데스까(잘 지내시나요)?' 차분하고 우울한 겨울날, 첫사랑의 깊은 아련함과 잊고 있던 그리움을 조용히 꺼내 보고 싶을 때 추천합니다.",
    "posterUrl": "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=500&q=80"
  },
  {
    "id": 30,
    "title": "포레스트 검프",
    "genre": "드라마/코미디",
    "rating": "12세이상관람가",
    "moodTags": ["기쁨", "피곤", "지침"],
    "keywords": ["달리기", "인생", "초콜릿", "순수", "감동", "역사"],
    "description": "지능 지수가 낮지만 누구보다 따뜻하고 순수한 포레스트 검프가 오직 달리기 하나로 미식축구 스타, 베트남 전쟁 영웅, 탁구 국가대표 등을 거치며 현대사의 풍파 속에서 기적 같은 삶을 만들어가는 드라마.",
    "recommendationReason": "'인생은 초콜릿 상자와 같단다.' 삶이 너무 지치고 방향을 잃은 기분이 들 때, 포레스트의 우직하고 따뜻한 질주를 보며 잊었던 감동과 삶의 활력을 찾아보세요.",
    "posterUrl": "https://images.unsplash.com/photo-1473116763269-25541579ff6f?w=500&q=80"
  }
];

// DOM Elements
const secLogin = document.getElementById('sec-login');
const secRegister = document.getElementById('sec-register');
const secDashboard = document.getElementById('sec-dashboard');

const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

const btnGoRegister = document.getElementById('btn-go-register');
const btnBackLogin = document.getElementById('btn-back-login');
const btnLogout = document.getElementById('btn-logout');

const headerUserInfo = document.getElementById('header-user-info');
const headerUserName = document.getElementById('header-user-name');

const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

const moodButtons = document.querySelectorAll('.mood-btn');
const txtDiary = document.getElementById('txt-diary');
const btnGetRecommendation = document.getElementById('btn-get-recommendation');

const recResults = document.getElementById('recommendation-results');
const defaultView = document.getElementById('default-dashboard-view');
const movieCardsContainer = document.getElementById('movie-cards-container');
const btnBackDashboard = document.getElementById('btn-back-dashboard');
const historyListContainer = document.getElementById('history-list');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupAuth();
  setupDashboard();
});

// 1. Navigation Flow Control
function showSection(sectionId) {
  [secLogin, secRegister, secDashboard].forEach(sec => {
    sec.classList.add('hidden');
  });
  
  if (sectionId === 'login') {
    secLogin.classList.remove('hidden');
    headerUserInfo.classList.add('hidden');
  } else if (sectionId === 'register') {
    secRegister.classList.remove('hidden');
    headerUserInfo.classList.add('hidden');
  } else if (sectionId === 'dashboard') {
    secDashboard.classList.remove('hidden');
    headerUserInfo.classList.remove('hidden');
    if (currentUser) {
      // Show customized user title (Department + Name)
      const deptName = currentUser.dept || "중어중문학과";
      headerUserName.textContent = `${deptName} ${currentUser.name}`;
    }
  }
}

function setupNavigation() {
  btnGoRegister.addEventListener('click', () => {
    registerError.textContent = '';
    formRegister.reset();
    showSection('register');
  });

  btnBackLogin.addEventListener('click', () => {
    loginError.textContent = '';
    formLogin.reset();
    showSection('login');
  });

  btnLogout.addEventListener('click', () => {
    currentUser = null;
    showSection('login');
  });
}

// 2. Authentication Logic (Login & Registration)
function setupAuth() {
  // Login submission
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    loginError.textContent = '';
    
    const id = document.getElementById('login-id').value.trim();
    const pw = document.getElementById('login-pw').value;

    const result = Database.loginUser(id, pw);
    if (result.success) {
      currentUser = result.user;
      showSection('dashboard');
      loadMoodHistory();
      resetRecommendationForm();
    } else {
      loginError.textContent = result.message;
    }
  });

  // Registration submission
  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    registerError.textContent = '';

    const id = document.getElementById('reg-id').value.trim();
    const pw = document.getElementById('reg-pw').value;
    const name = document.getElementById('reg-name').value.trim();
    const age = parseInt(document.getElementById('reg-age').value, 10);
    const gender = document.getElementById('reg-gender').value;
    const dept = document.getElementById('reg-dept').value.trim();
    const favoriteMovie = document.getElementById('reg-movie').value.trim();
    const favoriteGenre = document.getElementById('reg-genre').value;

    // Simple validation
    if (!id || !pw || !name || !age || !gender || !dept || !favoriteGenre) {
      registerError.textContent = "필수 항목(*)을 모두 입력해 주세요.";
      return;
    }

    const userData = {
      id,
      password: pw,
      name,
      age,
      gender,
      dept,
      favoriteMovie,
      favoriteGenre
    };

    const result = Database.registerUser(userData);
    if (result.success) {
      alert("회원가입이 성공적으로 완료되었습니다! 가입하신 정보로 로그인해 주세요.");
      showSection('login');
      // Autofill the login id
      document.getElementById('login-id').value = id;
    } else {
      registerError.textContent = result.message;
    }
  });

  // Password visibility toggle
  const btnToggleRegPw = document.getElementById('btn-toggle-reg-pw');
  const regPwInput = document.getElementById('reg-pw');
  if (btnToggleRegPw && regPwInput) {
    btnToggleRegPw.addEventListener('click', () => {
      if (regPwInput.type === 'password') {
        regPwInput.type = 'text';
        btnToggleRegPw.textContent = '🙈';
      } else {
        regPwInput.type = 'password';
        btnToggleRegPw.textContent = '👁️';
      }
    });
  }
}

// 3. Dashboard Logic (Mood Logging & Movie Recommending)
function setupDashboard() {
  // Mood Selection Toggle
  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      moodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMood = btn.getAttribute('data-mood');
    });
  });

  // Get Recommendation Action
  btnGetRecommendation.addEventListener('click', () => {
    if (!currentUser) return;
    
    if (!selectedMood) {
      alert("오늘의 대표 기분 아이콘을 선택해 주세요!");
      return;
    }

    const diaryText = txtDiary.value.trim();
    if (!diaryText) {
      alert("오늘 기분에 대해 한두 문장이라도 자유롭게 남겨 주세요!");
      return;
    }

    // Call Recommender Engine with User's favorite movie
    const recommendedMovies = Recommender.recommend(
      moviesDataset, 
      currentUser.age, 
      selectedMood, 
      diaryText, 
      currentUser.favoriteMovie
    );

    if (recommendedMovies.length === 0) {
      alert("학우님의 나이 제한 조건에 적합한 영화를 찾지 못했습니다. 가입 연령 정보를 다시 확인해 주세요.");
      return;
    }

    // Save in Local DB
    const movieIds = recommendedMovies.map(m => m.id);
    Database.logMood(currentUser.id, {
      moodIcon: getMoodEmoji(selectedMood),
      moodName: selectedMood,
      moodText: diaryText,
      recommendedMovies: movieIds
    });

    // Render Movie Cards
    renderRecommendations(recommendedMovies);
    
    // UI Panels Transition
    defaultView.classList.add('hidden');
    recResults.classList.remove('hidden');
    
    // Refresh History in background
    loadMoodHistory();
  });

  // Back to Dashboard from results
  btnBackDashboard.addEventListener('click', () => {
    resetRecommendationForm();
    recResults.classList.add('hidden');
    defaultView.classList.remove('hidden');
  });
}

// Helper to get Mood Emojis
function getMoodEmoji(moodName) {
  const emojis = {
    "기쁨": "😊",
    "슬픔": "😭",
    "화남": "😡",
    "피곤": "🥱",
    "불안": "😳"
  };
  return emojis[moodName] || "🦁";
}

// Reset Recommendation input fields
function resetRecommendationForm() {
  moodButtons.forEach(b => b.classList.remove('active'));
  selectedMood = null;
  txtDiary.value = '';
}

// Render the Recommended Movie Cards
function renderRecommendations(movies) {
  movieCardsContainer.innerHTML = '';

  movies.forEach(movie => {
    const ratingShort = movie.rating.replace("이상관람가", "");
    
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <div class="movie-poster-wrap">
        <img class="movie-poster" src="${movie.posterUrl}" alt="${movie.title} 포스터" onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80'">
        <div class="movie-rating-badge rating-${ratingShort.substring(0,2)}">${movie.rating}</div>
      </div>
      <div class="movie-card-body">
        <span class="movie-genre">${movie.genre}</span>
        <h4 class="movie-title">${movie.title}</h4>
        <p class="movie-desc">${movie.description}</p>
        <div class="movie-reason-box">
          <h5>🦁 고대생 맞춤 코멘트</h5>
          <p>${movie.recommendationReason}</p>
        </div>
      </div>
    `;
    movieCardsContainer.appendChild(card);
  });
}

// Load and Render User's Mood Log History
function loadMoodHistory() {
  if (!currentUser) return;

  const logs = Database.getMoodLogs(currentUser.id);
  historyListContainer.innerHTML = '';

  if (logs.length === 0) {
    historyListContainer.innerHTML = `
      <div class="empty-history">
        <span class="empty-icon">📂</span>
        <p>아직 남겨진 감정 기록이 없습니다.<br>왼쪽에서 첫 기분을 기록해보세요!</p>
      </div>
    `;
    return;
  }

  logs.forEach(log => {
    // Resolve movie titles from saved IDs
    const movieTitles = log.recommendedMovies.map(id => {
      const movie = moviesDataset.find(m => m.id === id);
      return movie ? movie.title : "알 수 없는 영화";
    }).join(", ");

    const dateFormatted = new Date(log.timestamp).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-meta">
        <div class="history-date-row">
          <span class="history-date">${dateFormatted}</span>
          <span class="history-mood-badge">${log.moodIcon} ${log.moodName}</span>
        </div>
        <p class="history-text" title="${log.moodText}">${log.moodText}</p>
      </div>
      <div class="history-movies-list">
        <span class="history-movies-title">🎬 추천받은 영화</span>
        <span class="history-movie-names" title="${movieTitles}">${movieTitles}</span>
      </div>
    `;
    historyListContainer.appendChild(item);
  });
}
