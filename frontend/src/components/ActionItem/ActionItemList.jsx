import { format } from 'date-fns';

export const ActionItemList = ({ actions, onEdit, onDelete }) => {
    if (actions.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3 className="empty-state-title">No actions found</h3>
                <p className="empty-state-text">Create your first action item to get started</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        try {
            return format(new Date(dateString), 'MMM d, yyyy h:mm a');
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <div className="action-list">
            {actions.map((action) => (
                <div key={action.id} className="action-item">
                    <div className="action-item-header">
                        <div>
                            <h3 className="action-item-title">{action.title}</h3>
                            <div className="action-item-meta">
                                <span className={`badge badge-type`}>{action.type}</span>
                                <span className={`badge badge-priority-${action.priority}`}>
                                    {action.priority}
                                </span>
                                <span className={`badge badge-status-${action.status}`}>
                                    {action.status.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {action.description && (
                        <p className="action-item-description">{action.description}</p>
                    )}

                    <div className="action-item-footer">
                        <span className="action-item-date">
                            Due: {formatDate(action.due_at)}
                        </span>
                        <div className="action-item-actions">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => onEdit(action)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => onDelete(action.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
