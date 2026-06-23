import React, { useState } from 'react';
import { Banknote, CheckCircle, Copy, Landmark, QrCode, Wallet } from 'lucide-react';
import { Button } from './ui/Button';

const PaymentQr = ({ amount, bookingId }) => {
  const qrUrl = `https://img.vietqr.io/image/VCB-1025776720-compact.png?amount=${amount}&addInfo=${encodeURIComponent(bookingId)}&accountName=NTDFILM%20CINEMA`;

  return (
    <div className="rounded-2xl border border-gray-250 border-gray-200 bg-white p-3 shadow-sm flex flex-col items-center gap-1.5 transition duration-300 hover:scale-105">
      <img
        src={qrUrl}
        alt="VietQR Payment"
        className="h-40 w-40 object-contain rounded-lg"
      />
      <span className="text-[10px] font-bold text-gray-650 text-gray-500 tracking-wider uppercase">
        VietQR - Napas247
      </span>
    </div>
  );
};

export const BookingPaymentPanel = ({ booking, onSubmit, submitting }) => {
  const [method, setMethod] = useState('online');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    await onSubmit({
      method,
      phone,
      address,
    });
  };

  const copyBankInfo = async () => {
    const text = `VCB 1025776720 NTDFILM ${booking.id}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 rounded-3xl border border-primary-200 bg-primary-50/30 p-5">
      <div className="flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          onClick={() => setMethod('online')}
          className={`flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition duration-200 cursor-pointer ${
            method === 'online'
              ? 'border-primary-600 bg-primary-100/50 font-medium'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <QrCode className="h-5 w-5 text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900">Online Transfer</p>
            <p className="text-xs text-gray-500">Scan VietQR and transfer instantly</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMethod('direct')}
          className={`flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition duration-200 cursor-pointer ${
            method === 'direct'
              ? 'border-primary-600 bg-primary-100/50 font-medium'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <Banknote className="h-5 w-5 text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900">Direct Payment (Cash)</p>
            <p className="text-xs text-gray-500">Save details and pay at counter</p>
          </div>
        </button>
      </div>

      {method === 'online' ? (
        <div className="mt-5 grid gap-5 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[200px,1fr]">
          <div className="flex items-center justify-center">
            <PaymentQr amount={booking.totalAmount} bookingId={booking.id} />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-600 font-bold">
                <Wallet className="h-4 w-4" />
                Bank Transfer Details
              </div>
              <div className="mt-3 space-y-2 text-sm text-gray-650 text-gray-600">
                <p className="flex items-center gap-2 font-medium text-gray-900">
                  <Landmark className="h-4 w-4 text-primary-600" />
                  Vietcombank - NTDFILM CINEMA
                </p>
                <p>
                  Account Number:{' '}
                  <span className="font-mono font-bold text-gray-900">1025776720</span>
                </p>
                <p>
                  Amount:{' '}
                  <span className="font-bold text-gray-900">
                    ${booking.totalAmount?.toFixed(2)}
                  </span>
                </p>
                <p>
                  Description / Note:{' '}
                  <span className="font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                    {booking.id}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyBankInfo}
                className="flex items-center gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? 'Copied!' : 'Copy Bank Info'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {submitting ? 'Processing...' : 'I have transferred'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-gray-700">Phone Number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary-600 text-sm"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <span className="mb-1 text-sm font-medium text-gray-700">Address / Note</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Enter address or notes for direct payment"
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary-600 text-sm resize-none"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Your ticket will remain PENDING until payment is completed at the ticket booth.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Cash Info'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
