import { useState } from 'react';
import { getErrorMessage } from '../services/api';

const EMPTY_FORM = { title: '', url: '', tag: '' };

const validate = ({ title, url }) => {
  const errors = {};

  if (!title.trim()) errors.title = 'Title is required';
  if (!url.trim()) {
    errors.url = 'URL is required';
  } else if (!/^https?:\/\/\S+$/i.test(url.trim())) {
    errors.url = 'URL must start with http:// or https://';
  }

  return errors;
};

export default function BookmarkForm({ editing, saving, onSubmit, onCancelEdit }) {
  // The form is mounted with a key based on the bookmark being edited, so
  // initialising from props is enough to prefill it when "Edit" is clicked.
  const [form, setForm] = useState(() =>
    editing ? { title: editing.title, url: editing.url, tag: editing.tag } : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await onSubmit({
        title: form.title.trim(),
        url: form.url.trim(),
        tag: form.tag.trim() || 'general',
      });

      // Only clear after the API call succeeds.
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (error) {
      setErrors({ form: getErrorMessage(error) });
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <div className="form__heading">
        <h2>{editing ? 'Edit bookmark' : 'Add a bookmark'}</h2>
        {editing && (
          <button type="button" className="link-button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>

      <label className="field">
        <span>Title</span>
        <input
          name="title"
          type="text"
          placeholder="React docs"
          value={form.title}
          onChange={handleChange}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <small className="field__error">{errors.title}</small>}
      </label>

      <label className="field">
        <span>URL</span>
        <input
          name="url"
          type="url"
          placeholder="https://react.dev"
          value={form.url}
          onChange={handleChange}
          aria-invalid={Boolean(errors.url)}
        />
        {errors.url && <small className="field__error">{errors.url}</small>}
      </label>

      <label className="field">
        <span>Tag</span>
        <input
          name="tag"
          type="text"
          placeholder="general"
          value={form.tag}
          onChange={handleChange}
        />
        <small className="field__hint">Optional — defaults to “general”.</small>
      </label>

      {errors.form && <p className="form__error">{errors.form}</p>}

      <button type="submit" className="button button--primary" disabled={saving}>
        {saving ? 'Saving…' : editing ? 'Save changes' : 'Add bookmark'}
      </button>
    </form>
  );
}
