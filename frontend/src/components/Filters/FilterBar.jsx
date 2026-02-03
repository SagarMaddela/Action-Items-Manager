import { useState } from 'react';

export const FilterBar = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        type: '',
        sortBy: 'created_at',
        sortOrder: 'DESC'
    });

    const handleChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            status: '',
            priority: '',
            type: '',
            sortBy: 'created_at',
            sortOrder: 'DESC'
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="filter-bar">
            <div className="filter-row">
                <div className="filter-item">
                    <label className="form-label">Search</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search actions..."
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <label className="form-label">Status</label>
                    <select
                        className="form-select"
                        value={filters.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label className="form-label">Priority</label>
                    <select
                        className="form-select"
                        value={filters.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label className="form-label">Type</label>
                    <select
                        className="form-select"
                        value={filters.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="reminder">Reminder</option>
                        <option value="email">Email</option>
                        <option value="calendar">Calendar</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label className="form-label">Sort By</label>
                    <select
                        className="form-select"
                        value={filters.sortBy}
                        onChange={(e) => handleChange('sortBy', e.target.value)}
                    >
                        <option value="created_at">Created Date</option>
                        <option value="due_at">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label className="form-label">Order</label>
                    <select
                        className="form-select"
                        value={filters.sortOrder}
                        onChange={(e) => handleChange('sortOrder', e.target.value)}
                    >
                        <option value="DESC">Descending</option>
                        <option value="ASC">Ascending</option>
                    </select>
                </div>
            </div>

            <div className="mt-md">
                <button className="btn btn-secondary btn-sm" onClick={handleReset}>
                    Reset Filters
                </button>
            </div>
        </div>
    );
};
