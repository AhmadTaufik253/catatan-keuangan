"use client";
import { useState } from "react";

export default function AddTransactionView({ onClose, onSave, onDelete, initialData }: any) {
  const [type, setType] = useState(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [category, setCategory] = useState(initialData?.category || 'Makanan');
  const [date, setDate] = useState(initialData?.rawDate || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(initialData?.note || '');

  const expenseCategories = ['Makanan', 'Transportasi', 'Belanja', 'Tagihan', 'Lainnya'];
  const incomeCategories = ['Gaji', 'Bonus', 'Investasi', 'Lainnya'];
  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleSave = () => {
    if (!amount || !category) return;
    onSave({
      id: initialData?.id || Date.now(),
      type,
      amount: parseInt(amount.toString()),
      category,
      date: new Date(date).toISOString(),
      rawDate: date,
      note
    });
  };

  return (
    <div className="absolute inset-0 bg-gray-100 z-50 flex flex-col animate-slide-up">
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b border-gray-200">
        <button onClick={onClose} className="text-blue-500 text-lg">Batal</button>
        <h2 className="font-semibold text-lg">{initialData ? 'Edit Transaksi' : 'Transaksi Baru'}</h2>
        <button onClick={handleSave} className="text-blue-500 font-semibold text-lg">Simpan</button>
      </div>

      <div className="p-4">
        {/* Segmented Control */}
        <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setType('expense'); setCategory(expenseCategories[0]); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'expense' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => { setType('income'); setCategory(incomeCategories[0]); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'income' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            Pemasukan
          </button>
        </div>

        {/* Form Group */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <span className="w-24 text-gray-800">Nominal</span>
            <input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 text-right outline-none text-lg" />
          </div>
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <span className="w-24 text-gray-800">Kategori</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 text-right outline-none bg-transparent appearance-none text-gray-600 font-medium">
              {currentCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <span className="w-24 text-gray-800">Tanggal</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 text-right outline-none bg-transparent text-gray-600" />
          </div>
          <div className="flex items-center px-4 py-3">
            <span className="w-24 text-gray-800">Catatan</span>
            <input type="text" placeholder="opsional" value={note} onChange={(e) => setNote(e.target.value)} className="flex-1 text-right outline-none text-gray-600" />
          </div>
        </div>

        {initialData && (
          <button onClick={() => onDelete(initialData.id)} className="w-full mt-6 bg-white text-red-500 font-semibold py-3 rounded-xl border border-gray-200 active:bg-gray-50">
            Hapus Transaksi
          </button>
        )}
      </div>
    </div>
  );
}