import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  Trash2, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  MessageSquare,
  Calendar,
  Filter
} from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  type: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

export const InquiryManager = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];
      setInquiries(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching inquiries:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!window.confirm('정말 이 문의 내역을 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => 
    filter === 'all' ? true : inquiry.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
          <Filter className="w-4 h-4" /> 필터:
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'contacted', 'closed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {f === 'all' && '전체'}
              {f === 'new' && '신규'}
              {f === 'contacted' && '연락완료'}
              {f === 'closed' && '종료'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">문의 내역이 없습니다.</p>
          </div>
        ) : (
          filteredInquiries.map((inquiry) => (
            <div 
              key={inquiry.id} 
              className={`bg-white rounded-3xl p-6 border transition-all shadow-sm hover:shadow-md ${
                inquiry.status === 'new' ? 'border-blue-100 bg-blue-50/10' : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      inquiry.status === 'new' ? 'bg-blue-500 text-white' :
                      inquiry.status === 'contacted' ? 'bg-green-500 text-white' :
                      'bg-gray-400 text-white'
                    }`}>
                      {inquiry.status === 'new' && 'NEW'}
                      {inquiry.status === 'contacted' && 'CONTACTED'}
                      {inquiry.status === 'closed' && 'CLOSED'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(inquiry.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">성함</p>
                        <p className="font-bold text-gray-900">{inquiry.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">연락처</p>
                        <a href={`tel:${inquiry.phone}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                          {inquiry.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                        <Filter className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">관심 타입</p>
                        <p className="font-bold text-gray-900">{inquiry.type}</p>
                      </div>
                    </div>
                  </div>

                  {inquiry.message && (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">문의 내용</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 justify-end">
                  <button
                    onClick={() => updateStatus(inquiry.id, 'contacted')}
                    className={`flex-1 md:flex-none p-3 rounded-xl border transition-all flex items-center justify-center gap-2 text-xs font-bold ${
                      inquiry.status === 'contacted' 
                        ? 'bg-green-50 border-green-200 text-green-600' 
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                    title="연락 완료 처리"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="md:hidden lg:inline">연락 완료</span>
                  </button>
                  <button
                    onClick={() => updateStatus(inquiry.id, 'closed')}
                    className={`flex-1 md:flex-none p-3 rounded-xl border transition-all flex items-center justify-center gap-2 text-xs font-bold ${
                      inquiry.status === 'closed' 
                        ? 'bg-gray-100 border-gray-200 text-gray-600' 
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                    title="상담 종료 처리"
                  >
                    <Clock className="w-4 h-4" />
                    <span className="md:hidden lg:inline">상담 종료</span>
                  </button>
                  <button
                    onClick={() => deleteInquiry(inquiry.id)}
                    className="flex-1 md:flex-none p-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="md:hidden lg:inline">삭제</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
