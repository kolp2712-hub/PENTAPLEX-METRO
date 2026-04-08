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
  resetToDefaults: () => void;
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

  // 2. Initial Load Fallback & Connection Test
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'site_content', 'config'));
        console.log('Firestore connection test successful');
      } catch (error: any) {
        if (error.message?.includes('offline')) {
          console.error('Firestore is offline. Check network or config.');
        }
      }
    };
    
    if (isAuthReady) {
      testConnection();
    }

    const timer = setTimeout(() => {
      setIsDataLoaded(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isAuthReady]);

  // 3. Real-time Firestore Listener (Optimized)
  useEffect(() => {
    if (!isAuthReady) return; // Wait for auth to be ready

    const collections = ['config', 'assets_hero', 'assets_gallery', 'assets_location', 'assets_floorplans', 'notices'];
    
    const unsubscribes = collections.map(col => {
      const docRef = doc(db, 'site_content', col);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const partData = docSnap.data();
          setData(prev => {
            const newData = { ...prev, ...partData };
            
            // Data Migration / Merging for specific fields
            if (partData.floorPlans) {
              newData.floorPlans = partData.floorPlans.map((plan: any) => {
                if (!plan.images && plan.image) return { ...plan, images: [plan.image] };
                if (!plan.images) return { ...plan, images: [] };
                return plan;
              });
            }
            
            return newData;
          });
        }
        setIsDataLoaded(true);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `site_content/${col}`);
        setIsDataLoaded(true);
      });
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [isAuthReady]);

  // 4. SEO Updates
  useEffect(() => {
    if (!data) return;
    const title = data.seoTitle || INITIAL_SITE_DATA.seoTitle || "펜타플렉스 메트로";
    const desc = data.seoDescription || INITIAL_SITE_DATA.seoDescription || "";
    const image = data.heroImages?.[0] || "https://picsum.photos/seed/penta-hero/1200/630";
    const url = typeof window !== 'undefined' ? window.location.href : "";

    document.title = title;

    const updateMeta = (selector: string, attr: string, value: string) => {
      if (!value) return;
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attr, value);
      } else {
        element = document.createElement('meta');
        if (selector.startsWith('meta[name')) {
          const nameMatch = selector.match(/"([^"]+)"/);
          if (nameMatch) (element as HTMLMetaElement).name = nameMatch[1];
        } else {
          const propMatch = selector.match(/"([^"]+)"/);
          if (propMatch) (element as HTMLMetaElement).setAttribute('property', propMatch[1]);
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

  const resetToDefaults = () => {
    if (window.confirm('모든 데이터를 초기값(펜타플렉스 메트로)으로 되돌리시겠습니까? 현재 저장된 모든 내용은 사라집니다.')) {
      setData(INITIAL_SITE_DATA);
    }
  };

  const saveToFirestore = async () => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    if (user.email !== 'kolp2712@gmail.com') {
      throw new Error(`관리자 권한이 없습니다. (현재 계정: ${user.email})`);
    }
    
    // Optimized Split: Config (Text), Assets (Images), Notices
    const parts: Record<string, any> = {
      config: {
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        themeColor: data.themeColor,
        fontFamily: data.fontFamily,
        title: data.title,
        logoIcon: data.logoIcon,
        representativePhone: data.representativePhone,
        heroSlogan: data.heroSlogan,
        heroDescription: data.heroDescription,
        heroButtonText: data.heroButtonText,
        highlightsTitle: data.highlightsTitle,
        highlightsSubtitle: data.highlightsSubtitle,
        highlights: data.highlights,
        galleryTitle: data.galleryTitle,
        gallerySubtitle: data.gallerySubtitle,
        galleryDescription: data.galleryDescription,
        locationTitle: data.locationTitle,
        locationSubtitle: data.locationSubtitle,
        locationMapUrl: data.locationMapUrl,
        locationButtonText: data.locationButtonText,
        locationFeatures: data.locationFeatures,
        floorPlansTitle: data.floorPlansTitle,
        floorPlansSubtitle: data.floorPlansSubtitle,
        eModelHouseUrl: data.eModelHouseUrl,
        footerCopyright: data.footerCopyright,
        footerInfo: data.footerInfo,
        quickMenu: data.quickMenu,
        floatingBanner: data.floatingBanner
      },
      assets_hero: { heroImages: data.heroImages },
      assets_gallery: { galleryImages: data.galleryImages },
      assets_location: { locationMaps: data.locationMaps },
      assets_floorplans: { floorPlans: data.floorPlans },
      notices: {
        noticesTitle: data.noticesTitle,
        noticesSubtitle: data.noticesSubtitle,
        notices: data.notices
      }
    };

    try {
      let totalSize = 0;
      for (const [key, value] of Object.entries(parts)) {
        const size = JSON.stringify(value).length;
        totalSize += size;
        if (size > 1000000) { // 1MB limit
          throw new Error(`'${key}' 데이터가 너무 큽니다(${(size / 1024).toFixed(0)}KB). 이미지를 줄여주세요.`);
        }
      }
      console.log(`Total save size: ${(totalSize / 1024).toFixed(1)}KB`);

      // Timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('저장 시간이 초과되었습니다. 네트워크가 불안정하거나 데이터가 너무 큽니다.')), 30000)
      );

      const writePromises = Object.entries(parts).map(([key, value]) => {
        const docRef = doc(db, 'site_content', key);
        return setDoc(docRef, value);
      });
      
      await Promise.race([Promise.all(writePromises), timeoutPromise]);
    } catch (error: any) {
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
      maxSizeMB: 0.08, // 80KB로 다시 하향 (안정성 확보)
      maxWidthOrHeight: 1280, // 해상도 하향
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
      resetToDefaults,
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
