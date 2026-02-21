import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Clock, FolderKanban, Plus } from 'lucide-react';
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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToView, setTaskToView] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

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

  return (
    <FinanceProvider>
      <Router>
        <div className="app-container">

          {/* Sidebar Component */}
          <aside className={`sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <div className="logo">
                <div className="logo-icon"></div>
                <h2>DayStack</h2>
              </div>
            </div>

            <nav className="sidebar-nav">
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/tasks" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <CheckSquare size={20} />
                <span>Tasks</span>
              </NavLink>
              <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <FolderKanban size={20} />
                <span>Projects</span>
              </NavLink>
              <NavLink to="/time" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <Clock size={20} />
                <span>Time Tracking</span>
              </NavLink>
              <NavLink to="/finances" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setIsSidebarOpen(false)}>
                <Wallet size={20} />
                <span>Finances</span>
              </NavLink>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="main-content">
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

            <div className="content-area">
              <Routes>
                <Route path="/" element={<Dashboard onEditTask={handleOpenForm} onViewTask={handleOpenView} />} />
                <Route path="/tasks" element={<TasksPage onEditTask={handleOpenForm} onViewTask={handleOpenView} />} />
                <Route path="/projects" element={<ProjectsPage onEditTask={handleOpenForm} onViewTask={handleOpenView} />} />
                <Route path="/time" element={<TimeTracking />} />
                <Route path="/finances" element={<FinanceDashboard />} />
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
      </Router>
    </FinanceProvider>
  );
}

export default App;
