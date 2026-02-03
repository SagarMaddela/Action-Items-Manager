import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useActionItems } from '../../hooks/useActionItems';
import { FilterBar } from '../Filters/FilterBar';
import { ActionItemList } from '../ActionItem/ActionItemList';
import { ActionItemForm } from '../ActionItem/ActionItemForm';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const { actions, loading, error, isOnline, fetchActions, createAction, updateAction, deleteAction } = useActionItems();
    const [showForm, setShowForm] = useState(false);
    const [editingAction, setEditingAction] = useState(null);
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchActions(filters);
    }, [fetchActions, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleCreateNew = () => {
        setEditingAction(null);
        setShowForm(true);
    };

    const handleEdit = (action) => {
        setEditingAction(action);
        setShowForm(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingAction) {
                await updateAction(editingAction.id, formData);
            } else {
                await createAction(formData);
            }
            setShowForm(false);
            setEditingAction(null);
            fetchActions(filters);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this action?')) {
            try {
                await deleteAction(id);
                fetchActions(filters);
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="page">
            <header className="header">
                <h1 className="header-title">Apogee</h1>
                <div className="header-actions">
                    {!isOnline && (
                        <span className="badge" style={{ background: '#ffc107', color: '#000' }}>
                            Offline
                        </span>
                    )}
                    <span className="text-muted">{user?.email}</span>
                    <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="container">
                {!showForm && (
                    <>
                        <div className="flex-between mb-lg">
                            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>
                                Action Items
                            </h2>
                            <button className="btn btn-primary" onClick={handleCreateNew}>
                                + New Action
                            </button>
                        </div>

                        <FilterBar onFilterChange={handleFilterChange} />

                        {error && (
                            <div className="card" style={{ background: '#f8d7da', borderColor: '#f5c6cb', marginBottom: 'var(--spacing-lg)' }}>
                                <p style={{ color: '#721c24', margin: 0 }}>{error}</p>
                            </div>
                        )}

                        {loading ? (
                            <div className="loading">Loading actions...</div>
                        ) : (
                            <ActionItemList
                                actions={actions}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </>
                )}

                {showForm && (
                    <ActionItemForm
                        action={editingAction}
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingAction(null);
                        }}
                    />
                )}
            </main>
        </div>
    );
};
