import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Bell, Settings, PlusCircle, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Học viên', path: '/users', icon: Users },
    { name: 'Khóa học', path: '/courses', icon: BookOpen },
  ];

  return (
    <aside 
      className={`fixed lg:sticky top-0 left-0 w-72 h-screen flex flex-col rounded-r-[3rem] shadow-xl z-40 transition-transform duration-500 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      style={{ background: 'linear-gradient(160deg, #dde8f0 0%, #e8f0f5 100%)' }}
    >
      {/* Brand & Close */}
      <div className="flex items-center justify-between pl-8 pr-6 pt-8 mb-10">
        <div>
          <h1 className="text-xl font-black tracking-tight" style={{ color: '#1a6374' }}>
            Lynh Academy
          </h1>
          <p className="text-[10px] font-bold mt-1 uppercase tracking-[0.18em]" style={{ color: '#5a8a96' }}>
            Instructor Portal
          </p>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 rounded-xl hover:bg-white/50 text-slate-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={() => { if(window.innerWidth < 1024) onClose(); }}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300 ${isActive
                ? 'bg-white font-bold shadow-md'
                : 'hover:bg-white/50 hover:scale-105'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? '#1a6374' : '#7a9daa',
            })}
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[15px]">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto px-4 pb-8 space-y-5">
        {/* New Course CTA */}
        <Link
          to="/courses?new=true"
          onClick={() => { if(window.innerWidth < 1024) onClose(); }}
          className="w-full py-4 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 shadow-lg"
          style={{ background: '#1a6374', color: '#ffffff' }}
        >
          <PlusCircle className="w-5 h-5" />
          New Course
        </Link>

        {/* Profile */}
        <div className="pt-4 flex items-center gap-3 px-2 border-t" style={{ borderColor: '#c2d8e0' }}>
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-sm border-2 border-white">
            <img
              src="https://picsum.photos/seed/instructor/100/100"
              alt="profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = '#c9dfe6';
                e.target.parentElement.innerHTML = '<span style="color:#1a6374;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;height:100%">AD</span>';
              }}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold truncate" style={{ color: '#1a3d47' }}>Admin User</span>
            <span className="text-[10px]" style={{ color: '#5a8a96' }}>Pro Educator</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
