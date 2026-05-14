const STEPS = ['booked','inspected','in_service','waiting_for_parts','ready_for_pickup','delivered'];
const LABELS = {
  booked:            { label: 'Booked',             icon: '📋' },
  inspected:         { label: 'Inspected',           icon: '🔍' },
  in_service:        { label: 'In Service',          icon: '🔧' },
  waiting_for_parts: { label: 'Waiting for Parts',   icon: '⏳' },
  ready_for_pickup:  { label: 'Ready for Pickup',    icon: '✅' },
  delivered:         { label: 'Delivered',           icon: '🎉' },
  returned_to_advisor:  { label: 'Returned to Advisor', icon: '👨‍💼' },
  returned_to_customer: { label: 'Returned to Customer',icon: '🤝' },
};

export default function RepairTimeline({ logs = [], currentStatus }) {
  const currentIdx = STEPS.indexOf(currentStatus);
  return (
    <div className="timeline">
      {STEPS.map((step, i) => {
        const isDone   = i < currentIdx;
        const isActive = i === currentIdx;
        const logEntry = logs.filter(l => l.status === step).pop();
        return (
          <div key={step} className="timeline-item">
            <div className="timeline-left">
              <div className={`timeline-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`} />
              <div className="timeline-line" />
            </div>
            <div className="timeline-content">
              <div className="flex gap-8" style={{ alignItems: 'center' }}>
                <span>{LABELS[step].icon}</span>
                <span className={`timeline-status ${isDone ? 'text-success' : isActive ? 'text-primary' : 'text-muted'}`}>
                  {LABELS[step].label}
                </span>
              </div>
              {logEntry && (
                <>
                  <div className="timeline-note">{logEntry.notes}</div>
                  <div className="timeline-time">
                    {logEntry.updated_by_name} · {new Date(logEntry.created_at).toLocaleString()}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
