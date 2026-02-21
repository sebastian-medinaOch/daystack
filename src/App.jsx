import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Clock, FolderKanban, Plus, ArrowLeftRight, CreditCard, PieChart, Activity } from 'lucide-react';
import './App.css';

import Dashboard from './components/Dashboard';
import TasksPage from './components/TasksPage';
import ProjectsPage from './components/ProjectsPage';
import TimeTracking from './components/TimeTracking';
import TaskForm from './components/TaskForm';
import TaskViewModal from './components/TaskViewModal';
import FinanceDashboard from './components/FinanceDashboard';
import { FinanceProvider } from './context/FinanceContext';
import { Wallet } from 'lucide-react';

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isFinanceContext = location.pathname.startsWith('/finances');

  const handleOpenForm = (task = null) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
    setIsViewOpen(false); // Close view if opening edit
  };

  const handleCloseForm = () => {
    setTaskToEdit(null);
    setIsFormOpen(false);
  };

  const handleOpenView = (task) => {
    setTaskToView(task);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setTaskToView(null);
    setIsViewOpen(false);
  };

  const toggleContext = () => {
    if (isFinanceContext) {
      navigate('/');
    } else {
      navigate('/finances');
    }
  };

  return (
    <div className={`app-container ${isFinanceContext ? 'finance-theme' : 'task-theme'}`}>

      {/* Sidebar Component */}
      <aside className={`sidebar premium-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" onClick={toggleContext} style={{ cursor: 'pointer' }} title={`Switch to ${isFinanceContext ? 'Tasks' : 'Finances'}`}>
          <div className="logo-icon-premium" style={{ backgroundColor: isFinanceContext ? '#0FB29D' : '#9D84EB' }}>
            {isFinanceContext ? (
              <Wallet size={24} color="white" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" />
              </svg>
            )}
            <div className="context-switch-badge">
              <ArrowLeftRight size={10} color="white" />
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {!isFinanceContext ? (
            <>
              <NavLink to="/" className={({ isActive }) => isActive && location.pathname === '/' ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <div className="nav-icon-container">
                  <LayoutDashboard size={22} strokeWidth={1.5} />
                </div>
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/tasks" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <div className="nav-icon-container">
                  <CheckSquare size={22} strokeWidth={1.5} />
                </div>
                <span>Tasks</span>
              </NavLink>
              <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <div className="nav-icon-container">
                  <FolderKanban size={22} strokeWidth={1.5} />
                </div>
                <span>Projects</span>
              </NavLink>
              <NavLink to="/time" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <div className="nav-icon-container">
                  <Clock size={22} strokeWidth={1.5} />
                </div>
                <span>Time Tracking</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/finances" className={({ isActive }) => isActive && location.pathname === '/finances' ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <div className="nav-icon-container">
                  <Activity size={22} strokeWidth={1.5} />
                </div>
                <span>Overview</span>
              </NavLink>
              <NavLink to="/finances/cards" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <div className="nav-icon-container">
                  <CreditCard size={22} strokeWidth={1.5} />
                </div>
                <span>Cards</span>
              </NavLink>
              <NavLink to="/finances/budget" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <div className="nav-icon-container">
                  <PieChart size={22} strokeWidth={1.5} />
                </div>
                <span>Budget</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-widget">
            <div className="profile-menu-dots">
              <span>...</span>
            </div>
            <div className="profile-avatar">
              <img src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=150&auto=format&fit=crop" alt="User Profile" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {!isFinanceContext && (
          <header className="top-header glass-panel">
            <div className="mobile-menu-btn" style={{ display: 'none' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              ☰
            </div>
            <div className="header-search">
              <input type="text" placeholder="Search tasks..." className="search-input" />
            </div>
            <div className="header-actions">
              <button className="btn btn-primary" onClick={() => handleOpenForm()}>
                <Plus size={18} /> New Task
              </button>
            </div>
          </header>
        )}

        <div className={`content-area ${isFinanceContext ? 'finance-content-area' : ''}`}>
          <Routes>
            {/* Task Routes */}
            <Route path="/" element={<Dashboard onEditTask={handleOpenForm} onViewTask={handleOpenView} />} />
            <Route path="/tasks" element={<TasksPage onEditTask={handleOpenForm} onViewTask={handleOpenView} />} />
            <Route path="/projects" element={<ProjectsPage onEditTask={handleOpenForm} onViewTask={handleOpenView} />} />
            <Route path="/time" element={<TimeTracking />} />

            {/* Finance Routes */}
            <Route path="/finances/*" element={<FinanceDashboard />} />
          </Routes>
        </div>
      </main>

      {/* Task Form Modal */}
      {isFormOpen && (
        <TaskForm
          taskToEdit={taskToEdit}
          onClose={handleCloseForm}
        />
      )}

      {isViewOpen && (
        <TaskViewModal
          task={taskToView}
          onClose={handleCloseView}
          onEdit={handleOpenForm}
        />
      )}

    </div>
  );
};

function App() {
  return (
    <FinanceProvider>
      <Router>
        <AppContent />
      </Router>
    </FinanceProvider>
  );
}

export default App;
