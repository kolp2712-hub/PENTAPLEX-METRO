export interface SiteData {
  // SEO & Meta
  seoTitle: string;
  seoDescription: string;
  
  // Header
  title: string;
  logoIcon: string; // lucide icon name
  representativePhone: string; // Global phone number
  
  // Hero Section
  heroSlogan: string;
  heroDescription: string;
  heroButtonText: string;
  heroImages: string[]; // base64 array
  
  // Highlights Section
  highlightsTitle: string;
  highlightsSubtitle: string;
  highlights: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  
  // Gallery Section
  galleryTitle: string;
  gallerySubtitle: string;
  galleryDescription: string;
  galleryImages: string[]; // base64 array
  
  // Location Section
  locationTitle: string;
  locationSubtitle: string;
  locationMaps: string[]; // base64 array
  locationMapUrl: string; // external map link
  locationButtonText: string;
  locationFeatures: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  
  // Floor Plans Section
  floorPlansTitle: string;
  floorPlansSubtitle: string;
  floorPlans: {
    id: string;
    type: string;
    images: string[]; // base64 array
    description: string;
    details: { label: string; value: string }[];
  }[];
  
  // Notices Section
  noticesTitle: string;
  noticesSubtitle: string;
  notices: {
    id: string;
    title: string;
    content: string;
    date: string;
  }[];
  
  // Inquiry Section
  inquiryTitle: string;
  inquirySubtitle: string;
  inquiryDescription: string;
  inquiryButtonText: string;
  
  // e-Model House
  eModelHouseUrl: string;
  
  // Footer Section
  footerCopyright: string;
  footerInfo: {
    developer: string;
    constructor: string;
    address: string;
    phone: string;
  };

  // Quick Menu
  quickMenu: {
    kakaoUrl: string;
    phone: string;
    facebookUrl: string;
  };

  // Floating Banner
  floatingBanner: {
    line1: string;
    line2: string;
    phone: string;
    show: boolean;
  };
  
  // Theme
  themeColor: string;
  fontFamily: string;
}
