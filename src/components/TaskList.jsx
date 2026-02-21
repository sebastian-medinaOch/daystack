import React, { useState } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onEditTask, onViewTask }) => {
    const [filter, setFilter] = useState('all'); // all, pending, completed

    if (!tasks || tasks.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">✓</div>
                <h3>No tasks found</h3>
                <p>Get started by creating a new task.</p>
            </div>
        );
    }

    const filteredTasks = tasks.filter(task => {
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true; // all
    });

    return (
        <div className="task-list-container">
            <div className="task-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            <div className="task-list">
                {filteredTasks.length === 0 ? (
                    <div className="empty-state small">
                        <p>No tasks match this filter.</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                            onView={onViewTask}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskList;
