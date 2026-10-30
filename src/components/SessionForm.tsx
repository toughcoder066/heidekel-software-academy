import { useState, useEffect } from 'react';
import { type Session } from '../store';
import { type SessionFormData } from '../lib/cohort-context';

interface SessionFormProps {
  initialData?: Session;
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function SessionForm({ initialData, onSubmit, onCancel, isEditing = false }: SessionFormProps) {
  const [formData, setFormData] = useState<SessionFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    starts_at: initialData?.starts_at ? initialData.starts_at.slice(0, 16) : '',
    ends_at: initialData?.ends_at ? initialData.ends_at.slice(0, 16) : '',
    meeting_url: initialData?.meeting_url || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        starts_at: initialData.starts_at.slice(0, 16),
        ends_at: initialData.ends_at.slice(0, 16),
        meeting_url: initialData.meeting_url || '',
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required';
    }
    if (!formData.starts_at) {
      newErrors.starts_at = 'Start time is required';
    }
    if (!formData.ends_at) {
      newErrors.ends_at = 'End time is required';
    }

    // Time validation
    if (formData.starts_at && formData.ends_at) {
      const start = new Date(formData.starts_at);
      const end = new Date(formData.ends_at);
      if (end <= start) {
        newErrors.ends_at = 'End time must be after start time';
      }
    }

    // URL validation
    if (formData.meeting_url && !formData.meeting_url.match(/^https?:\/\/.+/)) {
      newErrors.meeting_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const updateField = <K extends keyof SessionFormData>(field: K, value: SessionFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-main mb-1.5">
          Session Title <span className="text-error">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g., Introduction to Prompt Engineering"
          className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
        />
        {errors.title && <p className="mt-1 text-xs text-error">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-main mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Brief description of what this session covers..."
          rows={3}
          className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none resize-none"
        />
      </div>

      {/* Date/Time Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="starts_at" className="block text-sm font-medium text-text-main mb-1.5">
            Start Time <span className="text-error">*</span>
          </label>
          <input
            type="datetime-local"
            id="starts_at"
            value={formData.starts_at}
            onChange={(e) => updateField('starts_at', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
          />
          {errors.starts_at && <p className="mt-1 text-xs text-error">{errors.starts_at}</p>}
        </div>

        <div>
          <label htmlFor="ends_at" className="block text-sm font-medium text-text-main mb-1.5">
            End Time <span className="text-error">*</span>
          </label>
          <input
            type="datetime-local"
            id="ends_at"
            value={formData.ends_at}
            onChange={(e) => updateField('ends_at', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
          />
          {errors.ends_at && <p className="mt-1 text-xs text-error">{errors.ends_at}</p>}
        </div>
      </div>

      {/* Meeting URL */}
      <div>
        <label htmlFor="meeting_url" className="block text-sm font-medium text-text-main mb-1.5">
          Meeting URL
        </label>
        <input
          type="url"
          id="meeting_url"
          value={formData.meeting_url}
          onChange={(e) => updateField('meeting_url', e.target.value)}
          placeholder="https://meet.google.com/..."
          className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
        />
        {errors.meeting_url && <p className="mt-1 text-xs text-error">{errors.meeting_url}</p>}
        <p className="mt-1 text-xs text-text-secondary">Optional. Leave blank if not yet scheduled.</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-main transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
        >
          {isEditing ? 'Update Session' : 'Add Session'}
        </button>
      </div>
    </form>
  );
}
