import { SiteData } from './types';

export const INITIAL_SITE_DATA: SiteData = {
  // SEO & Meta
  seoTitle: "펜타플렉스 메트로 - 동매역 0m 초역세권 지식산업센터",
  seoDescription: "부산 1호선 동매역 바로 위! 1차 100% 완판 신화의 주인공, 펜타플렉스 메트로. 제조 특화 드라이브인 시스템과 압도적 미래가치를 누리세요.",
  
  // Header
  title: "PENTAPLEX METRO",
  logoIcon: "building-2",
  representativePhone: "1588-0000",
  
  // Hero Section
  heroSlogan: "동매역 0m, 출구 바로 위! 완판 신화의 두 번째 주인공",
  heroDescription: "부산 1호선 초역세권과 제조 특화 드라이브인 시스템이 만난 서부산 최대 지식산업센터. 1차 100% 완판의 가치를 직접 확인하세요.",
  heroButtonText: "로얄호실 상담 예약",
  heroImages: ["https://picsum.photos/seed/penta-hero/1920/1080"],
  
  // Highlights Section
  highlightsTitle: "7 PREMIUMS",
  highlightsSubtitle: "비즈니스의 속도와 가치가 달라지는 7가지 이유",
  highlights: [
    {
      id: "h1",
      title: "동매역 0m 초역세권",
      description: "1호선 동매역 1번 출구 바로 위, 출퇴근이 비즈니스가 되는 압도적 입지",
      icon: "Train"
    },
    {
      id: "h2",
      title: "8층 드라이브인 시스템",
      description: "화물차가 사무실 앞까지! 도어투도어 시스템으로 물류 혁신 실현",
      icon: "Truck"
    },
    {
      id: "h3",
      title: "5.4m 높은 층고",
      description: "대형 장비 설치는 물론 복층 공간 활용까지 가능한 여유로운 높이",
      icon: "ArrowUpToLine"
    },
    {
      id: "h4",
      title: "8.9m 광폭 직선 램프",
      description: "대형 화물차도 멈춤 없이 쾌적하게 이동하는 직선형 광폭 설계",
      icon: "MoveRight"
    },
    {
      id: "h5",
      title: "서부산 의료원 호재",
      description: "단지 바로 앞 서부산 의료원(예정) 건립으로 주거 및 업무 환경 개선",
      icon: "Hospital"
    },
    {
      id: "h6",
      title: "1차 100% 완판 신화",
      description: "이미 검증된 서부산 지식산업센터 대표 브랜드의 압도적 신뢰도",
      icon: "Award"
    },
    {
      id: "h7",
      title: "파격적 금융 혜택",
      description: "중도금 무이자, 취득세/재산세 35% 경감으로 초기 부담 최소화",
      icon: "Coins"
    }
  ],
  
  // Gallery Section
  galleryTitle: "Architecture",
  gallerySubtitle: "제조업에 최적화된 스마트 비즈니스 플랫폼",
  galleryDescription: "단순한 건물을 넘어, 물류 효율과 직원의 복지까지 고려한 서부산의 새로운 랜드마크를 설계합니다.",
  galleryImages: [
    "https://picsum.photos/seed/penta-ext-1/800/450",
    "https://picsum.photos/seed/penta-ext-2/800/450"
  ],
  
  // Location Section
  locationTitle: "Location",
  locationSubtitle: "서부산 대개조의 중심, 변화의 핵심축",
  locationMaps: ["https://picsum.photos/seed/penta-map/1200/800"],
  locationMapUrl: "https://map.kakao.com/",
  locationButtonText: "입지 상세 보기",
  locationFeatures: [
    { id: "lf1", title: "교통의 중심", description: "사상-하단선 연장, 을숙도-장림고개 지하차도 등 광역 교통망의 요충지", icon: "MapPin" },
    { id: "lf2", title: "산업의 중심", description: "신평·장림 산업단지 대개조 사업의 직접적인 수혜를 입는 혁신 거점", icon: "Factory" },
    { id: "lf3", title: "미래의 중심", description: "에코델타시티, 명지국제신도시와 인접한 서부산 개발의 핵심 수혜지", icon: "TrendingUp" }
  ],
  
  // Floor Plans Section
  floorPlansTitle: "Floor Plans",
  floorPlansSubtitle: "성공 비즈니스를 위한 맞춤형 공간 설계",
  floorPlans: [
    {
      id: "type-m",
      type: "제조형 공장",
      images: ["https://picsum.photos/seed/penta-floor-1/800/600"],
      description: "드라이브인 및 도어투도어가 적용된 제조 특화 공간",
      details: [
        { label: "특징", value: "드라이브인 적용" },
        { label: "층고", value: "5.4m" },
        { label: "하중", value: "1.2ton/㎡" },
        { label: "권장업종", value: "제조, 물류" }
      ]
    },
    {
      id: "type-o",
      type: "섹션형 오피스",
      images: ["https://picsum.photos/seed/penta-floor-2/800/600"],
      description: "소규모 스타트업부터 대형 사무실까지 가변형 벽체 활용",
      details: [
        { label: "특징", value: "테라스 제공" },
        { label: "층고", value: "4.2m" },
        { label: "조망", value: "탁 트인 시티뷰" },
        { label: "권장업종", value: "IT, 디자인, 서비스" }
      ]
    }
  ],
  
  // Notices Section
  noticesTitle: "News",
  noticesSubtitle: "펜타플렉스 메트로 최신 소식",
  notices: [
    {
      id: "n1",
      title: "서부산 의료원 기재부 심의 최종 통과!",
      content: "단지 바로 앞 서부산 의료원 건립이 확정되어 입지 가치가 더욱 상승하고 있습니다.",
      date: "2026-04-01"
    },
    {
      id: "n2",
      title: "로얄호실 선착순 상담 진행 중",
      content: "초역세권 로얄호실은 조기 마감이 예상되오니 빠른 문의 바랍니다.",
      date: "2026-03-25"
    }
  ],
  
  // Inquiry Section
  inquiryTitle: "Consultation",
  inquirySubtitle: "지금 바로 상담 예약하세요",
  inquiryDescription: "로얄호실 확인 및 분양가 안내를 위해 전문 상담사가 연락드립니다.",
  inquiryButtonText: "상담 신청하고 자료 받기",
  
  // e-Model House
  eModelHouseUrl: "https://my.matterport.com/",
  
  // Footer Section
  footerCopyright: "© 2026 펜타플렉스 메트로. All rights reserved.",
  footerInfo: {
    developer: "JS KOREA",
    constructor: "동원건설(예정)",
    address: "부산광역시 사하구 신평동 546번지 일원",
    phone: "1588-0000"
  },
  
  // Quick Menu
  quickMenu: {
    kakaoUrl: "https://pf.kakao.com/",
    phone: "1588-0000",
    facebookUrl: "https://www.facebook.com/"
  },
  
  // Floating Banner
  floatingBanner: {
    line1: "동매역 0m 초역세권!",
    line2: "1차 100% 완판 신화",
    phone: "1588-0000",
    show: true
  },
  
  // Theme
  themeColor: "#E85D04", // 펜타플렉스 메트로의 오렌지 포인트 컬러 반영
  fontFamily: "Pretendard, 'Noto Sans KR', sans-serif"
};
