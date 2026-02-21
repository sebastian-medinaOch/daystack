import React, { createContext, useState, useEffect, useContext } from 'react';
import { getTasks, saveTasks } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';

export const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load initially
    useEffect(() => {
        const loadTasks = async () => {
            const savedTasks = await getTasks();
            setTasks(savedTasks);
            setLoading(false);
        };
        loadTasks();
    }, []);

    // Save on every change
    useEffect(() => {
        if (!loading) {
            saveTasks(tasks);
        }
    }, [tasks, loading]);

    const addTask = (taskData) => {
        const newTask = {
            id: uuidv4(),
            ...taskData,
            completed: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            subtasks: taskData.subtasks || [],
            attachments: taskData.attachments || [] // Note: list of attachment metadata, not files
        };
        setTasks(prev => [newTask, ...prev]);
        return newTask;
    };

    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
        ));
    };

    const toggleTaskCompletion = (id) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
        ));
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    // Useful derived state
    const getTasksByType = (type) => tasks.filter(t => t.type === type);
    const getProjects = () => {
        const projectNames = tasks
            .filter(t => t.type === 'project' && t.projectName)
            .map(t => t.projectName);
        return [...new Set(projectNames)]; // Unique project names
    };

    const getProjectTasks = (projectName) =>
        tasks.filter(t => t.type === 'project' && t.projectName === projectName);

    return (
        <TaskContext.Provider value={{
            tasks,
            loading,
            addTask,
            updateTask,
            deleteTask,
            toggleTaskCompletion,
            getTasksByType,
            getProjects,
            getProjectTasks
        }}>
            {children}
        </TaskContext.Provider>
    );
};
