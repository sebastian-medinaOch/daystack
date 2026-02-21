import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Clock, Paperclip, CheckCircle2, Circle, Edit2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { getAttachment } from '../lib/storage';

const AttachmentPreview = ({ attachment }) => {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const loadAttachment = async () => {
            if (attachment.type && attachment.type.startsWith('image/')) {
                const fullData = await getAttachment(attachment.id);
                if (fullData && fullData.data) {
                    setPreviewUrl(fullData.data);
                }
            }
        };
        loadAttachment();
    }, [attachment]);

    const isImage = attachment.type && attachment.type.startsWith('image/');

    return (
        <div className="attachment-card" style={{ padding: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {previewUrl ? (
                <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-light)' }}>
                    <img src={previewUrl} alt={attachment.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            ) : (
                <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: 'var(--bg-panel)', display: 'grid', placeItems: 'center', flexShrink: 0, color: 'var(--primary)' }}>
                    {isImage ? <ImageIcon size={20} /> : <Paperclip size={20} />}
                </div>
            )}
            <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={attachment.name}>{attachment.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{(attachment.size / 1024).toFixed(1)} KB</div>
            </div>
        </div>
    );
};

const TaskViewModal = ({ task: initialTask, onClose, onEdit }) => {
    if (!initialTask) return null;
    const { tasks, toggleTaskCompletion, updateTask } = useTasks();

    // Get live task to ensure subtask toggles reflect immediately
    const task = tasks.find(t => t.id === initialTask.id) || initialTask;

    const handleStatusChange = (subtaskId, newStatus) => {
        const updatedSubtasks = task.subtasks.map(st =>
            st.id === subtaskId ? { ...st, status: newStatus, completed: newStatus === 'done' } : st
        );
        updateTask(task.id, { subtasks: updatedSubtasks });
    };

    const handleDeleteSubtask = (subtaskId) => {
        const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);
        updateTask(task.id, { subtasks: updatedSubtasks });
    };

    const getDueDateStr = () => {
        if (!task.endDate) return 'No due date';
        const endDate = new Date(task.endDate);
        return endDate.toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const completedSubtasks = task.subtasks?.filter(s => s.status === 'done' || s.completed).length || 0;

    const getStatusConfig = (st) => {
        const currentStatus = st.status || (st.completed ? 'done' : 'todo');
        switch (currentStatus) {
            case 'done': return { bg: 'var(--success)', color: '#fff', label: 'DONE' };
            case 'in-progress': return { bg: 'var(--accent-work)', color: '#fff', label: 'IN PROGRESS' };
            case 'blocked': return { bg: 'var(--danger)', color: '#fff', label: 'BLOCKED' };
            case 'todo':
            default: return { bg: 'var(--bg-card)', color: 'var(--text-secondary)', label: 'TO DO' };
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="task-title-area" style={{ gap: '12px' }}>
                        <button
                            className="task-check-btn"
                            onClick={() => toggleTaskCompletion(task.id)}
                            style={{ padding: 0 }}
                        >
                            {task.completed ?
                                <CheckCircle2 className="checked-icon" size={26} /> :
                                <Circle className="unchecked-icon" size={26} />
                            }
                        </button>
                        <h2 style={{ fontSize: '1.4rem', color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none' }}>
                            {task.title}
                        </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { onClose(); onEdit(task); }} className="btn-ghost" title="Edit Task">
                            <Edit2 size={20} />
                        </button>
                        <button onClick={onClose} className="btn-ghost text-danger">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="task-view-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Metadata Row */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {task.projectName && (
                            <span className="project-badge" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                                {task.projectName}
                            </span>
                        )}
                        <span className="task-meta-tag" style={{ backgroundColor: 'var(--bg-card)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
                            <Clock size={16} /> {getDueDateStr()}
                        </span>
                        <span className="task-meta-tag" style={{ textTransform: 'capitalize', backgroundColor: 'var(--bg-card)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
                            {task.type} Task
                        </span>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div className="task-desc-section">
                            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Description</h4>
                            <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <div className="task-subtasks-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Subtasks</h4>
                            </div>

                            {/* Progress Bar */}
                            <div className="progress-container">
                                <div className="progress-bar-track">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${Math.round((completedSubtasks / task.subtasks.length) * 100)}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">
                                    {Math.round((completedSubtasks / task.subtasks.length) * 100)}% Done
                                </span>
                            </div>

                            <div className="subtask-table-wrapper">
                                <table className="subtask-table">
                                    <thead>
                                        <tr>
                                            <th className="col-type">Type</th>
                                            <th className="col-key">Key</th>
                                            <th className="col-summary">Summary</th>
                                            <th className="col-status">Status</th>
                                            <th className="col-action" style={{ textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {task.subtasks.map((st, idx) => {
                                            const stKey = `${task.id.slice(0, 4).toUpperCase()}-${idx + 1}`;
                                            const statusCfg = getStatusConfig(st);
                                            const currentStatus = st.status || (st.completed ? 'done' : 'todo');

                                            return (
                                                <tr key={st.id} style={{ opacity: currentStatus === 'done' ? 0.6 : 1 }}>
                                                    <td className="col-type" style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <CheckSquare size={16} className="text-secondary" />
                                                    </td>
                                                    <td className="col-key">{stKey}</td>
                                                    <td className="col-summary" style={{ textDecoration: currentStatus === 'done' ? 'line-through' : 'none' }}>
                                                        {st.title}
                                                    </td>
                                                    <td className="col-status">
                                                        <select
                                                            value={currentStatus}
                                                            onChange={(e) => { e.stopPropagation(); handleStatusChange(st.id, e.target.value); }}
                                                            style={{
                                                                fontSize: '0.75rem',
                                                                backgroundColor: statusCfg.bg,
                                                                color: statusCfg.color,
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontWeight: '600',
                                                                border: 'none',
                                                                outline: 'none',
                                                                cursor: 'pointer',
                                                                appearance: 'none',
                                                                textAlign: 'center'
                                                            }}
                                                        >
                                                            <option value="todo" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>TO DO</option>
                                                            <option value="in-progress" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>IN PROGRESS</option>
                                                            <option value="blocked" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>BLOCKED</option>
                                                            <option value="done" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>DONE</option>
                                                        </select>
                                                    </td>
                                                    <td className="col-action" style={{ textAlign: 'right' }}>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteSubtask(st.id); }}
                                                            className="btn-ghost text-danger"
                                                            style={{ padding: '6px', borderRadius: '4px', display: 'inline-flex' }}
                                                            title="Delete Subtask"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Attachments */}
                    {task.attachments && task.attachments.length > 0 && (
                        <div className="task-attachments-section">
                            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem' }}>Attachments</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                                {task.attachments.map(att => (
                                    <AttachmentPreview key={att.id} attachment={att} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TaskViewModal;
