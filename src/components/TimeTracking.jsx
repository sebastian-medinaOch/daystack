import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

const TimeTracking = () => {
    const { tasks } = useTasks();

    // Calculate statistics based on startDate and endDate
    const calculateStats = () => {
        let totalMinutes = 0;
        let completedTimeTracked = 0;

        // Using a map to calculate time spent per project or work vs personal
        const timeByType = { personal: 0, work: 0, project: 0 };

        tasks.forEach(task => {
            if (task.startDate && task.endDate) {
                const start = new Date(task.startDate);
                const end = new Date(task.endDate);
                const diffInMinutes = Math.max(0, (end - start) / (1000 * 60));

                totalMinutes += diffInMinutes;
                timeByType[task.type] += diffInMinutes;

                if (task.completed) {
                    completedTimeTracked += diffInMinutes;
                }
            }
        });

        const formatHours = (mins) => (mins / 60).toFixed(1);

        return {
            totalHours: formatHours(totalMinutes),
            completedHours: formatHours(completedTimeTracked),
            personalHours: formatHours(timeByType.personal),
            workHours: formatHours(timeByType.work),
            projectHours: formatHours(timeByType.project),
            hasTimeData: totalMinutes > 0
        };
    };

    const stats = calculateStats();

    return (
        <div className="page-content animate-fade-in">
            <h1>Time Tracking & Analytics</h1>
            <p>Insights into the time dedicated to your tasks and projects.</p>

            {!stats.hasTimeData ? (
                <div className="empty-state" style={{ marginTop: '32px' }}>
                    <div className="empty-icon"><Clock size={32} /></div>
                    <h3>No Time Data Available</h3>
                    <p>Add "Start Time" and "End Time" to your tasks to see statistics here.</p>
                </div>
            ) : (
                <>
                    <div className="dashboard-stats" style={{ marginTop: '32px' }}>
                        <div className="stat-card glass-panel" style={{ background: 'linear-gradient(135deg, rgba(30,30,40,0.8), rgba(60,40,90,0.5))' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={18} /> Total Logged Time
                            </h3>
                            <div className="stat-value">{stats.totalHours} <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: '400' }}>hours</span></div>
                        </div>

                        <div className="stat-card glass-panel">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
                                <CheckCircle2 size={18} /> Completed Work Time
                            </h3>
                            <div className="stat-value text-success">{stats.completedHours} <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: '400' }}>hours</span></div>
                        </div>

                        <div className="stat-card glass-panel">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                                <TrendingUp size={18} /> Productivity Score
                            </h3>
                            <div className="stat-value" style={{ color: 'var(--primary)' }}>
                                {Math.round((stats.completedHours / Math.max(stats.totalHours, 1)) * 100)}%
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
                        <h2 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Time Distribution</h2>

                        <div className="distribution-bars">
                            {/* Type Category Bars */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Work</span>
                                    <span>{stats.workHours}h</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, (stats.workHours / Math.max(stats.totalHours, 1)) * 100)}%`, height: '100%', backgroundColor: 'var(--accent-work)', borderRadius: '4px' }}></div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Personal</span>
                                    <span>{stats.personalHours}h</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, (stats.personalHours / Math.max(stats.totalHours, 1)) * 100)}%`, height: '100%', backgroundColor: 'var(--accent-personal)', borderRadius: '4px' }}></div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Project Work</span>
                                    <span>{stats.projectHours}h</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, (stats.projectHours / Math.max(stats.totalHours, 1)) * 100)}%`, height: '100%', backgroundColor: 'var(--accent-project)', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default TimeTracking;
