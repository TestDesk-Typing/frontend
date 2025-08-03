import React, { useEffect, useState } from 'react';
import './NoticeTable.css';

const NoticeTable = () => {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ image: null, linkUrl: '', displayText: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/getNoticeBox`);
      const data = await res.json();
      setNotices(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch notices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image || !form.linkUrl || !form.displayText) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', form.image);
      formData.append('linkUrl', form.linkUrl);
      formData.append('displayText', form.displayText);

      await fetch(`${process.env.REACT_APP_API_URL}/api/upsertNoticeWithImage`, {
        method: 'POST',
        body: formData,
      });

      setForm({ image: null, linkUrl: '', displayText: '' });
      fetchNotices();
      setError('');
    } catch (err) {
      setError('Failed to add notice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      setLoading(true);
      await fetch(`${process.env.REACT_APP_API_URL}/api/toggleNotice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchNotices();
    } catch (err) {
      setError('Failed to toggle status.');
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    try {
      setLoading(true);
      await fetch(`${process.env.REACT_APP_API_URL}/api/deleteNotice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchNotices();
    } catch (err) {
      setError('Failed to delete notice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notice-table-container">
      <h2>Manage Notices</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="notice-form">
        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            required
          />
        </div>
        <div className="form-group">
          <label>Link URL:</label>
          <input
            type="text"
            value={form.linkUrl}
            onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            placeholder="https://example.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Display Text:</label>
          <input
            type="text"
            value={form.displayText}
            onChange={(e) => setForm({ ...form, displayText: e.target.value })}
            placeholder="Special Notice!"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Notice'}
        </button>
      </form>

      {loading && notices.length === 0 ? (
        <p className="loading">Loading notices...</p>
      ) : notices.length === 0 ? (
        <p className="no-notices">No notices found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="notice-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Text</th>
                <th>URL</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n._id} className={n.isActive ? 'active-notice' : ''}>
                  <td>
                    <img src={`${process.env.REACT_APP_API_URL}/${n.imageUrl}`} alt="notice" className="notice-image" />
                  </td>
                  <td>{n.displayText}</td>
                  <td>
                    <a href={n.linkUrl} target="_blank" rel="noreferrer">
                      {n.linkUrl.length > 30 ? n.linkUrl.slice(0, 30) + '...' : n.linkUrl}
                    </a>
                  </td>
                  <td>
                    <button
                      className={`status-btn ${n.isActive ? 'active' : 'inactive'}`}
                      onClick={() => toggleStatus(n._id)}
                      disabled={loading}
                    >
                      {n.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteNotice(n._id)} disabled={loading}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NoticeTable;
