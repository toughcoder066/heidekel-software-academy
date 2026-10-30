import { useState, useEffect } from 'react';
import { COURSES, type Cohort } from '../store';
import { type CohortFormData } from '../lib/cohort-context';

interface CohortFormProps {
  initialData?: Cohort;
  onSubmit: (data: CohortFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function CohortForm({ initialData, onSubmit, onCancel, isEditing = false }: CohortFormProps) {
  const [formData, setFormData] = useState<CohortFormData>({
    course_id: initialData?.course_id || COURSES[0]?.id || '',
    name: initialData?.name || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
    enrollment_deadline: initialData?.enrollment_deadline || '',
    capacity: initialData?.capacity || 50,
    status: initialData?.status || 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        course_id: initialData.course_id,
        name: initialData.name,
        start_date: initialData.start_date,
        end_date: initialData.end_date,
        enrollment_deadline: initialData.enrollment_deadline,
        capacity: initialData.capacity,
        status: initialData.status,
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.course_id) {
      newErrors.course_id = 'Course is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Cohort name is required';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }
    if (!formData.enrollment_deadline) {
      newErrors.enrollment_deadline = 'Enrollment deadline is required';
    }
    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    // Date validation
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end <= start) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    if (formData.enrollment_deadline && formData.start_date) {
      const deadline = new Date(formData.enrollment_deadline);
      const start = new Date(formData.start_date);
      if (deadline >= start) {
        newErrors.enrollment_deadline = 'Enrollment deadline must be before start date';
      }
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

  const updateField = <K extends keyof CohortFormData>(field: K, value: CohortFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Course Selection */}
      <div>
        <label htmlFor="course_id" className="block text-sm font-medium text-text-main mb-1.5">
          Course <span className="text-error">*</span>
        </label>
        <select
          id="course_id"
          value={formData.course_id}
          onChange={(e) => updateField('course_id', e.target.value)}
          disabled={isEditing}
          className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none disabled:bg-bg-light disabled:cursor-not-allowed"
        >
          <option value="">Select a course</option>
          {COURSES.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        {errors.course_id && <p className="mt-1 text-xs text-error">{errors.course_id}</p>}
      </div>

      {/* Cohort Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-main mb-1.5">
          Cohort Name <span className="text-error">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="e.g., Cohort 3 — September 2026"
          className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
        />
        {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-text-main mb-1.5">
            Start Date <span className="text-error">*</span>
          </label>
          <input
            type="date"
            id="start_date"
            value={formData.start_date}
            onChange={(e) => updateField('start_date', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
          />
          {errors.start_date && <p className="mt-1 text-xs text-error">{errors.start_date}</p>}
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-text-main mb-1.5">
            End Date <span className="text-error">*</span>
          </label>
          <input
            type="date"
            id="end_date"
            value={formData.end_date}
            onChange={(e) => updateField('end_date', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
          />
          {errors.end_date && <p className="mt-1 text-xs text-error">{errors.end_date}</p>}
        </div>

        <div>
          <label htmlFor="enrollment_deadline" className="block text-sm font-medium text-text-main mb-1.5">
            Enrollment Deadline <span className="text-error">*</span>
          </label>
          <input
            type="date"
            id="enrollment_deadline"
            value={formData.enrollment_deadline}
            onChange={(e) => updateField('enrollment_deadline', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
          />
          {errors.enrollment_deadline && <p className="mt-1 text-xs text-error">{errors.enrollment_deadline}</p>}
        </div>
      </div>

      {/* Capacity and Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-text-main mb-1.5">
            Capacity <span className="text-error">*</span>
          </label>
          <input
            type="number"
            id="capacity"
            value={formData.capacity}
            onChange={(e) => updateField('capacity', parseInt(e.target.value) || 0)}
            min="1"
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
          />
          {errors.capacity && <p className="mt-1 text-xs text-error">{errors.capacity}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-main mb-1.5">
            Status <span className="text-error">*</span>
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value as Cohort['status'])}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
          >
            <option value="draft">Draft</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
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
          {isEditing ? 'Update Cohort' : 'Create Cohort'}
        </button>
      </div>
    </form>
  );
}
