import { useState } from 'react';
import { formatRupiah } from '../../utils/formatters';

export default function PayLoanView({
  loan,
  onClose,
  onPay,
}: {
  loan: any;
  onClose: () => void;
  onPay: (id: number, amount: number) => void;
}) {
  const paid = loan.paid ?? 0;
  const remaining = Math.max(loan.amount - paid, 0);
  const [value, setValue] = useState('');

  const amount = Number(value) || 0;
  const invalid = amount <= 0 || amount > remaining;

  return (
    <div className="absolute inset-0 z-40 bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-3xl p-5 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-800 mb-1">Catat Pembayaran</h2>
        <p className="text-sm text-gray-500 mb-4">
          {loan.name} · Sisa <span className="font-semibold text-gray-700">{formatRupiah(remaining)}</span>
        </p>

        <label className="text-xs text-gray-500 mb-1 block">Jumlah dibayar</label>
        <div className="flex items-center border border-gray-200 rounded-xl px-3 mb-2 focus-within:border-blue-600">
          <span className="text-gray-400 mr-2">Rp</span>
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="0"
            className="flex-1 py-3 outline-none text-gray-800"
            autoFocus
          />
        </div>

        {amount > remaining && (
          <p className="text-xs text-red-500 mb-2">Melebihi sisa pinjaman.</p>
        )}

        <button
          onClick={() => setValue(String(remaining))}
          className="text-sm text-blue-600 font-medium mb-4"
        >
          Bayar lunas ({formatRupiah(remaining)})
        </button>

        <button
          disabled={invalid}
          onClick={() => onPay(loan.id, amount)}
          className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl active:scale-[0.98] transition-transform"
        >
          Simpan Pembayaran
        </button>

        {paid > 0 && (
          <button
            onClick={() => onPay(loan.id, -paid)}
            className="w-full text-sm text-gray-400 mt-3"
          >
            Reset total terbayar (salah input)
          </button>
        )}
      </div>
    </div>
  );
}