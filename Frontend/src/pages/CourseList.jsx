import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, BookPlus, Pencil, X, Tag, FileText, Play, BookOpen } from 'lucide-react';
import api from '../lib/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

const TEAL = '#1a6374';
const TEAL_LIGHT = '#e8f4f7';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', code: '' });

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', code: '' });
  const [editLoading, setEditLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const location = useLocation();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('new') === 'true') {
      setIsCreateOpen(true);
      // Clean up the URL after opening
      navigate('/courses', { replace: true });
    }
  }, [location.search]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/courses');
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách khóa học. Kiểm tra kết nối backend.');
      toast.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Đang tạo khóa học...');
    try {
      await api.post('/api/courses', newCourse);
      setIsCreateOpen(false);
      setNewCourse({ title: '', code: '' });
      toast.success('Đã tạo khóa học mới', { id: loadToast });
      fetchCourses();
    } catch (err) {
      toast.error('Lỗi tạo khóa học: ' + (err.response?.data?.error || err.message), { id: loadToast });
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteTarget) return;
    const loadToast = toast.loading('Đang xóa...');
    try {
      await api.delete(`/api/courses/${deleteTarget.id}`);
      setDeleteTarget(null);
      toast.success('Đã xóa khóa học', { id: loadToast });
      fetchCourses();
    } catch (err) {
      toast.error('Lỗi khi xóa khóa học', { id: loadToast });
    }
  };

  const openEdit = (course) => {
    setEditTarget(course);
    setEditForm({ title: course.title, code: course.code });
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const loadToast = toast.loading('Đang lưu thay đổi...');
    try {
      await api.put(`/api/courses/${editTarget.id}`, editForm);
      setEditTarget(null);
      toast.success('Đã cập nhật khóa học', { id: loadToast });
      fetchCourses();
    } catch (err) {
      toast.error('Lỗi cập nhật khóa học: ' + (err.response?.data?.error || err.message), { id: loadToast });
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: TEAL, borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div className="text-center md:text-left w-full md:w-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: '#1a3d47' }}>
            Course Management
          </h1>
          <p className="font-medium text-sm md:text-base" style={{ color: '#5a8a96' }}>
            Bạn hiện có <span className="font-black" style={{ color: TEAL }}>{courses.length}</span> khóa học trong hệ thống.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm shadow-lg transition-all hover:brightness-110 active:scale-95 shadow-teal-900/10"
          style={{ background: TEAL }}
        >
          <Plus className="w-5 h-5 transition-transform" />
          Add New Module
        </button>
      </section>

      {error && (
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 font-bold text-center">
          {error}
          <button onClick={fetchCourses} className="ml-4 underline hover:text-rose-700">Thử lại</button>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-[2.5rem] p-8 clay-card group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-slate-100/50">
            <div className="aspect-video w-full mb-8 rounded-3xl bg-slate-50 overflow-hidden relative shadow-inner">
              <img
                src={`https://picsum.photos/seed/${course.id}/400/225`}
                alt={course.title}
                className="w-full h-full object-cover opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 shadow-xl cursor-pointer text-white"
                >
                  <Play size={24} fill="white" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-start mb-4">
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase"
                style={{ background: TEAL_LIGHT, color: TEAL }}
              >
                {course.code || 'MODULE'}
              </span>
              <span className="text-slate-400 font-bold text-sm">
                {course.users?.length || 0} Learners
              </span>
            </div>

            <h3 className="text-2xl font-extrabold mb-3 leading-tight" style={{ color: '#1a3d47' }}>{course.title}</h3>
            <p className="text-slate-500 text-sm mb-8 line-clamp-2 grow">
              Hệ thống hóa các khối kiến thức cơ bản để tiến tới làm chủ chuyên môn. Lộ trình học tập chuyên nghiệp dành cho bạn.
            </p>

            <div className="flex gap-3">
              <Link
                to={`/courses/${course.id}`}
                className="flex-1 py-3 px-4 bg-slate-50 text-slate-700 font-bold rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 border border-slate-100"
              >
                <Eye size={16} />
                Detail
              </Link>
              <button
                onClick={() => openEdit(course)}
                className="p-3 bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 transition-colors flex items-center justify-center shadow-sm"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => setDeleteTarget(course)}
                className="p-3 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-100 transition-colors flex items-center justify-center shadow-sm"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {courses.length === 0 && !loading && (
          <div className="col-span-full py-32 text-center bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-slate-50">
              <BookOpen className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Chưa có khóa học</h3>
            <p className="text-slate-500 font-medium">Hãy thêm khóa học đầu tiên để bắt đầu.</p>
          </div>
        )}
      </div>

      {/* Modal Creating */}
      {isCreateOpen && (
        <Modal onClose={() => setIsCreateOpen(false)} title="New Course Module" icon={<BookPlus className="w-8 h-8" style={{ color: TEAL }} />} accentBg={TEAL_LIGHT}>
          <form onSubmit={handleCreateCourse} className="space-y-8">
            <ModalField label="Tên khóa học" icon={FileText}>
              <input type="text" required placeholder="Ví dụ: Advanced Woodworking"
                value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                className="modal-input"
              />
            </ModalField>
            <ModalField label="Mã khóa học" icon={Tag}>
              <input type="text" required placeholder="Ví dụ: WD401"
                value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })}
                className="modal-input uppercase tracking-widest"
              />
            </ModalField>
            <ModalActions onCancel={() => setIsCreateOpen(false)} submitLabel="Tạo mới" />
          </form>
        </Modal>
      )}

      {/* Modal Editing */}
      {editTarget && (
        <Modal onClose={() => setEditTarget(null)} title="Chỉnh sửa khóa học" subtitle={editTarget.title} icon={<Pencil className="w-8 h-8" style={{ color: TEAL }} />} accentBg={TEAL_LIGHT}>
          <form onSubmit={handleEditCourse} className="space-y-8">
            <ModalField label="Tên khóa học" icon={FileText}>
              <input type="text" required value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="modal-input" />
            </ModalField>
            <ModalField label="Mã khóa học" icon={Tag}>
              <input type="text" required value={editForm.code} onChange={e => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })} className="modal-input uppercase tracking-widest" />
            </ModalField>
            <ModalActions onCancel={() => setEditTarget(null)} submitLabel={editLoading ? 'Đang lưu...' : 'Lưu thay đổi'} disabled={editLoading} />
          </form>
        </Modal>
      )}

      {/* Modal Deleting */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)} title="Xác nhận xóa" subtitle={`Xóa khóa học "${deleteTarget.title}"?`} icon={<Trash2 className="w-8 h-8 text-rose-500" />} accentBg="#fff1f2">
          <p className="text-sm font-medium text-center mb-6" style={{ color: '#5a8a96' }}>
            Toàn bộ dữ liệu về ghi danh của khóa học này sẽ bị xóa. Hành động này không thể hoàn tác.
          </p>
          <ModalActions onCancel={() => setDeleteTarget(null)} submitLabel="Xóa ngay" teal="#e11d48" onSubmit={handleDeleteCourse} />
        </Modal>
      )}

      <style>{`
        .modal-input {
          width: 100%;
          background: #eef4f7;
          border: none;
          border-radius: 9999px;
          padding: 1.1rem 1.5rem;
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
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    style={{ background: 'rgba(20,40,50,0.25)', backdropFilter: 'blur(12px)' }}
  >
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg relative overflow-hidden"
        style={{ borderRadius: '2.5rem', padding: '3rem 2.5rem 2.5rem', boxShadow: '0 32px 80px rgba(26,99,116,0.14)' }}
    >
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-40" style={{ background: accentBg }} />
      <button onClick={onClose} className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:brightness-95"
        style={{ background: '#eef4f7', color: '#7aabb5' }}
      >
        <X className="w-5 h-5" />
      </button>
      <div className="text-center mb-10 relative">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inset" style={{ background: accentBg }}>
          {icon}
        </div>
        <h2 className="text-3xl font-black tracking-tight" style={{ color: '#1a3d47' }}>{title}</h2>
        {subtitle && <p className="text-sm font-semibold mt-2" style={{ color: '#5a8a96' }}>{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  </div>
);

const ModalField = ({ label, icon: Icon, children }) => (
  <div className="space-y-2.5">
    <label className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 pl-2" style={{ color: '#8aabb5' }}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </label>
    {children}
  </div>
);

const ModalActions = ({ onCancel, submitLabel, disabled, teal, onSubmit }) => (
  <div className="flex gap-4 pt-6">
    <button type="button" onClick={onCancel}
      className="flex-1 py-4 rounded-full font-bold text-base transition-all active:scale-95 hover:brightness-95"
      style={{ background: 'white', color: '#5a8a96', boxShadow: '0 2px 12px rgba(26,99,116,0.10)' }}
    >
      Hủy
    </button>
    <button type={onSubmit ? 'button' : 'submit'} onClick={onSubmit} disabled={disabled}
      className="flex-1 py-4 rounded-full font-black text-base text-white transition-all active:scale-95 hover:brightness-110 disabled:opacity-60 disabled:pointer-events-none shadow-lg"
      style={{ background: teal || '#161c20' }}
    >
      {submitLabel}
    </button>
  </div>
);

export default CourseList;
