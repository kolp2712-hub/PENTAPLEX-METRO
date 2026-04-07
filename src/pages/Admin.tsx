import React, { useState, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { 
  Settings, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Palette,
  Type,
  Upload,
  Globe,
  PlusCircle,
  MessageSquare,
  PhoneCall,
  Share,
  LogIn
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageManager } from '../components/admin/ImageManager';
import { InquiryManager } from '../components/admin/InquiryManager';

const Admin = () => {
  const { data, user, isAuthReady, updateData, resetToDefaults, saveToFirestore, addNotice, deleteNotice, updateNotice, compressAndSetImage } = useSite();
  const [activeTab, setActiveTab] = useState<'content' | 'images' | 'notices' | 'seo' | 'quickmenu' | 'export' | 'inquiries'>('content');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [copied, setCopied] = useState(false);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const ADMIN_EMAIL = 'kolp2712@gmail.com';
  const isAuthorized = user?.email === ADMIN_EMAIL && user?.emailVerified;

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // 사용자 친절한 오류 메시지 처리
      if (error.code === 'auth/popup-blocked') {
        alert('브라우저의 팝업 차단 기능이 활성화되어 있습니다. 주소창 옆의 팝업 차단 해제 아이콘을 클릭하여 팝업을 허용해 주세요.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // 이미 로그인 팝업이 진행 중인 경우이므로 별도의 알림 없이 로그만 남깁니다.
      } else if (error.code === 'auth/user-cancelled') {
        // 사용자가 직접 창을 닫은 경우이므로 별도의 알림을 띄우지 않습니다.
      } else if (error.code === 'auth/network-request-failed') {
        alert('네트워크 연결이 불안정합니다. 인터넷 연결을 확인해 주세요.');
      } else {
        alert('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      await compressAndSetImage(file, callback);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });
    try {
      await saveToFirestore();
      setSaveStatus({ type: 'success', message: '✅ 서버 저장 완료!' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
    } catch (error: any) {
      setSaveStatus({ type: 'error', message: `❌ 저장 실패: ${error.message || '알 수 없는 오류'}` });
    } finally {
      setIsSaving(false);
    }
  };

  const addFloorPlan = () => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      type: "새로운 타입",
      images: ["https://picsum.photos/seed/new-plan/800/600"],
      description: "평면 설명을 입력하세요.",
      details: [
        { label: "전용면적", value: "00.00㎡" },
        { label: "공급면적", value: "00.00㎡" },
        { label: "계약면적", value: "00.00㎡" },
        { label: "세대수", value: "00세대" }
      ]
    };
    updateData({ floorPlans: [...data.floorPlans, newPlan] });
  };

  const removeFloorPlan = (id: string) => {
    updateData({ floorPlans: data.floorPlans.filter(p => p.id !== id) });
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
            <p className="text-gray-500 text-sm mt-2">
              {user ? '권한이 없는 계정입니다. 관리자 계정으로 로그인하세요.' : '구글 계정으로 로그인하여 관리자 모드에 접속하세요.'}
            </p>
            {user && (
              <div className="mt-2 p-2 bg-red-50 text-red-600 text-xs rounded-lg">
                현재 계정: {user.email}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              구글로 로그인하기
            </button>
            
            {user && (
              <button
                onClick={handleLogout}
                className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition-all"
              >
                다른 계정으로 로그인
              </button>
            )}

            <Link to="/" className="block text-center text-sm text-gray-400 hover:text-gray-600 pt-4">
              메인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Tab Selector */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-4 py-2 flex overflow-x-auto gap-2 no-scrollbar shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {[
          { id: 'content', icon: LayoutDashboard, label: '콘텐츠' },
          { id: 'inquiries', icon: MessageSquare, label: '상담문의' },
          { id: 'images', icon: ImageIcon, label: '이미지' },
          { id: 'quickmenu', icon: MessageSquare, label: '퀵메뉴' },
          { id: 'notices', icon: FileText, label: '게시글' },
          { id: 'seo', icon: Globe, label: 'SEO' },
          { id: 'export', icon: Share, label: '데이터' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              console.log('Switching to tab:', tab.id);
              setActiveTab(tab.id as any);
            }}
            className={`flex-1 min-w-[64px] flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all active:scale-95 ${
              activeTab === tab.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <Settings className="w-6 h-6 text-gray-900" />
          <span className="font-bold text-gray-900">관리자 패널</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
              activeTab === 'content' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            콘텐츠 관리
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
              activeTab === 'inquiries' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            상담문의 관리
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
              activeTab === 'images' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            이미지 관리
          </button>
          <button
            onClick={() => setActiveTab('quickmenu')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
              activeTab === 'quickmenu' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            빠른 메뉴 & 플로팅 바
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
              activeTab === 'notices' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            게시글 관리
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
              activeTab === 'seo' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            SEO 설정
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
              activeTab === 'export' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Share className="w-4 h-4" />
            시스템 및 데이터
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'content' && '콘텐츠 관리'}
              {activeTab === 'inquiries' && '상담문의 관리'}
              {activeTab === 'images' && '이미지 관리'}
              {activeTab === 'quickmenu' && '퀵메뉴 설정'}
              {activeTab === 'notices' && '게시글 관리'}
              {activeTab === 'seo' && 'SEO 설정'}
              {activeTab === 'export' && '시스템 및 데이터 관리'}
            </h2>
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
              사이트 보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" /> 기본 텍스트 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">사이트 제목</label>
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) => updateData({ title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">대표 전화번호 (전체 자동 연결)</label>
                    <input
                      type="text"
                      value={data.representativePhone}
                      onChange={(e) => updateData({ representativePhone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="1588-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">히어로 슬로건</label>
                    <input
                      type="text"
                      value={data.heroSlogan}
                      onChange={(e) => updateData({ heroSlogan: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">히어로 설명</label>
                  <textarea
                    value={data.heroDescription}
                    onChange={(e) => updateData({ heroDescription: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">히어로 버튼 문구</label>
                    <input
                      type="text"
                      value={data.heroButtonText}
                      onChange={(e) => updateData({ heroButtonText: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">입지 버튼 문구</label>
                    <input
                      type="text"
                      value={data.locationButtonText}
                      onChange={(e) => updateData({ locationButtonText: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">지도 연결 URL (카카오/네이버)</label>
                    <input
                      type="text"
                      value={data.locationMapUrl}
                      onChange={(e) => updateData({ locationMapUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="https://map.kakao.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">e-모델하우스 URL</label>
                    <input
                      type="text"
                      value={data.eModelHouseUrl}
                      onChange={(e) => updateData({ eModelHouseUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="https://my.matterport.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Palette className="w-5 h-5" /> 테마 및 스타일
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">포인트 컬러</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={data.themeColor}
                        onChange={(e) => updateData({ themeColor: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-none"
                      />
                      <input
                        type="text"
                        value={data.themeColor}
                        onChange={(e) => updateData({ themeColor: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">폰트 패밀리</label>
                    <select
                      value={data.fontFamily}
                      onChange={(e) => updateData({ fontFamily: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="Pretendard, 'Noto Sans KR', sans-serif">Pretendard (권장)</option>
                      <option value="'Noto Sans KR', sans-serif">Noto Sans KR</option>
                      <option value="serif">Serif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold">푸터 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">시행사</label>
                    <input
                      type="text"
                      value={data.footerInfo.developer}
                      onChange={(e) => updateData({ footerInfo: { ...data.footerInfo, developer: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">시공사</label>
                    <input
                      type="text"
                      value={data.footerInfo.constructor}
                      onChange={(e) => updateData({ footerInfo: { ...data.footerInfo, constructor: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">현장 주소</label>
                    <input
                      type="text"
                      value={data.footerInfo.address}
                      onChange={(e) => updateData({ footerInfo: { ...data.footerInfo, address: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">분양 문의 번호 (대표번호와 연동)</label>
                    <input
                      type="text"
                      value={data.representativePhone}
                      onChange={(e) => updateData({ representativePhone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">카피라이트</label>
                  <input
                    type="text"
                    value={data.footerCopyright}
                    onChange={(e) => updateData({ footerCopyright: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <InquiryManager />
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-12">
                <h3 className="text-lg font-bold">섹션별 이미지 동적 관리</h3>
                
                <ImageManager 
                  label="메인 히어로 이미지 리스트" 
                  images={data.heroImages} 
                  onChange={(newImages) => updateData({ heroImages: newImages })} 
                />

                <ImageManager 
                  label="갤러리 이미지 리스트" 
                  images={data.galleryImages} 
                  onChange={(newImages) => updateData({ galleryImages: newImages })} 
                />

                <ImageManager 
                  label="입지 지도 이미지 리스트" 
                  images={data.locationMaps} 
                  onChange={(newImages) => updateData({ locationMaps: newImages })} 
                />
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">평면도 리스트 관리</h3>
                  <button 
                    onClick={addFloorPlan}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold"
                  >
                    <PlusCircle className="w-4 h-4" /> 타입 추가
                  </button>
                </div>
                
                <div className="space-y-8">
                  {data.floorPlans?.map((plan, index) => (
                    <div key={plan.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-900">타입 #{index + 1}</h4>
                        <button 
                          onClick={() => removeFloorPlan(plan.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        <ImageManager 
                          label={`${plan.type} 이미지 리스트`} 
                          images={plan.images} 
                          onChange={(newImages) => {
                            const newPlans = [...data.floorPlans];
                            newPlans[index].images = newImages;
                            updateData({ floorPlans: newPlans });
                          }} 
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">타입 이름</label>
                            <input
                              type="text"
                              value={plan.type}
                              onChange={(e) => {
                                const newPlans = [...data.floorPlans];
                                newPlans[index].type = e.target.value;
                                updateData({ floorPlans: newPlans });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">특징 설명</label>
                            <textarea
                              value={plan.description}
                              onChange={(e) => {
                                const newPlans = [...data.floorPlans];
                                newPlans[index].description = e.target.value;
                                updateData({ floorPlans: newPlans });
                              }}
                              rows={2}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">상세 정보 (면적, 세대수 등)</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {plan.details?.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={detail.label}
                                  onChange={(e) => {
                                    const newPlans = [...data.floorPlans];
                                    newPlans[index].details[detailIndex].label = e.target.value;
                                    updateData({ floorPlans: newPlans });
                                  }}
                                  className="flex-1 px-3 py-2 border rounded-lg text-xs"
                                  placeholder="항목"
                                />
                                <input
                                  type="text"
                                  value={detail.value}
                                  onChange={(e) => {
                                    const newPlans = [...data.floorPlans];
                                    newPlans[index].details[detailIndex].value = e.target.value;
                                    updateData({ floorPlans: newPlans });
                                  }}
                                  className="flex-1 px-3 py-2 border rounded-lg text-xs"
                                  placeholder="값"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quickmenu' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> 하단 퀵메뉴 (플로팅 버튼) 설정
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">카카오톡 상담 URL</label>
                    <input
                      type="text"
                      value={data.quickMenu.kakaoUrl}
                      onChange={(e) => updateData({ quickMenu: { ...data.quickMenu, kakaoUrl: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                      placeholder="https://pf.kakao.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">상담 전화번호 (대표번호와 연동)</label>
                    <input
                      type="text"
                      value={data.representativePhone}
                      onChange={(e) => updateData({ representativePhone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5" /> 우측 플로팅 바 설정 (보라색 바)
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.floatingBanner.show}
                      onChange={(e) => updateData({ floatingBanner: { ...data.floatingBanner, show: e.target.checked } })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">사용 여부</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">1열 문구 (흰색 글씨)</label>
                    <input
                      type="text"
                      value={data.floatingBanner.line1}
                      onChange={(e) => updateData({ floatingBanner: { ...data.floatingBanner, line1: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="예: 모델하우스 방문예약 접수중"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">2열 문구 (노란색 글씨)</label>
                    <input
                      type="text"
                      value={data.floatingBanner.line2}
                      onChange={(e) => updateData({ floatingBanner: { ...data.floatingBanner, line2: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="예: 입주시까지 0원 파격조건"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">3열 전화번호 (대표번호와 연동)</label>
                    <input
                      type="text"
                      value={data.representativePhone}
                      onChange={(e) => updateData({ representativePhone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="예: 1588-0000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">공지사항 목록</h3>
                  <button 
                    onClick={() => addNotice({ title: '새 공지사항', content: '내용을 입력하세요.' })}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> 새 글 작성
                  </button>
                </div>

                <div className="space-y-4">
                  {data.notices?.map((notice) => (
                    <div key={notice.id} className="p-6 rounded-2xl border border-gray-100 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-4">
                          <input
                            type="text"
                            value={notice.title}
                            onChange={(e) => updateNotice(notice.id, { title: e.target.value, content: notice.content })}
                            className="w-full text-lg font-bold border-none focus:ring-0 p-0"
                          />
                          <textarea
                            value={notice.content}
                            onChange={(e) => updateNotice(notice.id, { title: notice.title, content: e.target.value })}
                            className="w-full text-gray-500 border-none focus:ring-0 p-0 text-sm"
                            rows={2}
                          />
                        </div>
                        <button 
                          onClick={() => deleteNotice(notice.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-400">{notice.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5" /> 검색 엔진 최적화 (SEO)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">브라우저 탭 제목 (Title Tag)</label>
                    <input
                      type="text"
                      value={data.seoTitle}
                      onChange={(e) => updateData({ seoTitle: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">검색 결과 설명 (Meta Description)</label>
                    <textarea
                      value={data.seoDescription}
                      onChange={(e) => updateData({ seoDescription: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-red-100 space-y-6">
                <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" /> 데이터 초기화 (긴급 복구용)
                </h3>
                <p className="text-sm text-gray-600">
                  실제 사이트에서 옛날 내용이 계속 나올 때 사용하세요. 
                  이 버튼을 누르면 현재 화면의 내용을 코딩된 기본값(펜타플렉스 메트로)으로 강제 초기화합니다.
                </p>
                <button
                  onClick={() => {
                    resetToDefaults();
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  데이터베이스 초기값으로 리셋하기
                </button>
                <p className="text-xs text-red-400 font-medium">
                  * 리셋 후 반드시 하단의 [변경사항 저장 완료] 버튼을 눌러야 실제 사이트에 반영됩니다.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Share className="w-5 h-5" /> 수동 업데이트 데이터 추출
                  </h3>
                  <button
                    onClick={() => {
                      const code = `import { SiteData } from './types';\n\nexport const INITIAL_SITE_DATA: SiteData = ${JSON.stringify(data, null, 2)};`;
                      navigator.clipboard.writeText(code);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    {copied ? '복사 완료!' : '코드 복사하기'}
                  </button>
                </div>
                
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                  <h4 className="text-red-800 font-bold text-sm mb-2">⚠️ 필독: Cloudflare/GitHub 수동 업데이트 방법</h4>
                  <ol className="text-red-700 text-xs space-y-2 list-decimal ml-4">
                    <li>아래의 코드를 <strong>[코드 복사하기]</strong> 버튼으로 복사합니다.</li>
                    <li>내 컴퓨터의 프로젝트 폴더에서 <strong>src/constants.ts</strong> 파일을 엽니다.</li>
                    <li>파일의 전체 내용을 지우고 복사한 코드를 붙여넣습니다.</li>
                    <li>GitHub에 <strong>Commit & Push</strong> 합니다.</li>
                    <li>Cloudflare Pages가 자동으로 빌드하여 모든 방문자에게 변경사항이 적용됩니다.</li>
                  </ol>
                </div>

                <div className="relative">
                  <pre className="w-full h-[400px] overflow-auto bg-gray-900 text-gray-300 p-6 rounded-2xl text-[10px] font-mono leading-relaxed">
                    {`import { SiteData } from './types';\n\nexport const INITIAL_SITE_DATA: SiteData = ${JSON.stringify(data, null, 2)};`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-col items-end gap-4">
            {saveStatus.type && (
              <div className={`px-4 py-2 rounded-xl text-sm font-bold animate-bounce ${
                saveStatus.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {saveStatus.message}
              </div>
            )}
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-5 h-5" /> 
              {isSaving ? '저장 중...' : '변경사항 저장 완료'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
