import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskList from './TaskList';

const Dashboard = ({ onEditTask, onViewTask }) => {
    const { tasks, loading } = useTasks();

    if (loading) return <div className="page-content">Loading...</div>;

    const getStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;

        const personal = tasks.filter(t => t.type === 'personal').length;
        const work = tasks.filter(t => t.type === 'work').length;
        const project = tasks.filter(t => t.type === 'project').length;

        return { total, completed, pending, personal, work, project };
    };

    const stats = getStats();
    const recentTasks = tasks.slice(0, 5);

    return (
        <div className="page-content animate-fade-in">
            <h1>Dashboard</h1>
            <p>Here is an overview of your tasks and progress.</p>

            <div className="dashboard-stats">
                <div className="stat-card glass-panel">
                    <h3>Total Tasks</h3>
                    <div className="stat-value">{stats.total}</div>
                </div>
                <div className="stat-card glass-panel">
                    <h3>Completed</h3>
                    <div className="stat-value text-success">{stats.completed}</div>
                </div>
                <div className="stat-card glass-panel">
                    <h3>Pending</h3>
                    <div className="stat-value text-warning">{stats.pending}</div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-section glass-panel">
                    <h2>Recent Tasks</h2>
                    <TaskList tasks={recentTasks} onEditTask={onEditTask} onViewTask={onViewTask} />
                </div>

                <div className="dashboard-section glass-panel">
                    <h2>Task Distribution</h2>
                    <ul className="distribution-list">
                        <li>
                            <span className="dist-label">
                                <span className="dot" style={{ backgroundColor: 'var(--accent-personal)' }}></span> Personal
                            </span>
                            <span className="dist-value">{stats.personal}</span>
                        </li>
                        <li>
                            <span className="dist-label">
                                <span className="dot" style={{ backgroundColor: 'var(--accent-work)' }}></span> Work
                            </span>
                            <span className="dist-value">{stats.work}</span>
                        </li>
                        <li>
                            <span className="dist-label">
                                <span className="dot" style={{ backgroundColor: 'var(--accent-project)' }}></span> Projects
                            </span>
                            <span className="dist-value">{stats.project}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
