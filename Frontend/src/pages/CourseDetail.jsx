import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, Users, Clock, Star, BookOpen, Layers, CheckCircle2, 
  MoreVertical, Plus, Play, Info, UserX, Mail, Zap, Calendar, Tag
} from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const TEAL = '#1a6374';
const TEAL_LIGHT = '#e8f4f7';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/courses/${id}`);
      setCourse(response.data);
    } catch (err) {
      console.error('Error fetching course:', err);
      toast.error('Không thể tải thông tin khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (userId) => {
    if (!window.confirm('Xác nhận bỏ ghi danh học viên này khỏi khóa học?')) return;
    const loadToast = toast.loading('Đang xử lý...');
    try {
      await api.post('/api/unenroll', { userId, courseId: id });
      toast.success('Đã bỏ ghi danh học viên', { id: loadToast });
      fetchCourse(); // Refresh list
    } catch (err) {
      toast.error('Thao tác thất bại', { id: loadToast });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: TEAL, borderTopColor: 'transparent' }} />
    </div>
  );

  if (!course) return (
    <div className="text-center p-20 text-slate-500 font-bold italic tracking-widest">
      Entry not found.
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-20 px-4">
      {/* Back Button */}
      <Link to="/courses" className="group flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-all w-fit">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Management
      </Link>

      {/* Course Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-2 lg:px-0">
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase"
                style={{ background: TEAL_LIGHT, color: TEAL }}
              >
                {course.code || 'PUBLISHED'}
              </span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-bold">4.9 (128 reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight" style={{ color: '#1a3d47' }}>
              {course.title}
            </h1>
            <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed max-w-2xl">
              Hệ thống hóa các khối kiến thức cơ bản để tiến tới làm chủ chuyên môn. Lộ trình học tập chuyên nghiệp được thiết kế bám sát thực tế.
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: TEAL_LIGHT, color: TEAL }}>
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learners</p>
                <p className="text-lg font-black" style={{ color: '#1a3d47' }}>{course.users?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: '#fff9e6', color: '#d97706' }}>
                <Layers size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modules</p>
                <p className="text-lg font-black" style={{ color: '#1a3d47' }}>12</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                <p className="text-lg font-black" style={{ color: '#1a3d47' }}>18h 45m</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <button className="w-full sm:px-10 py-5 text-white rounded-full font-black shadow-xl flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-95"
              style={{ background: TEAL }}
            >
              <Play size={20} fill="currentColor" />
              Continue Learning
            </button>
            <button className="w-full sm:px-10 py-5 bg-white rounded-full font-black shadow-lg clay-card hover:bg-slate-50 transition-all border border-slate-100 flex items-center justify-center"
              style={{ color: '#1a3d47' }}
            >
              Edit Curriculum
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="aspect-video w-full rounded-[3rem] bg-slate-100 clay-card overflow-hidden relative group shadow-2xl">
            <img 
              src={`https://picsum.photos/seed/${course.id}/600/340`} 
              alt={course.title} 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                <Play size={40} fill="white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10">
        
        {/* Left: Active Roster */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black" style={{ color: '#1a3d47' }}>Active Roster</h3>
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase italic"
              style={{ background: TEAL_LIGHT, color: TEAL }}
            >
              LIVE: {course.users?.length || 0}
            </span>
          </div>

          <div className="space-y-4">
            {course.users && course.users.length > 0 ? (
              course.users.map((user, idx) => (
                <div key={user.id} className="bg-white rounded-3xl p-6 clay-card flex items-center justify-between group hover:bg-slate-50/50 transition-all border border-slate-100/50">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border-2 border-white overflow-hidden transition-transform group-hover:scale-110"
                      style={{ background: `hsl(${180 + idx * 25}, 45%, 90%)`, color: TEAL }}
                    >
                      <img src={`https://picsum.photos/seed/${user.name}/100/100`} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg group-hover:text-teal-600 transition-colors" style={{ color: '#1a3d47' }}>{user.name}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleUnenroll(user.id)}
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-300 hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 active:scale-95 shadow-sm"
                    title="Remove from Class"
                  >
                    <UserX className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-24 text-center bg-slate-50/30 rounded-[3rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <BookOpen className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Empty Classroom</h3>
                <p className="text-slate-400 italic max-w-xs mx-auto text-sm">Chưa có học viên nào ghi danh vào module này. Hãy thêm học viên để bắt đầu lộ trình đào tạo.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Instructor & Course Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 clay-card space-y-6 border border-slate-100">
            <h3 className="text-xl font-black" style={{ color: '#1a3d47' }}>Instructor</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 clay-recessed overflow-hidden border border-slate-200">
                <img src="https://picsum.photos/seed/instructor/200/200" alt="Instructor" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h4 className="font-black" style={{ color: '#1a3d47' }}>Alex Rivera</h4>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Senior Product Designer</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Alex Rivera có hơn 10 năm kinh nghiệm trong lĩnh vực thiết kế sản phẩm, từng làm việc tại các tập đoàn công nghệ hàng đầu.
            </p>
            <button className="w-full py-4 bg-slate-50 text-slate-700 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-sm hover:bg-white transition-all border border-slate-200">
              View Profile
            </button>
          </div>

          <div className="bg-[#1a3d47] text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-teal-300" />
                 </div>
                 <h4 className="font-black text-xs uppercase tracking-widest">Quick Specs</h4>
              </div>
              <div className="space-y-4">
                <SpecItem label="Level" value="Professional 400" icon={Tag} />
                <SpecItem label="Credits" value="5.0 Units" icon={Zap} />
                <SpecItem label="Access" value="Full Lifetime" icon={Calendar} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpecItem = ({ label, value, icon: Icon }) => (
  <div className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
     <div className="flex items-center gap-2">
        <Icon size={14} className="text-teal-400" />
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{label}</span>
     </div>
     <span className="text-sm font-black text-white">{value}</span>
  </div>
)

export default CourseDetail;
