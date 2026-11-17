"use client";
import { useState } from "react";

export default function AddLoanView({ onClose, onSave, onDelete, initialData }: any) {
  const [type, setType] = useState(initialData?.type || 'lent');
  const [name, setName] = useState(initialData?.name || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [dueDate, setDueDate] = useState(initialData?.rawDueDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState(initialData?.status || 'active');

  const handleSave = () => {
    if (!name || !amount) return;
    onSave({
      id: initialData?.id || Date.now(),
      type,
      name,
      amount: parseInt(amount.toString()),
      dueDate: new Date(dueDate).toISOString(),
      rawDueDate: dueDate,
      status
    });
  };

  return (
    <div className="absolute inset-0 bg-gray-100 z-50 flex flex-col animate-slide-up">
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b border-gray-200">
        <button onClick={onClose} className="text-blue-500 text-lg">Batal</button>
        <h2 className="font-semibold text-lg">{initialData ? 'Edit Pinjaman' : 'Catat Pinjaman'}</h2>
        <button onClick={handleSave} className="text-blue-500 font-semibold text-lg">Simpan</button>
      </div>

      <div className="p-4">
        <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
          <button onClick={() => setType('lent')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'lent' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Meminjamkan</button>
          <button onClick={() => setType('borrowed')} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'borrowed' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Berhutang</button>
        </div>

        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <span className="w-24 text-gray-800">Nama</span>
            <input type="text" placeholder="Siapa?" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 text-right outline-none text-gray-600" />
          </div>
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <span className="w-24 text-gray-800">Nominal</span>
            <input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 text-right outline-none text-lg" />
          </div>
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <span className="w-24 text-gray-800">Jatuh Tempo</span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="flex-1 text-right outline-none bg-transparent text-gray-600" />
          </div>
          {initialData && (
             <div className="flex items-center justify-between px-4 py-3">
               <span className="text-gray-800">Status Lunas</span>
               <input type="checkbox" checked={status === 'paid_off'} onChange={(e) => setStatus(e.target.checked ? 'paid_off' : 'active')} className="w-5 h-5 accent-blue-500" />
             </div>
          )}
        </div>

        {initialData && (
          <button onClick={() => onDelete(initialData.id)} className="w-full mt-6 bg-white text-red-500 font-semibold py-3 rounded-xl border border-gray-200 active:bg-gray-50">
            Hapus Pinjaman
          </button>
        )}
      </div>
    </div>
  );
}