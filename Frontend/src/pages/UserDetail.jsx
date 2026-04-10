import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, GraduationCap, XCircle, Plus, Mail, Shield, 
  Zap, BookMarked, Calendar, CheckCircle2 
} from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const TEAL = '#1a6374';
const TEAL_LIGHT = '#e8f4f7';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, coursesRes] = await Promise.all([
        api.get(`/api/users/${id}`),
        api.get('/api/courses')
      ]);
      setUser(userRes.data);
      setAllCourses(coursesRes.data);
    } catch (err) {
      console.error('Error fetching details:', err);
      toast.error('Lỗi khi tải thông tin chi tiết');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) return;
    const loadToast = toast.loading('Đang ghi danh...');
    try {
      await api.post('/api/enroll', { userId: id, courseId: selectedCourse });
      toast.success('Đã ghi danh thành công', { id: loadToast });
      fetchData(); // Refresh
      setSelectedCourse('');
    } catch (err) {
      toast.error('Ghi danh thất bại', { id: loadToast });
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm('Xác nhận bỏ ghi danh học viên này khỏi khóa học?')) return;
    const loadToast = toast.loading('Đang xử lý...');
    try {
      await api.post('/api/unenroll', { userId: id, courseId });
      toast.success('Đã bỏ ghi danh', { id: loadToast });
      fetchData(); // Refresh
    } catch (err) {
      toast.error('Thao tác thất bại', { id: loadToast });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: TEAL, borderTopColor: 'transparent' }} />
    </div>
  );

  if (!user) return <div className="text-center p-20 text-slate-500 font-bold">User Not Found</div>;

  const availableCourses = allCourses.filter(c => !user.courses.some(uc => uc.id === c.id));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-20 px-4">
      <Link to="/users" className="group flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-all w-fit px-2">
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        Back to Directory
      </Link>

      {/* Profile Header */}
      <div className="relative group px-2">
        <div className="absolute inset-0 bg-teal-600/5 blur-3xl rounded-full -z-10 group-hover:bg-teal-600/10 transition-colors" />
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="relative">
             <div className="w-40 h-40 rounded-[3rem] text-white text-6xl font-black shadow-2xl border-4 border-white ring-8 ring-teal-50 transition-transform hover:rotate-3 overflow-hidden" 
               style={{ background: `linear-gradient(135deg, ${TEAL}, #1a3d47)` }}
             >
               <img src={`https://picsum.photos/seed/${user.name}/200/200`} alt={user.name} className="w-full h-full object-cover mix-blend-overlay opacity-80" />
             </div>
             <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
             </div>
          </div>
          <div className="text-center lg:text-left space-y-4">
             <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2" style={{ color: '#1a3d47' }}>{user.name}</h1>
                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-4 text-base md:text-lg">
                   <div className="flex items-center gap-2 text-slate-400 font-medium">
                      <Mail className="w-5 h-5" />
                      {user.email}
                   </div>
                   <span className="hidden lg:block w-1.5 h-1.5 bg-slate-200 rounded-full" />
                   <div className="flex items-center gap-2 font-bold" style={{ color: TEAL }}>
                      <Shield className="w-5 h-5" />
                      Verified Learner
                   </div>
                </div>
             </div>
             <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="px-5 py-2.5 bg-[#1a3d47] text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                   <Zap className="w-3.5 h-3.5 text-amber-300" /> Member since 2024
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
        {/* Left Column: Enrollment Form */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-10 bg-white/80 backdrop-blur-sm rounded-[2.5rem] border border-slate-200/50 shadow-sm sticky top-28 clay-card">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-teal-50 rounded-2xl text-teal-600 shadow-inner">
                    <BookMarked className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-black" style={{ color: '#1a3d47' }}>Enrollment</h2>
              </div>
              
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">Ghi danh học viên này vào một module mới trong lộ trình đào tạo hiện có.</p>
              
              <div className="space-y-6">
                <div className="space-y-2.5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Select Module</label>
                   <select 
                     value={selectedCourse}
                     onChange={(e) => setSelectedCourse(e.target.value)}
                     className="w-full bg-slate-50/50 border-none rounded-2xl px-6 py-4.5 text-slate-700 font-bold focus:bg-white focus:ring-4 focus:ring-teal-500/5 outline-none transition-all appearance-none shadow-inner"
                   >
                     <option value="">Choose a course...</option>
                     {availableCourses.map(c => (
                       <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                     ))}
                   </select>
                </div>
                
                <button 
                  onClick={handleEnroll}
                  disabled={!selectedCourse}
                  className="w-full py-5 text-white rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 hover:brightness-110"
                  style={{ background: '#161c20' }}
                >
                  <Plus className="w-5 h-5" /> Proccess Enrollment
                </button>
              </div>
           </div>
        </div>

        {/* Right Column: Active Transcript */}
        <div className="lg:col-span-2 space-y-6">
           <div className="p-10 bg-white shadow-sm border border-slate-100/50 overflow-hidden" style={{ borderRadius: '2.5rem' }}>
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner">
                       <GraduationCap className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black" style={{ color: '#1a3d47' }}>Active Transcript</h2>
                 </div>
                 <span className="px-5 py-2 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100 rounded-full italic">
                   {user.courses?.length || 0} Modules Total
                 </span>
              </div>

              <div className="space-y-5">
                 {user.courses && user.courses.length > 0 ? (
                   user.courses.map(course => (
                     <div key={course.id} className="group flex items-center justify-between p-7 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/30 transition-all hover:bg-white hover:shadow-xl hover:shadow-teal-500/5 hover:translate-x-1">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                              <BookOpen className="w-7 h-7" style={{ color: TEAL }} />
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: TEAL }}>{course.code}</span>
                                 <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                 <span className="text-[10px] font-black text-slate-300">ID: #{course.id}</span>
                              </div>
                              <p className="text-xl font-black group-hover:text-teal-600 transition-colors leading-tight" style={{ color: '#1a3d47' }}>{course.title}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleUnenroll(course.id)}
                          className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 active:scale-95 shadow-sm"
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                     </div>
                   ))
                 ) : (
                   <div className="py-24 text-center bg-slate-50/20 rounded-[3rem] border-2 border-dashed border-slate-100">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                         <Calendar className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold italic tracking-wide">Learner is not currently enrolled in any modules.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
