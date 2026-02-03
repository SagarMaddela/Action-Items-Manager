import { useState, useEffect, useCallback } from 'react';
import { actionsAPI } from '../services/api';
import { queueOfflineAction, getCachedActions, cacheActions, checkAndSync } from '../services/offlineSync';

export const useActionItems = () => {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Monitor online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Fetch actions
    const fetchActions = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);

        try {
            if (isOnline) {
                // Sync offline queue first
                await checkAndSync();

                // Fetch from server
                const response = await actionsAPI.getAll(filters);
                const fetchedActions = response.data.actions;
                setActions(fetchedActions);

                // Cache for offline use
                await cacheActions(fetchedActions);
            } else {
                // Load from cache when offline
                const cached = await getCachedActions();
                setActions(cached);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch actions');

            // Try loading from cache on error
            const cached = await getCachedActions();
            setActions(cached);
        } finally {
            setLoading(false);
        }
    }, [isOnline]);

    // Create action
    const createAction = async (actionData) => {
        try {
            if (isOnline) {
                const response = await actionsAPI.create(actionData);
                const newAction = response.data.action;
                setActions(prev => [newAction, ...prev]);
                return newAction;
            } else {
                // Queue for offline sync
                await queueOfflineAction({
                    operation: 'create',
                    data: actionData
                });

                // Add optimistically to local state
                const tempAction = {
                    ...actionData,
                    id: `temp_${Date.now()}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                setActions(prev => [tempAction, ...prev]);
                return tempAction;
            }
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Failed to create action');
        }
    };

    // Update action
    const updateAction = async (id, updateData) => {
        try {
            if (isOnline) {
                const response = await actionsAPI.update(id, updateData);
                const updatedAction = response.data.action;
                setActions(prev => prev.map(a => a.id === id ? updatedAction : a));
                return updatedAction;
            } else {
                // Queue for offline sync
                await queueOfflineAction({
                    operation: 'update',
                    actionId: id,
                    data: updateData
                });

                // Update optimistically
                setActions(prev => prev.map(a =>
                    a.id === id ? { ...a, ...updateData, updated_at: new Date().toISOString() } : a
                ));
            }
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Failed to update action');
        }
    };

    // Delete action
    const deleteAction = async (id) => {
        try {
            if (isOnline) {
                await actionsAPI.delete(id);
                setActions(prev => prev.filter(a => a.id !== id));
            } else {
                // Queue for offline sync
                await queueOfflineAction({
                    operation: 'delete',
                    actionId: id
                });

                // Delete optimistically
                setActions(prev => prev.filter(a => a.id !== id));
            }
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Failed to delete action');
        }
    };

    return {
        actions,
        loading,
        error,
        isOnline,
        fetchActions,
        createAction,
        updateAction,
        deleteAction
    };
};
