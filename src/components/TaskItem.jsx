import React from 'react';
import { CheckSquare, MoreVertical, Clock, Paperclip, CheckCircle2, Circle, Eye, Edit2, Trash2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const TaskItem = ({ task, onEdit, onView }) => {
    const { toggleTaskCompletion, deleteTask } = useTasks();

    const getTypeColor = () => {
        switch (task.type) {
            case 'personal': return 'var(--accent-personal)';
            case 'work': return 'var(--accent-work)';
            case 'project': return 'var(--accent-project)';
            default: return 'var(--text-tertiary)';
        }
    };

    const getDueDateLabel = () => {
        if (!task.endDate) return null;
        const endDate = new Date(task.endDate);
        const now = new Date();
        const diff = endDate - now;

        // Check if overdue
        if (diff < 0 && !task.completed) {
            return <span className="task-meta-tag overdue"><Clock size={14} /> Overdue</span>;
        }

        // Format date string
        const isToday = endDate.toDateString() === now.toDateString();
        return (
            <span className="task-meta-tag">
                <Clock size={14} />
                {isToday ? 'Today' : endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
        );
    };

    return (
        <div
            className={`task-card ${task.completed ? 'completed' : ''}`}
            onClick={() => onView && onView(task)}
            style={{ cursor: onView ? 'pointer' : 'default' }}
        >
            <div className="task-indicator" style={{ backgroundColor: getTypeColor() }}></div>
            <div className="task-content">
                <div className="task-header">
                    <div className="task-title-area">
                        <button
                            className="task-check-btn"
                            onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(task.id); }}
                        >
                            {task.completed ?
                                <CheckCircle2 className="checked-icon" size={22} /> :
                                <Circle className="unchecked-icon" size={22} />
                            }
                        </button>
                        <h3 className="task-title">{task.title}</h3>
                        {task.type === 'project' && task.projectName && (
                            <span className="project-badge">{task.projectName}</span>
                        )}
                    </div>

                    <div className="task-actions">
                        {onView && (
                            <button className="action-btn" onClick={(e) => { e.stopPropagation(); onView(task); }} title="View Task">
                                <Eye size={16} /> <span>View</span>
                            </button>
                        )}
                        <button className="action-btn" onClick={(e) => { e.stopPropagation(); onEdit(task); }} title="Edit Task">
                            <Edit2 size={16} /> <span>Edit</span>
                        </button>
                        <button className="action-btn action-btn-danger" onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} title="Delete Task">
                            <Trash2 size={16} /> <span>Delete</span>
                        </button>
                    </div>
                </div>

                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}

                <div className="task-meta">
                    {getDueDateLabel()}

                    {task.subtasks && task.subtasks.length > 0 && (
                        <span className="task-meta-tag">
                            <CheckSquare size={14} />
                            {task.subtasks.filter(s => s.status === 'done' || s.completed).length} / {task.subtasks.length}
                        </span>
                    )}

                    {task.attachments && task.attachments.length > 0 && (
                        <span className="task-meta-tag">
                            <Paperclip size={14} />
                            {task.attachments.length} files
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
