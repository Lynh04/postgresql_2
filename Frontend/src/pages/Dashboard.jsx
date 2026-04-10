import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, GitBranch, Zap, TrendingUp, CheckCircle,
  BarChart3, CloudUpload, Mail, ArrowRight, Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const TEAL = '#1a6374';
const TEAL_LIGHT = '#e8f4f7';

const StatCard = ({ label, value, icon: Icon, subtext, subIcon: SubIcon, loading }) => (
  <div className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div className="w-11 h-11 rounded-full flex items-center justify-center mb-5" style={{ background: TEAL_LIGHT }}>
      <Icon className="w-5 h-5" style={{ color: TEAL }} />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: '#8aabb5' }}>{label}</p>
    {loading ? (
      <div className="h-9 w-20 bg-slate-100 rounded-xl animate-pulse mt-1" />
    ) : (
      <h3 className="text-4xl font-black tracking-tight" style={{ color: '#1a3d47' }}>{value}</h3>
    )}
    {subtext && (
      <div className="flex items-center gap-1.5 mt-3" style={{ color: '#5a8a96' }}>
        {SubIcon && <SubIcon className="w-3.5 h-3.5" />}
        <span className="text-xs font-bold">{subtext}</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/stats');
        setStats(res.data);
      } catch {
        setError('Không thể tải dữ liệu thống kê.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Learners',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      subtext: 'Học viên trong hệ thống',
      subIcon: TrendingUp,
    },
    {
      label: 'Courses',
      value: stats?.totalCourses ?? 0,
      icon: BookOpen,
      subtext: 'Khóa học đang hoạt động',
      subIcon: CheckCircle,
    },
    {
      label: 'Enrollments',
      value: stats?.totalEnrollments ?? 0,
      icon: GitBranch,
      subtext: 'Tổng lượt ghi danh',
      subIcon: BarChart3,
    },
    {
      label: 'Active',
      value: 'Online',
      icon: Zap,
      subtext: 'Hệ thống đang hoạt động',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-center text-sm">
          {error}
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-10"
        style={{ background: 'linear-gradient(135deg, #d0e9ef 0%, #e8f4f7 60%, #f0f7fa 100%)' }}
      >
        <div className="z-10 flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4" style={{ color: '#1a3d47' }}>
            Chào mừng đến với <br />
            <span style={{ color: TEAL }}>Lynh Academy</span>
          </h2>
          <p className="text-base md:text-lg font-medium max-w-lg leading-relaxed mx-auto md:mx-0" style={{ color: '#4a7a88' }}>
            Theo dõi tiến độ học tập của các học viên và quản lý tài nguyên học tập của bạn một cách dễ dàng nhất.
          </p>
          <div className="mt-8 flex justify-center md:justify-start gap-4 flex-wrap">
            <Link
              to="/users"
              className="px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
              style={{ background: TEAL }}
            >
              Xem báo cáo
            </Link>
            <Link
              to="/courses"
              className="px-8 py-4 rounded-full font-bold bg-white shadow-md transition-all hover:shadow-lg active:scale-95"
              style={{ color: TEAL }}
            >
              Tài liệu HD
            </Link>
          </div>
        </div>
        <div className="hidden lg:block relative w-64 h-64 shrink-0">
          <div className="absolute inset-0 rounded-[4rem] rotate-12 blur-2xl opacity-30" style={{ background: TEAL }} />
          <img
            src="https://picsum.photos/seed/academy/400/400"
            alt="Learning environment"
            className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-10 rotate-3"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} loading={loading} />
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

        {/* Recent Students Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-bold" style={{ color: '#1a3d47' }}>Recent Students</h4>
            <Link
              to="/users"
              className="text-sm font-bold hover:underline transition-all"
              style={{ color: TEAL }}
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.15em] border-b"
                  style={{ color: '#8aabb5', borderColor: '#e8f0f5' }}
                >
                  <th className="pb-4 font-black">Student</th>
                  <th className="pb-4 font-black">Email</th>
                  <th className="pb-4 font-black">Ngày tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#f0f7fa' }}>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
                          <div className="h-4 w-28 bg-slate-100 rounded-lg animate-pulse" />
                        </div>
                      </td>
                      <td className="py-5"><div className="h-3 w-36 bg-slate-100 rounded-lg animate-pulse" /></td>
                      <td className="py-5"><div className="h-3 w-20 bg-slate-100 rounded-lg animate-pulse" /></td>
                    </tr>
                  ))
                ) : stats?.recentUsers?.length > 0 ? (
                  stats.recentUsers.map((user, idx) => (
                    <tr key={user.id} className="group transition-colors hover:bg-slate-50/60">
                      <td className="py-5">
                        <Link to={`/users/${user.id}`} className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm"
                            style={{
                              background: `hsl(${180 + idx * 30}, 40%, 88%)`,
                              color: TEAL,
                            }}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-bold text-sm" style={{ color: '#1a3d47' }}>{user.name}</span>
                        </Link>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#5a8a96' }}>
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#8aabb5' }}>
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="py-12 text-center text-sm font-medium" style={{ color: '#8aabb5' }}>Chưa có học viên nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* System Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-sm relative overflow-hidden flex-1">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-40" style={{ background: TEAL_LIGHT }} />
            <h4 className="text-xl font-bold mb-6" style={{ color: '#1a3d47' }}>System Summary</h4>
            <div className="space-y-6">
              {[
                { label: 'Storage Used', value: '82%', width: 82, color: TEAL },
                { label: 'Server Load', value: '24%', width: 24, color: '#5aab9a' },
              ].map(({ label, value, width, color }) => (
                <div key={label} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest" style={{ color: '#8aabb5' }}>
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: TEAL_LIGHT }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${width}%`, background: color }} />
                  </div>
                </div>
              ))}

              <div className="mt-4 p-4 rounded-xl flex items-start gap-3" style={{ background: TEAL_LIGHT }}>
                <CloudUpload className="w-7 h-7 shrink-0 mt-0.5" style={{ color: TEAL }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: '#1a3d47' }}>Cloud Sync Active</p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#5a8a96' }}>Cập nhật lần cuối: vừa xong</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium CTA */}
          <div className="rounded-2xl p-8 text-white shadow-lg relative overflow-hidden" style={{ background: TEAL }}>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h4 className="text-lg font-black mb-2">Upgrade to Ultra</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                Mở khóa thêm các tính năng nâng cao và dung lượng lưu trữ không giới hạn.
              </p>
              <button
                className="mt-6 w-full py-3 bg-white font-black rounded-full text-sm transition-all hover:brightness-95 active:scale-95 shadow-md"
                style={{ color: TEAL }}
              >
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
