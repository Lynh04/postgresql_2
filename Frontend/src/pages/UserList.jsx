import React, { useState, useEffect } from 'react';
import {
  UserPlus, Trash2, Eye, Edit3, Filter, Download,
  History, Award, ChevronLeft, ChevronRight, Mail, X, User,
} from 'lucide-react';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

const TEAL = '#1a6374';
const TEAL_LIGHT = '#e8f4f7';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [editLoading, setEditLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data);
      setError(null);
    } catch {
      setError('Không thể tải danh sách học viên.');
      toast.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Đang tạo học viên...');
    try {
      await api.post('/users', newUser);
      setIsCreateOpen(false);
      setNewUser({ name: '', email: '' });
      toast.success('Đã thêm học viên mới', { id: loadToast });
      fetchUsers();
    } catch (err) {
      toast.error('Lỗi: ' + (err.response?.data?.errors?.[0]?.msg || err.message), { id: loadToast });
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const loadToast = toast.loading('Đang lưu thay đổi...');
    try {
      await api.put(`/users/${editTarget.id}`, editForm);
      setEditTarget(null);
      toast.success('Đã cập nhật thông tin', { id: loadToast });
      fetchUsers();
    } catch (err) {
      toast.error('Lỗi: ' + (err.response?.data?.errors?.[0]?.msg || err.message), { id: loadToast });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    const loadToast = toast.loading('Đang xóa...');
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      toast.success('Đã xóa học viên', { id: loadToast });
      fetchUsers();
    } catch {
      toast.error('Lỗi khi xóa học viên', { id: loadToast });
    }
  };

  const openEdit = (user) => {
    setEditTarget(user);
    setEditForm({ name: user.name, email: user.email });
  };

  const formatId = (id) => `#AL-${String(id).padStart(4, '0')}`;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: '#1a3d47' }}>
            Quản lý học viên
          </h1>
          <p className="font-medium text-sm md:text-base" style={{ color: '#5a8a96' }}>
            Bạn hiện có <span className="font-black" style={{ color: TEAL }}>{users.length}</span> học viên trong hệ thống.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm shadow-lg transition-all hover:brightness-110 active:scale-95"
          style={{ background: TEAL }}
        >
          <UserPlus className="w-4.5 h-4.5" />
          Add New Learner
        </button>
      </section>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-sm text-center">
          {error}
          <button onClick={fetchUsers} className="ml-3 underline">Thử lại</button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 px-2">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between border border-slate-100 gap-6">
          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-base font-bold mb-1" style={{ color: '#1a3d47' }}>Tỉ lệ hoàn thành khóa học</h3>
            <p className="text-4xl font-black" style={{ color: TEAL }}>84.2%</p>
            <div className="mt-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-black" style={{ background: TEAL_LIGHT, color: TEAL }}>
                +5.2% tháng này
              </span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-20">
            {[40, 60, 55, 80, 95].map((h, i) => (
              <div
                key={i}
                className="w-5 rounded-full transition-all"
                style={{
                  height: `${h}%`,
                  background: i === 4 ? TEAL : TEAL_LIGHT,
                }}
              />
            ))}
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ background: TEAL_LIGHT }} />
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100" style={{ background: '#f5f9fa' }}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.18em] mb-5" style={{ color: '#5a8a96' }}>Hoạt động mới</h3>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <History className="w-3.5 h-3.5" style={{ color: TEAL }} />
              </div>
              <p className="text-xs font-medium" style={{ color: '#4a7a88' }}>
                {loading ? '...' : users.length} học viên đã đăng ký
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <Award className="w-3.5 h-3.5" style={{ color: TEAL }} />
              </div>
              <p className="text-xs font-medium" style={{ color: '#4a7a88' }}>12 chứng chỉ đã được cấp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100 clay-card">
        <div className="px-8 py-6 border-b flex justify-between items-center" style={{ borderColor: '#eaf2f5', background: '#fafcfd' }}>
          <div className="flex items-center gap-2">
            {['Tất cả học viên'].map((tab, i) => (
              <button
                key={tab}
                className="px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
                style={i === 0
                  ? { background: TEAL, color: 'white' }
                  : { color: '#8aabb5' }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-full transition-colors hover:brightness-95 bg-white shadow-sm border border-slate-100" style={{ color: TEAL }}>
              <Filter className="w-4.5 h-4.5" />
            </button>
            <button className="p-2.5 rounded-full transition-colors hover:brightness-95 bg-white shadow-sm border border-slate-100" style={{ color: TEAL }}>
              <Download className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: '#8aabb5', borderBottom: `1px solid #eaf2f5` }}>
                <th className="px-8 py-6">ID</th>
                <th className="px-8 py-6">Learner Profile</th>
                <th className="px-8 py-6">Email Address</th>
                <th className="px-8 py-6">Joined Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#eaf2f5' }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-8 py-6">
                        <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.map((user, idx) => (
                <tr key={user.id} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-8 py-6 text-sm font-bold" style={{ color: TEAL }}>{formatId(user.id)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border-2 border-white overflow-hidden transition-transform group-hover:scale-110"
                        style={{ background: `hsl(${180 + idx * 25}, 45%, 85%)`, color: TEAL }}
                      >
                        <img
                          src={`https://picsum.photos/seed/${user.name}/100/100`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="font-bold text-sm" style={{ color: '#1a3d47' }}>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium" style={{ color: '#5a8a96' }}>{user.email}</td>
                  <td className="px-8 py-6 text-sm font-medium" style={{ color: '#8aabb5' }}>
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/users/${user.id}`}
                        className="p-2.5 rounded-full bg-white shadow-sm transition-all hover:scale-110 border border-slate-100"
                        style={{ color: '#8aabb5' }}
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </Link>
                      <button
                        onClick={() => openEdit(user)}
                        className="p-2.5 rounded-full bg-white shadow-sm transition-all hover:scale-110 border border-slate-100"
                        style={{ color: TEAL }}
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="p-2.5 rounded-full bg-white shadow-sm transition-all hover:scale-110 border border-slate-100 text-rose-500"
                        title="Xóa học viên"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 flex justify-between items-center border-t" style={{ borderColor: '#eaf2f5', background: '#fafcfd' }}>
          <span className="text-xs font-bold" style={{ color: '#8aabb5' }}>
            Hiển thị {users.length} học viên
          </span>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100 transition-all hover:brightness-95" style={{ color: TEAL }}>
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg" style={{ background: TEAL }}>1</button>
            {[2, 3].map(p => (
              <button key={p} className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors" style={{ color: '#5a8a96' }}>{p}</button>
            ))}
            <span className="px-1 text-sm font-bold" style={{ color: '#8aabb5' }}>...</span>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ color: '#5a8a96' }}>125</button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100 transition-all hover:brightness-95" style={{ color: TEAL }}>
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isCreateOpen && (
          <Modal onClose={() => setIsCreateOpen(false)} title="Thêm học viên mới" icon={<UserPlus className="w-8 h-8" style={{ color: TEAL }} />} accentBg={TEAL_LIGHT}>
            <form onSubmit={handleCreateUser} className="space-y-8">
              <ModalField label="Họ và tên" icon={User}>
                <input type="text" required placeholder="Ví dụ: Nguyễn Văn A"
                  value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="modal-input"
                />
              </ModalField>
              <ModalField label="Email" icon={Mail}>
                <input type="email" required placeholder="Ví dụ: a@academy.edu"
                  value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="modal-input"
                />
              </ModalField>
              <ModalActions onCancel={() => setIsCreateOpen(false)} submitLabel="Tạo mới" />
            </form>
          </Modal>
        )}

        {editTarget && (
          <Modal onClose={() => setEditTarget(null)} title="Chỉnh sửa học viên" subtitle={editTarget.name} icon={<Edit3 className="w-8 h-8" style={{ color: TEAL }} />} accentBg={TEAL_LIGHT}>
            <form onSubmit={handleEditUser} className="space-y-8">
              <ModalField label="Họ và tên" icon={User}>
                <input type="text" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="modal-input" />
              </ModalField>
              <ModalField label="Email" icon={Mail}>
                <input type="email" required value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="modal-input" />
              </ModalField>
              <ModalActions onCancel={() => setEditTarget(null)} submitLabel={editLoading ? 'Đang lưu...' : 'Lưu thay đổi'} disabled={editLoading} />
            </form>
          </Modal>
        )}

        {deleteTarget && (
          <Modal onClose={() => setDeleteTarget(null)} title="Xác nhận xóa" subtitle={`Xóa học viên "${deleteTarget.name}"?`} icon={<Trash2 className="w-8 h-8 text-rose-500" />} accentBg="#fff1f2">
            <p className="text-sm font-medium text-center mb-6" style={{ color: '#5a8a96' }}>
              Hành động này không thể hoàn tác. Toàn bộ dữ liệu của học viên sẽ bị xóa vĩnh viễn.
            </p>
            <ModalActions onCancel={() => setDeleteTarget(null)} submitLabel="Xóa học viên" teal="#e11d48" onSubmit={handleDeleteUser} />
          </Modal>
        )}
      </AnimatePresence>

      <style>{`
        .modal-input {
          width: 100%;
          background: #eef4f7;
          border: none;
          border-radius: 9999px;
          padding: 1.15rem 1.6rem;
          color: #1a3d47;
          font-weight: 600;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
          box-shadow: inset 0 2px 8px rgba(26,99,116,0.08);
        }
        .modal-input::placeholder { color: #b8cfd6; }
        .modal-input:focus {
          background: #e4eff4;
          box-shadow: inset 0 2px 10px rgba(26,99,116,0.13);
        }
      `}</style>
    </div>
  );
};

const Modal = ({ onClose, title, subtitle, icon, accentBg, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
    style={{ background: 'rgba(20,40,50,0.25)', backdropFilter: 'blur(16px)' }}
  >
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="bg-white w-full max-w-lg relative overflow-hidden shadow-2xl"
        style={{ borderRadius: '3rem', padding: '3.5rem 3rem 3rem' }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-40" style={{ background: accentBg }} />
      <button onClick={onClose} className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:brightness-95 shadow-sm"
        style={{ background: '#eef4f7', color: '#7aabb5' }}
      >
        <X className="w-6 h-6" />
      </button>
      <div className="text-center mb-10 relative">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner" style={{ background: accentBg }}>
          {icon}
        </div>
        <h2 className="text-3xl font-black tracking-tight leading-none" style={{ color: '#1a3d47' }}>{title}</h2>
        {subtitle && <p className="text-sm font-semibold mt-3" style={{ color: '#5a8a96' }}>{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  </div>
);

const ModalField = ({ label, icon: Icon, children }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 pl-4" style={{ color: '#8aabb5' }}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </label>
    {children}
  </div>
);

const ModalActions = ({ onCancel, submitLabel, disabled, teal, onSubmit }) => (
  <div className="flex gap-4 pt-6">
    <button type="button" onClick={onCancel}
      className="flex-1 py-4.5 rounded-full font-bold text-base transition-all active:scale-95 bg-white shadow-md border border-slate-100"
      style={{ color: '#5a8a96' }}
    >
      Hủy
    </button>
    <button type={onSubmit ? 'button' : 'submit'} onClick={onSubmit} disabled={disabled}
      className="flex-1 py-4.5 rounded-full font-black text-base text-white transition-all active:scale-95 hover:brightness-110 disabled:opacity-60 disabled:pointer-events-none shadow-xl"
      style={{ background: teal || '#161c20' }}
    >
      {submitLabel}
    </button>
  </div>
);

export default UserList;
