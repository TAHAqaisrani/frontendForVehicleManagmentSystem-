import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function TechnicianQueue() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ACTIVE FILTER
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    api
      .get(`/job-cards/technician/${user.id}`)
      .then((r) => setJobs(r.data))
      .finally(() => setLoading(false));
  }, [user.id]);

  // PRIORITY SORT
  const priorityOrder = [
    'in_service',
    'waiting_for_parts',
    'booked',
    'inspected',
    'ready_for_pickup',
    'returned_to_customer',
  ];

  // FILTERED + SORTED JOBS
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    if (activeFilter !== 'all') {
      filtered = jobs.filter(
        (j) => j.repair_status === activeFilter
      );
    }

    return [...filtered].sort(
      (a, b) =>
        priorityOrder.indexOf(a.repair_status) -
        priorityOrder.indexOf(b.repair_status)
    );
  }, [jobs, activeFilter]);

  // FILTER BUTTONS
  const filters = [
    {
      key: 'all',
      label: 'All Jobs',
    },
    {
      key: 'in_service',
      label: 'In Service',
    },
    {
      key: 'waiting_for_parts',
      label: 'Waiting Parts',
    },
    {
      key: 'inspected',
      label: 'Inspected',
    },
    {
      key: 'booked',
      label: 'Booked',
    },
    {
      key: 'ready_for_pickup',
      label: 'Ready Pickup',
    },
    {
      key: 'returned_to_customer',
      label: 'Returned',
    },
  ];

  return (
    <>
      <Navbar />

      <div className="page">
        {/* HEADER */}
        <div className="page-header">
          <h1 className="page-title">My Work Queue</h1>

          <span
            style={{
              color: 'var(--muted)',
              fontSize: '0.9rem',
            }}
          >
            {filteredJobs.length} active job
            {filteredJobs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* FILTER BUTTONS */}
        <div
          className="stats-grid"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit, minmax(160px, 1fr))',
            marginBottom: '24px',
          }}
        >
          {filters.map((filter) => {
            const count =
              filter.key === 'all'
                ? jobs.length
                : jobs.filter(
                    (j) =>
                      j.repair_status === filter.key
                  ).length;

            const isActive =
              activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                onClick={() =>
                  setActiveFilter(filter.key)
                }
                className="stat-card"
                style={{
                  cursor: 'pointer',
                  border: isActive
                    ? '1px solid var(--primary)'
                    : '1px solid rgba(255,255,255,0.06)',
                  background: isActive
                    ? 'rgba(16,185,129,0.08)'
                    : '',
                  transition: '0.25s ease',
                }}
              >
                <div
                  className="stat-label"
                  style={{
                    textTransform: 'capitalize',
                    color: isActive
                      ? 'var(--primary)'
                      : 'var(--muted)',
                    fontWeight: 700,
                  }}
                >
                  {filter.label}
                </div>

                <div
                  className="stat-value"
                  style={{
                    fontSize: '1.6rem',
                    color: isActive
                      ? 'var(--primary)'
                      : 'white',
                  }}
                >
                  {count}
                </div>
              </button>
            );
          })}
        </div>

        {/* LOADING */}
        {loading ? (
          <Loader />
        ) : filteredJobs.length === 0 ? (
          // EMPTY STATE
          <div className="card empty-state">
            <div className="empty-icon">🔧</div>

            <div className="empty-title">
              No jobs found
            </div>

            <div className="empty-desc">
              No work orders available in this
              category
            </div>
          </div>
        ) : (
          // JOB LIST
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {filteredJobs.map((j) => (
              <div
                key={j.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                {/* LEFT SIDE */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '6px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    >
                      {j.make} {j.model} {j.year}
                    </span>

                    <StatusBadge
                      status={j.repair_status}
                    />
                  </div>

                  <div
                    style={{
                      color: 'var(--muted)',
                      fontSize: '0.85rem',
                    }}
                  >
                    🔑 {j.license_plate}
                    &nbsp;·&nbsp; 👤{' '}
                    {j.customer_name}
                  </div>

                  <div
                    style={{
                      color: 'var(--muted)',
                      fontSize: '0.85rem',
                      marginTop: '4px',
                    }}
                  >
                    📋 {j.issue_description}
                  </div>

                  {j.package_name && (
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--primary)',
                        marginTop: '4px',
                      }}
                    >
                      📦 {j.package_name}
                    </div>
                  )}
                </div>

                {/* BUTTON */}
                <Link
                  to={`/technician/job/${j.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Update →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
