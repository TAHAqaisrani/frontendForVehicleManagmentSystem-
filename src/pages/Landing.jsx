import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';

export default function TechnicianQueue({ jobs = [] }) {

  // ACTIVE FILTER
  const [activeFilter, setActiveFilter] = useState('all');

  // FILTERED JOBS
  const filteredJobs = useMemo(() => {
    if (activeFilter === 'all') return jobs;

    return jobs.filter(
      (job) =>
        job.repair_status?.toLowerCase() === activeFilter
    );
  }, [jobs, activeFilter]);

  // STATUS COUNTS
  const statusCounts = {
    all: jobs.length,

    in_service: jobs.filter(
      (j) => j.repair_status === 'in_service'
    ).length,

    waiting_parts: jobs.filter(
      (j) => j.repair_status === 'waiting_parts'
    ).length,

    inspected: jobs.filter(
      (j) => j.repair_status === 'inspected'
    ).length,

    booked: jobs.filter(
      (j) => j.repair_status === 'booked'
    ).length,

    ready_for_pickup: jobs.filter(
      (j) => j.repair_status === 'ready_for_pickup'
    ).length,

    returned_to_customer: jobs.filter(
      (j) => j.repair_status === 'returned_to_customer'
    ).length,
  };

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
      key: 'waiting_parts',
      label: 'Waiting For Parts',
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
      label: 'Ready For Pickup',
    },
    {
      key: 'returned_to_customer',
      label: 'Returned To Customer',
    },
  ];

  return (
    <>
      <Navbar />

      <div className="page">

        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h1 className="page-title">My Work Queue</h1>

          <div
            style={{
              color: 'var(--muted)',
              fontWeight: 600,
            }}
          >
            {filteredJobs.length} active jobs
          </div>
        </div>

        {/* FILTER BUTTONS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {filters.map((filter) => {
            const isActive =
              activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                onClick={() =>
                  setActiveFilter(filter.key)
                }
                style={{
                  padding: '24px',
                  borderRadius: '24px',
                  border: isActive
                    ? '1px solid #31d0aa'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: isActive
                    ? 'rgba(49,208,170,0.12)'
                    : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: '0.3s ease',
                  color: 'white',
                }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: isActive
                      ? '#31d0aa'
                      : 'var(--muted)',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                  }}
                >
                  {filter.label}
                </div>

                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                  }}
                >
                  {statusCounts[filter.key]}
                </div>
              </button>
            );
          })}
        </div>

        {/* JOB CARDS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  padding: '28px',
                }}
              >
                {/* LEFT */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                      marginBottom: '10px',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: 800,
                      }}
                    >
                      {job.make} {job.model}{' '}
                      {job.year}
                    </h2>

                    <StatusBadge
                      status={job.repair_status}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      color: 'var(--muted)',
                    }}
                  >
                    <div>
                      🔑 {job.license_plate} · 👤{' '}
                      {job.customer_name}
                    </div>

                    <div>
                      📋 {job.issue_description}
                    </div>

                    <div>
                      📦 {job.service_type}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div>
                  <Link
                    to={`/technician/job/${job.id}`}
                    className="btn btn-primary"
                  >
                    Update →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '50px',
                color: 'var(--muted)',
                fontWeight: 600,
              }}
            >
              No jobs found in this category
            </div>
          )}
        </div>
      </div>
    </>
  );
}
