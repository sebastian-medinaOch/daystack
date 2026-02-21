import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

localforage.config({
    name: 'DayStackApp',
    storeName: 'tasks_store'
});

export const getTasks = async () => {
    const tasks = await localforage.getItem('tasks');
    return tasks || [];
};

export const saveTasks = async (tasks) => {
    await localforage.setItem('tasks', tasks);
};

export const saveAttachment = async (taskId, file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const attachmentId = uuidv4();
            const attachment = {
                id: attachmentId,
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result // Base64 data URL
            };
            // Store actual data separately
            await localforage.setItem(`attachment_${attachmentId}`, attachment);
            resolve({
                id: attachmentId,
                name: file.name,
                type: file.type,
                size: file.size
            });
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

export const getAttachment = async (attachmentId) => {
    return await localforage.getItem(`attachment_${attachmentId}`);
};

export const deleteAttachment = async (attachmentId) => {
    await localforage.removeItem(`attachment_${attachmentId}`);
};
