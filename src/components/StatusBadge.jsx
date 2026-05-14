const LABELS = {
  booked:            'Booked',
  inspected:         'Inspected',
  in_service:        'In Service',
  waiting_for_parts: 'Waiting for Parts',
  ready_for_pickup:  'Ready for Pickup',
  delivered:         'Delivered',
  pending:           'Pending',
  confirmed:         'Confirmed',
  cancelled:         'Cancelled',
  paid:              'Paid',
  unpaid:            'Unpaid',
  returned_to_advisor:  'Returned to Advisor',
  returned_to_customer: 'Returned to Customer',
};

const STYLES = {
  booked:            'bg-primary/10 text-primary border-primary/20',
  inspected:         'bg-info/10 text-info border-info/20',
  in_service:        'bg-warning/10 text-warning border-warning/20',
  waiting_for_parts: 'bg-danger/10 text-danger border-danger/20',
  ready_for_pickup:  'bg-success/10 text-success border-success/20',
  delivered:         'bg-success text-black border-transparent',
  pending:           'bg-muted/10 text-muted border-muted/20',
  confirmed:         'bg-success/10 text-success border-success/20',
  cancelled:         'bg-danger/10 text-danger border-danger/20',
  paid:              'bg-success text-black border-transparent',
  unpaid:            'bg-danger/10 text-danger border-danger/20',
  returned_to_advisor:  'bg-accent/10 text-accent border-accent/20',
  returned_to_customer: 'bg-info/10 text-info border-info/20',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`
      px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border
      transition-all duration-300 backdrop-blur-md
      ${STYLES[status] || 'bg-white/5 text-white border-white/10'}
    `}>
      {LABELS[status] || status}
    </span>
  );
}
