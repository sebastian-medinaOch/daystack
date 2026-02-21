import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskList from './TaskList';
import { FolderKanban } from 'lucide-react';

const ProjectsPage = ({ onEditTask, onViewTask }) => {
    const { getProjects, getProjectTasks } = useTasks();
    const projects = getProjects();
    const [selectedProject, setSelectedProject] = useState(projects[0] || null);

    const projectTasks = selectedProject ? getProjectTasks(selectedProject) : [];

    if (projects.length === 0) {
        return (
            <div className="page-content animate-fade-in">
                <h1>Projects</h1>
                <p>You haven't created any projects yet.</p>
                <div className="empty-state">
                    <div className="empty-icon"><FolderKanban size={32} /></div>
                    <h3>No Projects Found</h3>
                    <p>Create a task and assign it a "Project Name" to start a new project.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content animate-fade-in">
            <h1>Projects Overview</h1>
            <p>Manage your tasks grouped by projects.</p>

            <div className="projects-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px', marginTop: '32px' }}>

                {/* Project List Sidebar */}
                <div className="projects-sidebar glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)', alignSelf: 'start' }}>
                    <h3 style={{ marginBottom: '16px', paddingLeft: '8px', fontSize: '1.1rem' }}>Your Projects</h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {projects.map(project => (
                            <li key={project}>
                                <button
                                    onClick={() => setSelectedProject(project)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px 16px',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: selectedProject === project ? 'var(--primary-transparent)' : 'transparent',
                                        color: selectedProject === project ? 'var(--primary)' : 'var(--text-secondary)',
                                        fontWeight: selectedProject === project ? '600' : '500',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    {project}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Project Content */}
                <div className="project-content glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                        <h2>{selectedProject}</h2>
                        <span className="task-meta-tag" style={{ backgroundColor: 'var(--bg-card)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
                            {projectTasks.length} tasks
                        </span>
                    </div>

                    <TaskList tasks={projectTasks} onEditTask={onEditTask} onViewTask={onViewTask} />
                </div>

            </div>
        </div>
    );
};

export default ProjectsPage;
