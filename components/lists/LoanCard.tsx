import { formatRupiah } from '../../utils/formatters';

export default function LoanCard({ loan, onClick, onPay }: { loan: any; onClick: (l: any) => void; onPay?: (l: any) => void }) {
  const paid = loan.paid ?? 0;
  const remaining = Math.max(loan.amount - paid, 0);
  const percent = loan.amount > 0 ? Math.min(Math.round((paid / loan.amount) * 100), 100) : 0;
  const isLent = loan.type === 'lent';
  const isDone = loan.status === 'paid' || remaining === 0;

  const dueLabel = loan.rawDueDate
    ? new Date(loan.rawDueDate + 'T00:00:00Z').toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
      })
    : '-';

  return (
    <div
      onClick={() => onClick(loan)}
      className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 active:scale-[0.99] transition-transform cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-800">{loan.name}</p>
          <p className="text-xs text-gray-400">
            {isLent ? 'Kamu pinjamkan' : 'Kamu pinjam'} · Jatuh tempo {dueLabel}
          </p>
        </div>
        <span
          className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
            isDone ? 'bg-green-100 text-green-700' : isLent ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'
          }`}
        >
          {isDone ? 'Lunas' : isLent ? 'Piutang' : 'Hutang'}
        </span>
      </div>

      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-500">Terbayar {formatRupiah(paid)}</span>
        <span className="font-semibold text-gray-700">{percent}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all ${isDone ? 'bg-green-500' : 'bg-blue-600'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] text-gray-400">Sisa dari {formatRupiah(loan.amount)}</p>
          <p className={`font-bold ${isDone ? 'text-green-600' : 'text-gray-800'}`}>{formatRupiah(remaining)}</p>
        </div>
        {onPay && !isDone && (
          <button
            onClick={e => { e.stopPropagation(); onPay(loan); }}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl active:scale-95 transition-transform"
          >
            Catat Bayar
          </button>
        )}
      </div>
    </div>
  );
}