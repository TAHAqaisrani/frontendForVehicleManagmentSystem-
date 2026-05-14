import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/bookings').then(r => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">My Bookings</h1>
          <Link to="/customer/book" className="btn btn-primary">➕ New Booking</Link>
        </div>
        {loading ? <Loader /> : bookings.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">No bookings yet</div>
            <div className="empty-desc">Book your first service to get started</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Vehicle</th><th>Issue</th><th>Date</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ color: 'var(--muted)' }}>#{b.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.make} {b.model}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{b.license_plate}</div>
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.issue_description}</td>
                    <td>{new Date(b.preferred_date).toLocaleDateString()}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      {b.status === 'confirmed' && (
                        <Link to={`/customer/track/${b.id}`} className="btn btn-outline btn-sm">Track</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
