import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const STEPS = ['Service', 'Date', 'Time', 'Review', 'Payment', 'Confirm'];
const PAYMENT_METHODS = [
  { value: 'PayAtSalon', label: 'Pay at Salon' },
  { value: 'JazzCash', label: 'JazzCash' },
  { value: 'Easypaisa', label: 'Easypaisa' },
  { value: 'BankTransfer', label: 'Bank Transfer' },
  { value: 'Card', label: 'Card / Online Payment' },
];

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function Booking() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [time, setTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PayAtSalon');
  const [couponCode, setCouponCode] = useState('');
  const [couponInfo, setCouponInfo] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get('/services').then((res) => {
      setServices(res.data.services);
      const preselectId = location.state?.serviceId;
      if (preselectId) {
        const svc = res.data.services.find((s) => s._id === preselectId);
        if (svc) setSelectedService(svc);
      }
    });
  }, [location.state]);

  useEffect(() => {
    if (!selectedService || !date) return;
    setSlots([]);
    setTime('');
    api
      .get('/bookings/availability', { params: { date, serviceId: selectedService._id } })
      .then((res) => setSlots(res.data.slots))
      .catch((err) => setError(getErrorMessage(err)));
  }, [selectedService, date]);

  if (!user) {
    return (
      <div className="section text-center max-w-md">
        <h1 className="section-title">Login Required</h1>
        <p className="text-onyx/60 dark:text-white/60 mb-6">Please log in to book an appointment.</p>
        <button onClick={() => navigate('/login', { state: { from: location } })} className="btn-gold">
          Go to Login
        </button>
      </div>
    );
  }

  const discount = couponInfo
    ? couponInfo.type === 'percentage'
      ? Math.min(Math.round((selectedService.price * couponInfo.value) / 100), selectedService.price)
      : Math.min(couponInfo.value, selectedService.price)
    : 0;
  const finalPrice = selectedService ? selectedService.price - discount : 0;

  async function applyCoupon() {
    setError('');
    try {
      const res = await api.post('/coupons/validate', { code: couponCode });
      setCouponInfo(res.data.coupon);
      toast.success('Coupon applied!');
    } catch (err) {
      setCouponInfo(null);
      setError(getErrorMessage(err));
    }
  }

  async function handleConfirm() {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/bookings', {
        serviceId: selectedService._id,
        date,
        time,
        paymentMethod,
        couponCode: couponInfo ? couponCode : undefined,
        notes,
      });
      setResult(res.data.booking);
      toast.success('Booking created!');
    } catch (err) {
      setError(getErrorMessage(err));
      // If the slot got taken, bounce back to the time step and refresh slots.
      if (err.response?.status === 409) {
        setStep(2);
        api.get('/bookings/availability', { params: { date, serviceId: selectedService._id } }).then((r) => setSlots(r.data.slots));
      }
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="section max-w-lg text-center">
        <div className="w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto mb-4 text-3xl">&#10003;</div>
        <h1 className="section-title">Booking Successful</h1>
        <div className="card p-6 text-left space-y-2 mt-6">
          <p><span className="text-onyx/50 dark:text-white/50">Booking ID:</span> <strong>{result.bookingId}</strong></p>
          <p><span className="text-onyx/50 dark:text-white/50">Service:</span> {result.serviceName}</p>
          <p><span className="text-onyx/50 dark:text-white/50">Date:</span> {result.date}</p>
          <p><span className="text-onyx/50 dark:text-white/50">Time:</span> {result.time}</p>
          <p><span className="text-onyx/50 dark:text-white/50">Status:</span> <span className="text-gold font-semibold">{result.status}</span></p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-gold mt-8">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="section max-w-2xl">
      <h1 className="section-title text-center mb-8">Book an Appointment</h1>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10 overflow-x-auto gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-col items-center flex-1 min-w-[70px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i <= step ? 'bg-gold border-gold text-onyx' : 'border-gold/30 text-onyx/40 dark:text-white/40'}`}>
              {i + 1}
            </div>
            <p className={`text-[11px] mt-1 text-center ${i <= step ? 'text-gold' : 'text-onyx/40 dark:text-white/40'}`}>{s}</p>
          </div>
        ))}
      </div>

      <ErrorMessage message={error} />

      <div className="card p-6">
        {step === 0 && (
          <div>
            <h2 className="font-semibold mb-4">Select a Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {services.map((s) => (
                <button
                  key={s._id}
                  onClick={() => setSelectedService(s)}
                  className={`text-left p-4 rounded-lg border transition-colors ${selectedService?._id === s._id ? 'border-gold bg-gold/10' : 'border-gold/20 hover:border-gold/50'}`}
                >
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-onyx/50 dark:text-white/50">{s.category} &middot; {s.duration} min</p>
                  <p className="text-gold font-semibold mt-1">Rs. {s.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-semibold mb-4">Select a Date</h2>
            <input
              type="date"
              min={todayStr()}
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-semibold mb-4">Select an Available Time</h2>
            {slots.length === 0 ? (
              <p className="text-onyx/50 dark:text-white/50 text-sm">No available time slots for this date. Please choose another date.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`py-2 rounded-lg border text-sm transition-colors ${time === t ? 'border-gold bg-gold/10 text-gold font-semibold' : 'border-gold/20 hover:border-gold/50'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-semibold mb-4">Review Your Booking</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-onyx/50 dark:text-white/50">Service:</span> {selectedService?.name}</p>
              <p><span className="text-onyx/50 dark:text-white/50">Date:</span> {date}</p>
              <p><span className="text-onyx/50 dark:text-white/50">Time:</span> {time}</p>
              <p><span className="text-onyx/50 dark:text-white/50">Price:</span> Rs. {selectedService?.price}</p>
            </div>
            <div className="mt-4">
              <label className="label">Coupon Code (optional)</label>
              <div className="flex gap-2">
                <input className="input-field" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <button type="button" onClick={applyCoupon} className="btn-outline !px-4 whitespace-nowrap">Apply</button>
              </div>
              {couponInfo && <p className="text-xs text-gold mt-1">Coupon applied: -Rs. {discount}</p>}
            </div>
            <div className="mt-4">
              <label className="label">Notes (optional)</label>
              <textarea className="input-field" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-semibold mb-4">Select Payment Method</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${paymentMethod === m.value ? 'border-gold bg-gold/10' : 'border-gold/20'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} />
                  {m.label}
                </label>
              ))}
            </div>
            {paymentMethod !== 'PayAtSalon' && (
              <p className="text-xs text-onyx/50 dark:text-white/50 mt-3">
                Your payment will be marked as pending until manually verified by the salon.
              </p>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="font-semibold mb-4">Confirm Your Booking</h2>
            <div className="space-y-2 text-sm mb-4">
              <p><span className="text-onyx/50 dark:text-white/50">Service:</span> {selectedService?.name}</p>
              <p><span className="text-onyx/50 dark:text-white/50">Date:</span> {date}</p>
              <p><span className="text-onyx/50 dark:text-white/50">Time:</span> {time}</p>
              <p><span className="text-onyx/50 dark:text-white/50">Payment Method:</span> {PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label}</p>
              <p><span className="text-onyx/50 dark:text-white/50">Total:</span> <span className="text-gold font-bold">Rs. {finalPrice}</span></p>
            </div>
            <button onClick={handleConfirm} disabled={loading} className="btn-gold w-full disabled:opacity-60">
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-outline !px-5 !py-2 text-sm disabled:opacity-40"
          >
            Back
          </button>
          {step < 5 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={
                (step === 0 && !selectedService) ||
                (step === 1 && !date) ||
                (step === 2 && !time)
              }
              className="btn-gold !px-5 !py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
