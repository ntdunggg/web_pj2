import { useState } from 'react';
import { Banknote, QrCode } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader } from './ui/Card';
import { PAYMENT_METHODS } from '../utils/constants';

export const PaymentForm = ({ paymentMethod, onPaymentMethodChange, onSubmit, disabled, amount, className }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === PAYMENT_METHODS.CASH) {
      if (!phone.trim() || !address.trim()) {
        return;
      }
      onSubmit({ 
        method: PAYMENT_METHODS.CASH, 
        phone: phone.trim(), 
        address: address.trim() 
      });
      return;
    }

    if (paymentMethod === PAYMENT_METHODS.VNPAY) {
      onSubmit({ method: PAYMENT_METHODS.VNPAY });
      return;
    }
  };

  const isCustomStyle = !!className;

  return (
    <div className={className || "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-200"}>
      <div className={isCustomStyle ? "pb-4 border-b border-primary/20" : "px-6 py-4 border-b border-gray-200"}>
        <h3 className="text-xl font-semibold text-gray-900">Payment Method</h3>
      </div>
      <div className={isCustomStyle ? "space-y-4 pt-4" : "px-6 py-4"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onPaymentMethodChange(PAYMENT_METHODS.VNPAY)}
              className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                paymentMethod === PAYMENT_METHODS.VNPAY
                  ? 'border-primary-600 bg-primary-50 text-primary-900 font-semibold'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-600 hover:text-gray-950'
              }`}
            >
              <QrCode className="h-8 w-8 text-primary-600" />
              <span className="font-medium">VNPay / VietQR</span>
            </button>
            
            <button
              type="button"
              onClick={() => onPaymentMethodChange(PAYMENT_METHODS.CASH)}
              className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                paymentMethod === PAYMENT_METHODS.CASH
                  ? 'border-primary-600 bg-primary-50 text-primary-900 font-semibold'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-600 hover:text-gray-950'
              }`}
            >
              <Banknote className="h-8 w-8 text-primary-600" />
              <span className="font-medium">Cash</span>
            </button>
          </div>

          {paymentMethod === PAYMENT_METHODS.CASH && (
            <div className="space-y-4">


              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                  <span className="mb-1 text-sm font-medium text-gray-700">Phone Number</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary-600 text-sm"
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <span className="mb-1 text-sm font-medium text-gray-700">Address / Note</span>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    placeholder="Enter address or notes for contact"
                    className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary-600 text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === PAYMENT_METHODS.VNPAY && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col md:flex-row items-center gap-4">
              <div className="bg-white p-2 rounded-xl border border-gray-200 flex-shrink-0">
                <img
                  src={`https://img.vietqr.io/image/VCB-1025776720-compact.png?amount=${amount || 0}&addInfo=NTDFILM&accountName=NTDFILM%20CINEMA`}
                  alt="VNPay VietQR"
                  className="h-28 w-28 object-contain rounded"
                />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-bold text-blue-900">Pay Instantly using VNPay / VietQR</p>
                <p className="text-xs text-blue-700 mt-1">
                  Scan the VietQR code to make a fast transfer. Please confirm your booking after transferring. You can also view details and pay later in "My Tickets".
                </p>
                <div className="mt-2 text-xs text-blue-800 font-mono">
                  <p>Bank: <span className="font-bold">Vietcombank</span></p>
                  <p>A/C: <span className="font-bold">1025776720</span></p>
                </div>
                <div className="mt-3 p-2 bg-blue-100 border border-blue-200 rounded text-xs text-blue-900">
                  <p className="font-bold mb-1">⚠️ LƯU Ý QUAN TRỌNG:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      Vui lòng ghi nội dung chuyển khoản theo cú pháp:<br/>
                      <span className="font-bold text-red-600 inline-block mt-1">[Tên Show] + [Vị trí vé] + [SĐT của bạn]</span>
                    </li>
                    <li>Hệ thống sẽ giữ vé của bạn trong vòng <span className="font-bold text-red-600">24 giờ</span> kể từ lúc đặt vé. Vui lòng hoàn tất thanh toán trong thời gian này để tránh bị huỷ vé.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={disabled}>
            Confirm Payment
          </Button>
        </form>
      </div>
    </div>
  );
};
