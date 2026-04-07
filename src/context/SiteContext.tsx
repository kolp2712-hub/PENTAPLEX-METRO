import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData } from '../types';
import { INITIAL_SITE_DATA } from '../constants';
import imageCompression from 'browser-image-compression';
import { db, auth } from '../firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDocFromServer,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We don't necessarily want to crash the whole app for the user, 
  // but we should log it for debugging.
}

interface SiteContextType {
  data: SiteData;
  user: User | null;
  isAuthReady: boolean;
  isDataLoaded: boolean;
  updateData: (newData: Partial<SiteData>) => void;
  saveToFirestore: () => Promise<void>;
  addNotice: (notice: { title: string; content: string }) => void;
  deleteNotice: (id: string) => void;
  updateNotice: (id: string, notice: { title: string; content: string }) => void;
  compressAndSetImage: (file: File, callback: (base64: string) => void) => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Enable offline persistence if possible
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence');
    }
  });
} catch (e) {
  // Ignore
}

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(INITIAL_SITE_DATA);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Firestore Connection Test & Initial Load
  useEffect(() => {
    async function testConnection() {
      try {
        const docRef = doc(db, 'site', 'data');
        await getDocFromServer(docRef);
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    }
    testConnection();
  }, []);

  // 3. Real-time Firestore Listener (Split Data)
  useEffect(() => {
    const collections = [
      'metadata', 'hero', 'highlights', 'gallery', 
      'location', 'floorplans', 'notices', 'footer', 'e_model', 'floating_banner'
    ];
    
    const unsubscribes = collections.map(col => {
      const docRef = doc(db, 'site_content', col);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const partData = docSnap.data();
          setData(prev => {
            const newData = { ...prev, ...partData };
            
            // Data Migration / Merging for specific fields
            if (col === 'floorplans' && partData.floorPlans) {
              newData.floorPlans = partData.floorPlans.map((plan: any) => {
                if (!plan.images && plan.image) return { ...plan, images: [plan.image] };
                if (!plan.images) return { ...plan, images: [] };
                return plan;
              });
            }
            
            return newData;
          });
        }
        // Mark as loaded once we get the first response (even if empty)
        setIsDataLoaded(true);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `site_content/${col}`);
        // Also mark as loaded on error to prevent infinite loading
        setIsDataLoaded(true);
      });
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, []);

  // 4. SEO Updates
  useEffect(() => {
    const title = data.seoTitle || INITIAL_SITE_DATA.seoTitle;
    const desc = data.seoDescription || INITIAL_SITE_DATA.seoDescription;
    const image = data.heroImages?.[0] || "https://picsum.photos/seed/vista-hero/1200/630";
    const url = window.location.href;

    document.title = title;

    const updateMeta = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attr, value);
      } else {
        element = document.createElement('meta');
        if (selector.startsWith('meta[name')) {
          (element as HTMLMetaElement).name = selector.split('"')[1];
        } else {
          (element as HTMLMetaElement).setAttribute('property', selector.split('"')[1]);
        }
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
    };

    updateMeta('meta[name="description"]', 'content', desc);
    
    // OG Tags
    updateMeta('meta[property="og:title"]', 'content', title);
    updateMeta('meta[property="og:description"]', 'content', desc);
    updateMeta('meta[property="og:image"]', 'content', image);
    updateMeta('meta[property="og:url"]', 'content', url);

    // Twitter Tags
    updateMeta('meta[property="twitter:title"]', 'content', title);
    updateMeta('meta[property="twitter:description"]', 'content', desc);
    updateMeta('meta[property="twitter:image"]', 'content', image);
  }, [data.seoTitle, data.seoDescription, data.heroImages]);

  const updateData = (newData: Partial<SiteData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const saveToFirestore = async () => {
    if (!user) {
      console.warn('User not authenticated. Cannot save to Firestore.');
      return;
    }
    
    // Split data into parts
    const parts = {
      metadata: {
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        themeColor: data.themeColor,
        fontFamily: data.fontFamily,
        title: data.title,
        logoIcon: data.logoIcon,
        representativePhone: data.representativePhone
      },
      hero: {
        heroSlogan: data.heroSlogan,
        heroDescription: data.heroDescription,
        heroButtonText: data.heroButtonText,
        heroImages: data.heroImages
      },
      highlights: {
        highlightsTitle: data.highlightsTitle,
        highlightsSubtitle: data.highlightsSubtitle,
        highlights: data.highlights
      },
      gallery: {
        galleryTitle: data.galleryTitle,
        gallerySubtitle: data.gallerySubtitle,
        galleryDescription: data.galleryDescription,
        galleryImages: data.galleryImages
      },
      location: {
        locationTitle: data.locationTitle,
        locationSubtitle: data.locationSubtitle,
        locationMaps: data.locationMaps,
        locationMapUrl: data.locationMapUrl,
        locationButtonText: data.locationButtonText,
        locationFeatures: data.locationFeatures
      },
      floorplans: {
        floorPlansTitle: data.floorPlansTitle,
        floorPlansSubtitle: data.floorPlansSubtitle,
        floorPlans: data.floorPlans
      },
      notices: {
        noticesTitle: data.noticesTitle,
        noticesSubtitle: data.noticesSubtitle,
        notices: data.notices
      },
      e_model: {
        eModelHouseUrl: data.eModelHouseUrl
      },
      footer: {
        footerCopyright: data.footerCopyright,
        footerInfo: data.footerInfo,
        quickMenu: data.quickMenu
      },
      floating_banner: {
        floatingBanner: data.floatingBanner
      }
    };

    try {
      const promises = Object.entries(parts).map(([key, value]) => {
        const docRef = doc(db, 'site_content', key);
        return setDoc(docRef, value);
      });
      await Promise.all(promises);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site_content');
      throw error;
    }
  };

  const addNotice = (notice: { title: string; content: string }) => {
    const newNotice = {
      id: Date.now().toString(),
      title: notice.title,
      content: notice.content,
      date: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      notices: [newNotice, ...prev.notices]
    }));
  };

  const deleteNotice = (id: string) => {
    setData(prev => ({
      ...prev,
      notices: prev.notices.filter(n => n.id !== id)
    }));
  };

  const updateNotice = (id: string, notice: { title: string; content: string }) => {
    setData(prev => ({
      ...prev,
      notices: prev.notices.map(n => n.id === id ? { ...n, ...notice } : n)
    }));
  };

  const compressAndSetImage = async (file: File, callback: (base64: string) => void) => {
    const options = {
      maxSizeMB: 0.2, // 200KB로 품질 상향 (데이터 분산 저장 덕분에 여유가 생김)
      maxWidthOrHeight: 1920, // 해상도 상향
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        callback(base64data);
      };
    } catch (error) {
      console.error('Image compression failed:', error);
      alert('이미지 압축 및 첨부에 실패했습니다.');
    }
  };

  return (
    <SiteContext.Provider value={{ 
      data, 
      user, 
      isAuthReady, 
      isDataLoaded,
      updateData, 
      saveToFirestore, 
      addNotice, 
      deleteNotice, 
      updateNotice, 
      compressAndSetImage 
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};
