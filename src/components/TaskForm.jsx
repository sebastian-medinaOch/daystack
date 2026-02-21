import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Plus, Trash2, Paperclip } from 'lucide-react';
import { saveAttachment, deleteAttachment } from '../lib/storage';

const TaskForm = ({ taskToEdit, onClose }) => {
    const { addTask, updateTask, tasks } = useTasks();

    // Need unique project names for datalist
    const projectNames = [...new Set(tasks.filter(t => t.type === 'project' && t.projectName).map(t => t.projectName))];

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'personal',
        projectName: '',
        startDate: '',
        endDate: '',
        subtasks: [],
        attachments: []
    });

    const [subtaskInput, setSubtaskInput] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title || '',
                description: taskToEdit.description || '',
                type: taskToEdit.type || 'personal',
                projectName: taskToEdit.projectName || '',
                startDate: taskToEdit.startDate || '',
                endDate: taskToEdit.endDate || '',
                subtasks: taskToEdit.subtasks || [],
                attachments: taskToEdit.attachments || []
            });
        }
    }, [taskToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSubtask = () => {
        if (subtaskInput.trim()) {
            setFormData(prev => ({
                ...prev,
                subtasks: [...prev.subtasks, { id: crypto.randomUUID(), title: subtaskInput.trim(), status: 'todo', completed: false }]
            }));
            setSubtaskInput('');
        }
    };

    const handleRemoveSubtask = (id) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter(s => s.id !== id)
        }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const attachmentMeta = await saveAttachment(null, file); // We will link to taskId later when saving
            setFormData(prev => ({
                ...prev,
                attachments: [...prev.attachments, attachmentMeta]
            }));
        } catch (err) {
            console.error("Failed to save attachment", err);
            alert("Failed to save attachment");
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const handleRemoveAttachment = async (id) => {
        await deleteAttachment(id);
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter(a => a.id !== id)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        if (taskToEdit) {
            updateTask(taskToEdit.id, formData);
        } else {
            addTask(formData);
        }
        onClose();
    };

    // Convert dates for input value mapping (YYYY-MM-DDTHH:MM)
    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        try {
            const d = new Date(dateString);
            return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        } catch { return ''; }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel animate-fade-in">
                <div className="modal-header">
                    <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
                    <button onClick={onClose} className="btn-ghost"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="What needs to be done?"
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Task Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="form-select">
                                <option value="personal">Personal</option>
                                <option value="work">Work</option>
                                <option value="project">Project Work</option>
                            </select>
                        </div>

                        {formData.type === 'project' && (
                            <div className="form-group flex-1 animate-fade-in">
                                <label>Project Name</label>
                                <input
                                    type="text"
                                    name="projectName"
                                    value={formData.projectName}
                                    onChange={handleChange}
                                    list="project-names"
                                    placeholder="e.g. Website Redesign"
                                    className="form-input"
                                />
                                <datalist id="project-names">
                                    {projectNames.map(name => <option key={name} value={name} />)}
                                </datalist>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Add details..."
                            className="form-textarea"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Start Time</label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>End Time</label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Subtasks</label>
                        <div className="subtask-input-row">
                            <input
                                type="text"
                                value={subtaskInput}
                                onChange={e => setSubtaskInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                                placeholder="Add a step..."
                                className="form-input"
                            />
                            <button type="button" onClick={handleAddSubtask} className="btn btn-secondary">
                                <Plus size={18} />
                            </button>
                        </div>
                        {formData.subtasks.length > 0 && (
                            <ul className="subtask-list">
                                {formData.subtasks.map(st => (
                                    <li key={st.id} className="subtask-item">
                                        <span>{st.title}</span>
                                        <button type="button" onClick={() => handleRemoveSubtask(st.id)} className="btn-ghost text-danger">
                                            <X size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Attachments</label>
                        <div className="attachment-upload">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                            <label htmlFor="file-upload" className="btn btn-secondary upload-btn">
                                <Paperclip size={18} /> {uploading ? 'Uploading...' : 'Attach File'}
                            </label>
                        </div>

                        {formData.attachments.length > 0 && (
                            <div className="attachment-list">
                                {formData.attachments.map(att => (
                                    <div key={att.id} className="attachment-item">
                                        <span className="attachment-name" title={att.name}>{att.name}</span>
                                        <button type="button" onClick={() => handleRemoveAttachment(att.id)} className="btn-ghost text-danger">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
