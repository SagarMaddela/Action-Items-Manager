import localforage from 'localforage';
import { actionsAPI } from './api';

// Configure localforage
const offlineQueue = localforage.createInstance({
    name: 'apogee',
    storeName: 'offline_queue'
});

const cachedActions = localforage.createInstance({
    name: 'apogee',
    storeName: 'cached_actions'
});

/**
 * Queue an action for offline sync
 */
export const queueOfflineAction = async (action) => {
    const queue = await getOfflineQueue();
    queue.push({
        ...action,
        timestamp: Date.now(),
        id: `temp_${Date.now()}_${Math.random()}`
    });
    await offlineQueue.setItem('queue', queue);
};

/**
 * Get offline queue
 */
export const getOfflineQueue = async () => {
    const queue = await offlineQueue.getItem('queue');
    return queue || [];
};

/**
 * Clear offline queue
 */
export const clearOfflineQueue = async () => {
    await offlineQueue.removeItem('queue');
};

/**
 * Cache actions locally
 */
export const cacheActions = async (actions) => {
    await cachedActions.setItem('actions', actions);
    await cachedActions.setItem('lastSync', Date.now());
};

/**
 * Get cached actions
 */
export const getCachedActions = async () => {
    return await cachedActions.getItem('actions') || [];
};

/**
 * Sync offline queue with server
 */
export const syncOfflineQueue = async () => {
    if (!navigator.onLine) {
        console.log('⚠️  Offline - skipping sync');
        return { success: false, message: 'Offline' };
    }

    const queue = await getOfflineQueue();

    if (queue.length === 0) {
        return { success: true, synced: 0 };
    }

    console.log(`🔄 Syncing ${queue.length} offline actions...`);

    const results = [];

    for (const item of queue) {
        try {
            if (item.operation === 'create') {
                await actionsAPI.create(item.data);
            } else if (item.operation === 'update') {
                await actionsAPI.update(item.actionId, item.data);
            } else if (item.operation === 'delete') {
                await actionsAPI.delete(item.actionId);
            }
            results.push({ success: true, item });
        } catch (error) {
            console.error('Sync error:', error);
            results.push({ success: false, item, error });
        }
    }

    // Clear queue after sync
    await clearOfflineQueue();

    const successCount = results.filter(r => r.success).length;
    console.log(`✅ Synced ${successCount}/${queue.length} actions`);

    return {
        success: true,
        synced: successCount,
        failed: queue.length - successCount
    };
};

/**
 * Check if online and sync
 */
export const checkAndSync = async () => {
    if (navigator.onLine) {
        return await syncOfflineQueue();
    }
    return { success: false, message: 'Offline' };
};

// Listen for online event
window.addEventListener('online', () => {
    console.log('🌐 Back online - syncing...');
    checkAndSync();
});

window.addEventListener('offline', () => {
    console.log('📴 Offline mode activated');
});
