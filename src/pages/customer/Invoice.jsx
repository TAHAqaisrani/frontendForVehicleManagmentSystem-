import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios.js';
import Navbar from '../../components/Navbar.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import Loader from '../../components/Loader.jsx';

export default function Invoice() {
  const { jobCardId } = useParams();
  const [invoice, setInvoice]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [paying, setPaying]     = useState(false);
  const [method, setMethod]     = useState('card');
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const load = () => api.get(`/invoices/${jobCardId}`).then(r => setInvoice(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, [jobCardId]);

  const handlePay = async () => {
    setPaying(true); setError('');
    try {
      await api.post('/invoices/pay', { job_card_id: parseInt(jobCardId), payment_method: method });
      setSuccess(true);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    } finally { setPaying(false); }
  };

  if (loading) return <><Navbar /><Loader /></>;
  if (!invoice) return <><Navbar /><div className="page"><div className="alert alert-error">Invoice not found</div></div></>;

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth: '600px' }}>
        <div className="page-header">
          <h1 className="page-title">Invoice #{invoice.id}</h1>
          <StatusBadge status={invoice.payment_status} />
        </div>

        {success && <div className="alert alert-success">✅ Payment successful! Thank you.</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-title">🚗 Vehicle & Service</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Vehicle</span>
              <span style={{ fontWeight: 600 }}>{invoice.make} {invoice.model} — {invoice.license_plate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Package</span>
              <span>{invoice.package_name || 'Custom Service'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Issue</span>
              <span style={{ textAlign: 'right', maxWidth: '60%' }}>{invoice.issue_description}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Repair Status</span>
              <StatusBadge status={invoice.repair_status} />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="card-title">💰 Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Subtotal</span>
              <span>${parseFloat(invoice.subtotal).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Tax (10%)</span>
              <span>${parseFloat(invoice.tax).toFixed(2)}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>${parseFloat(invoice.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {invoice.payment_status === 'unpaid' ? (
          <div className="card">
            <div className="card-title">💳 Payment</div>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select className="form-select" value={method} onChange={e => setMethod(e.target.value)}>
                <option value="card">💳 Credit / Debit Card</option>
                <option value="cash">💵 Cash</option>
                <option value="online">🌐 Online Transfer</option>
              </select>
            </div>
            <button className="btn btn-success btn-lg" style={{ width: '100%', justifyContent: 'center' }}
              disabled={paying} onClick={handlePay}>
              {paying ? 'Processing…' : `✅ Pay $${parseFloat(invoice.total).toFixed(2)}`}
            </button>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>Payment Complete</div>
            <div style={{ color: 'var(--muted)' }}>Paid via {invoice.payment_method} on {new Date(invoice.paid_at).toLocaleDateString()}</div>
          </div>
        )}
      </div>
    </>
  );
}
