import React from 'react';

type View = 'dashboard' | 'students';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  // Fix: Changed JSX.Element to React.ReactNode to resolve namespace error.
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
      isActive
        ? 'bg-primary-500 text-white shadow-lg'
        : 'text-neutral-500 dark:text-neutral-400 hover:bg-primary-100 dark:hover:bg-neutral-800'
    }`}
  >
    <span className="mr-4">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-white dark:bg-neutral-950 p-6 flex-col justify-between hidden lg:flex shadow-lg">
        <div>
            <div className="flex items-center mb-10">
                <svg className="w-10 h-10 text-primary-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Clarity<span className="text-primary-500">Edu</span></h1>
            </div>
            <nav className="space-y-3">
                <NavItem
                    label="Dashboard"
                    icon={<HomeIcon />}
                    isActive={currentView === 'dashboard'}
                    onClick={() => setCurrentView('dashboard')}
                />
                <NavItem
                    label="Alumnos"
                    icon={<UsersIcon />}
                    isActive={currentView === 'students'}
                    onClick={() => setCurrentView('students')}
                />
            </nav>
        </div>
        <div className="mt-auto">
             <div className="p-4 rounded-lg bg-primary-50 dark:bg-neutral-800/50 text-center">
                 <p className="text-sm text-neutral-600 dark:text-neutral-300">© 2024 Clarity Edu</p>
                 <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Todos los derechos reservados</p>
             </div>
        </div>
    </aside>
  );
};

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);


export default Sidebar;
