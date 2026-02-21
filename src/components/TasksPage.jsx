import React from 'react';
import { useTasks } from '../context/TaskContext';
import TaskList from './TaskList';

const TasksPage = ({ onEditTask, onViewTask }) => {
    const { tasks } = useTasks();

    return (
        <div className="page-content animate-fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1>My Tasks</h1>
                    <p>Organize and manage all your tasks across personal and work.</p>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                <TaskList tasks={tasks} onEditTask={onEditTask} onViewTask={onViewTask} />
            </div>
        </div>
    );
};

export default TasksPage;
