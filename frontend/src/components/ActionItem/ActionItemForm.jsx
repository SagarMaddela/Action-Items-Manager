import { useState, useEffect } from 'react';

export const ActionItemForm = ({ action, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        type: 'reminder',
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        due_at: '',
        metadata: {}
    });

    useEffect(() => {
        if (action) {
            setFormData({
                type: action.type || 'reminder',
                title: action.title || '',
                description: action.description || '',
                priority: action.priority || 'medium',
                status: action.status || 'pending',
                due_at: action.due_at ? action.due_at.substring(0, 16) : '',
                metadata: action.metadata || {}
            });
        }
    }, [action]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleMetadataChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            metadata: { ...prev.metadata, [key]: value }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            ...formData,
            due_at: formData.due_at ? new Date(formData.due_at).toISOString() : null
        };

        onSubmit(submitData);
    };

    return (
        <div className="card">
            <h2 className="card-title">{action ? 'Edit Action' : 'Create Action'}</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-2">
                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <select
                            className="form-select"
                            value={formData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            required
                        >
                            <option value="reminder">Reminder</option>
                            <option value="email">Email</option>
                            <option value="calendar">Calendar</option>
                            <option value="priority">Priority Task</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <select
                            className="form-select"
                            value={formData.priority}
                            onChange={(e) => handleChange('priority', e.target.value)}
                            required
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-textarea"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>

                <div className="grid grid-2">
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            required
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            value={formData.due_at}
                            onChange={(e) => handleChange('due_at', e.target.value)}
                        />
                    </div>
                </div>

                {/* Type-specific metadata fields */}
                {formData.type === 'email' && (
                    <div className="form-group">
                        <label className="form-label">Email Recipient</label>
                        <input
                            type="email"
                            className="form-input"
                            value={formData.metadata.email_to || ''}
                            onChange={(e) => handleMetadataChange('email_to', e.target.value)}
                            placeholder="recipient@example.com"
                        />
                    </div>
                )}

                {formData.type === 'calendar' && (
                    <div className="form-group">
                        <label className="form-label">Calendar Location</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.metadata.calendar_location || ''}
                            onChange={(e) => handleMetadataChange('calendar_location', e.target.value)}
                            placeholder="Meeting room or address"
                        />
                    </div>
                )}

                <div className="flex gap-md mt-lg">
                    <button type="submit" className="btn btn-primary">
                        {action ? 'Update' : 'Create'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
