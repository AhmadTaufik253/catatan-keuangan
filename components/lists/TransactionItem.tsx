"use client";
import { formatRupiah, formatDate } from '../../utils/formatters';

export default function TransactionItem({ item, onClick }: any) {
  const isIncome = item.type === 'income';
  return (
    <div 
      onClick={() => onClick(item)}
      className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center active:bg-gray-100 cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
          <span className="text-lg">{isIncome ? '↓' : '↑'}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{item.category}</p>
          <p className="text-xs text-gray-500">{formatDate(item.date)} • {item.note}</p>
        </div>
      </div>
      <p className={`font-semibold ${isIncome ? 'text-green-600' : 'text-gray-800'}`}>
        {isIncome ? '+' : '-'}{formatRupiah(item.amount)}
      </p>
    </div>
  );
}