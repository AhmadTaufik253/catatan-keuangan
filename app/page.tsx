"use client";
import { useEffect, useMemo, useState } from 'react';
import { formatRupiah } from '../utils/formatters';
import TransactionItem from '../components/lists/TransactionItem';
import LoanCard from '../components/lists/LoanCard';
import AddTransactionView from '../components/modals/AddTransactionView';
import AddLoanView from '../components/modals/AddLoanView';
import PayLoanView from '../components/modals/PayLoanView';

type Page = 'home' | 'history' | 'loans';

// ---------- Ikon ----------
function Icon({ d, className = 'w-6 h-6' }: { d: string | string[]; className?: string }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths.map((p, i) => (
        <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={p} />
      ))}
    </svg>
  );
}

const ICONS = {
  plus: 'M12 4v16m8-8H4',
  eye: [
    'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  ],
  eyeOff:
    'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21',
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  history: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  loans:
    'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
  empty:
    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  chevron: 'M9 5l7 7-7 7',
};

const NAV_ITEMS: { key: Page; label: string; icon: string }[] = [
  { key: 'home', label: 'Beranda', icon: ICONS.home },
  { key: 'history', label: 'Riwayat', icon: ICONS.history },
  { key: 'loans', label: 'Pinjaman', icon: ICONS.loans },
];

// ---------- Komponen kecil ----------
function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-12">
      <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
        <Icon d={ICONS.empty} className="w-8 h-8" />
      </div>
      <p className="font-semibold text-gray-700 mb-1">{title}</p>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}

function SummaryCard({ label, value, dot }: { label: string; value: string; dot: string }) {
  return (
    <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <p className="text-blue-100 text-xs">{label}</p>
      </div>
      <p className="text-white font-semibold text-sm truncate">{value}</p>
    </div>
  );
}

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-2">
      <h2 className="font-semibold text-gray-800">{title}</h2>
      {onSeeAll && (
        <button onClick={onSeeAll} className="flex items-center text-sm font-medium text-blue-600 active:opacity-60">
          Lihat semua
          <Icon d={ICONS.chevron} className="w-4 h-4 ml-0.5" />
        </button>
      )}
    </div>
  );
}

function QuickAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 shadow-sm active:scale-95 transition-transform"
    >
      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
        <Icon d={ICONS.plus} className="w-4 h-4" />
      </span>
      {label}
    </button>
  );
}

function formatDateLabel(rawDate: string) {
  return new Date(rawDate + 'T00:00:00Z').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ---------- Halaman utama ----------
export default function Home() {
  const [page, setPage] = useState<Page>('home');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [hideBalance, setHideBalance] = useState(false);
  const [payingLoan, setPayingLoan] = useState<any>(null);

  // Bulan berjalan (diisi di browser supaya tidak kena error prerender)
  const [monthPrefix, setMonthPrefix] = useState('');
  useEffect(() => {
    // Pakai waktu lokal (bukan UTC) supaya bulan sesuai zona waktu WIB
    const now = new Date();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    setMonthPrefix(`${now.getFullYear()}-${m}`);
  }, []);

  // State Data Awal (Dummy)
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 45000, category: 'Makanan', date: '2026-11-17T12:00:00.000Z', rawDate: '2026-11-17', note: 'Makan siang Nasi Padang' },
    { id: 2, type: 'income', amount: 5000000, category: 'Gaji', date: '2026-11-17T09:00:00.000Z', rawDate: '2026-11-17', note: 'Gaji bulan ini' },
  ]);

  const [loans, setLoans] = useState([
    { id: 1, type: 'lent', name: 'Budi', amount: 200000, paid: 50000, dueDate: '2026-11-20T00:00:00.000Z', rawDueDate: '2026-11-20', status: 'active' },
  ]);

  // ---------- Perhitungan ----------
  const currentBalance = transactions.reduce(
    (acc, curr) => (curr.type === 'income' ? acc + curr.amount : acc - curr.amount),
    0
  );

  const monthTx = monthPrefix
    ? transactions.filter(t => t.rawDate.startsWith(monthPrefix))
    : [];
  const monthIncome = monthTx.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
  const monthExpense = monthTx.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);

  const activeLoans = loans.filter(l => l.status === 'active');
  const remainingOf = (l: any) => Math.max(l.amount - (l.paid ?? 0), 0);
  const totalLent = activeLoans.filter(l => l.type === 'lent').reduce((a, c) => a + remainingOf(c), 0);
  const totalBorrowed = activeLoans.filter(l => l.type !== 'lent').reduce((a, c) => a + remainingOf(c), 0);
  // const totalLent = activeLoans.filter(l => l.type === 'lent').reduce((a, c) => a + c.amount, 0);
  // const totalBorrowed = activeLoans.filter(l => l.type !== 'lent').reduce((a, c) => a + c.amount, 0);

  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)),
    [transactions]
  );

  const groupedTransactions = useMemo(() => {
    const groups: { rawDate: string; items: typeof transactions }[] = [];
    sortedTransactions.forEach(t => {
      const last = groups[groups.length - 1];
      if (last && last.rawDate === t.rawDate) last.items.push(t);
      else groups.push({ rawDate: t.rawDate, items: [t] });
    });
    return groups;
  }, [sortedTransactions]);

  // ---------- Handler ----------
  const openAddTransaction = () => { setEditingItem(null); setShowAddTransaction(true); };
  const openAddLoan = () => { setEditingItem(null); setShowAddLoan(true); };
  const openEditTransaction = (i: any) => { setEditingItem(i); setShowAddTransaction(true); };
  const openEditLoan = (l: any) => { setEditingItem(l); setShowAddLoan(true); };

  const handleSaveTransaction = (data: any) => {
    editingItem ? setTransactions(transactions.map(t => (t.id === data.id ? data : t))) : setTransactions([data, ...transactions]);
    setShowAddTransaction(false); setEditingItem(null);
  };

  const handleSaveLoan = (data: any) => {
    if (editingItem) {
      setLoans(loans.map(l => {
        if (l.id !== data.id) return l;
        const paid = Math.min(l.paid ?? 0, data.amount); // jaga-jaga kalau nominal diedit lebih kecil
        return { ...l, ...data, paid, status: paid >= data.amount ? 'paid' : 'active' };
      }));
    } else {
      setLoans([{ ...data, paid: 0, status: 'active' }, ...loans]);
    }
    setShowAddLoan(false); setEditingItem(null);
  };

  const openPayLoan = (l: any) => setPayingLoan(l);

  const handlePayLoan = (id: number, amount: number) => {
    setLoans(loans.map(l => {
      if (l.id !== id) return l;
      const paid = Math.min(Math.max((l.paid ?? 0) + amount, 0), l.amount);
      return { ...l, paid, status: paid >= l.amount ? 'paid' : 'active' };
    }));
    setPayingLoan(null);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setShowAddTransaction(false); setEditingItem(null);
  };

  const handleDeleteLoan = (id: number) => {
    setLoans(loans.filter(l => l.id !== id));
    setShowAddLoan(false); setEditingItem(null);
  };

  const mask = (v: number) => (hideBalance ? 'Rp ••••' : formatRupiah(v));

  // ---------- Header per halaman ----------
  const renderHeader = () => {
    if (page === 'home') {
      return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 pt-12 pb-5 rounded-b-[2rem] shadow-md z-10 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-blue-100 text-sm font-medium">Total Saldo</p>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              aria-label={hideBalance ? 'Tampilkan saldo' : 'Sembunyikan saldo'}
              className="text-blue-100 p-1 -mr-1 active:scale-90 transition-transform"
            >
              <Icon d={hideBalance ? ICONS.eyeOff : ICONS.eye} className="w-5 h-5" />
            </button>
          </div>
          <h1 className={`text-4xl font-bold mb-5 truncate ${currentBalance < 0 && !hideBalance ? 'text-red-200' : 'text-white'}`}>
            {hideBalance ? 'Rp ••••••' : formatRupiah(currentBalance)}
          </h1>
          <p className="text-blue-100 text-xs mb-2">Bulan ini</p>
          <div className="flex gap-3">
            <SummaryCard label="Pemasukan" value={mask(monthIncome)} dot="bg-green-400" />
            <SummaryCard label="Pengeluaran" value={mask(monthExpense)} dot="bg-red-400" />
          </div>
        </div>
      );
    }

    if (page === 'history') {
      return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 pt-12 pb-5 rounded-b-[2rem] shadow-md z-10 shrink-0">
          <h1 className="text-white text-2xl font-bold mb-1">Riwayat Transaksi</h1>
          <p className="text-blue-100 text-sm">{transactions.length} transaksi tercatat</p>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 pt-12 pb-5 rounded-b-[2rem] shadow-md z-10 shrink-0">
        <h1 className="text-white text-2xl font-bold mb-4">Pinjaman</h1>
        <div className="flex gap-3">
          <SummaryCard label="Piutang (dipinjamkan)" value={mask(totalLent)} dot="bg-green-400" />
          <SummaryCard label="Hutang (dipinjam)" value={mask(totalBorrowed)} dot="bg-red-400" />
        </div>
      </div>
    );
  };

  // ---------- Konten per halaman ----------
  const renderHome = () => (
    <div>
      {/* Aksi cepat */}
      <div className="flex gap-3 px-4 pt-5">
        <QuickAction label="Catat Transaksi" onClick={openAddTransaction} />
        <QuickAction label="Catat Pinjaman" onClick={openAddLoan} />
      </div>

      {/* Ringkasan pinjaman */}
      <div className="flex gap-3 px-4 pt-4">
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Piutang</p>
          <p className="font-semibold text-green-600 text-sm truncate">{mask(totalLent)}</p>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Hutang</p>
          <p className="font-semibold text-red-500 text-sm truncate">{mask(totalBorrowed)}</p>
        </div>
      </div>

      {/* Transaksi terakhir */}
      <SectionHeader title="Transaksi Terakhir" onSeeAll={sortedTransactions.length > 0 ? () => setPage('history') : undefined} />
      {sortedTransactions.length === 0 ? (
        <EmptyState title="Belum ada transaksi" desc="Catat pemasukan atau pengeluaran pertamamu." />
      ) : (
        <div className="bg-white border-y border-gray-100">
          {sortedTransactions.slice(0, 3).map(item => (
            <TransactionItem key={item.id} item={item} onClick={openEditTransaction} />
          ))}
        </div>
      )}

      {/* Pinjaman aktif */}
      <SectionHeader title="Pinjaman Aktif" onSeeAll={activeLoans.length > 0 ? () => setPage('loans') : undefined} />
      {activeLoans.length === 0 ? (
        <EmptyState title="Tidak ada pinjaman aktif" desc="Semua pinjaman sudah beres." />
      ) : (
        <div>
          {activeLoans.slice(0, 2).map(loan => (
            <LoanCard key={loan.id} loan={loan} onClick={openEditLoan} onPay={openPayLoan} />
          ))}
        </div>
      )}
    </div>
  );

  const renderHistory = () =>
    groupedTransactions.length === 0 ? (
      <div className="pt-8">
        <EmptyState title="Belum ada transaksi" desc="Tekan tombol + untuk mencatat transaksi pertamamu." />
      </div>
    ) : (
      <div className="pt-2">
        {groupedTransactions.map(group => (
          <div key={group.rawDate} className="mb-2">
            <p className="px-5 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {formatDateLabel(group.rawDate)}
            </p>
            <div className="bg-white border-y border-gray-100">
              {group.items.map(item => (
                <TransactionItem key={item.id} item={item} onClick={openEditTransaction} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );

  const renderLoans = () =>
    loans.length === 0 ? (
      <div className="pt-8">
        <EmptyState title="Belum ada pinjaman" desc="Tekan tombol + untuk mencatat pinjaman." />
      </div>
    ) : (
      <div className="pt-4">
        {loans.map(loan => (
          < LoanCard key={loan.id} loan={loan} onClick={openEditLoan} onPay={openPayLoan} />
        ))}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center font-sans sm:p-4">
      {/* Frame HP */}
      <div className="w-full max-w-[414px] h-[100dvh] sm:h-[min(896px,calc(100dvh_-_2rem))] bg-gray-50 relative shadow-2xl sm:rounded-[3rem] sm:border-[10px] border-gray-900 overflow-hidden flex flex-col">

        {renderHeader()}

        {/* Konten (scroll) */}
        <div className="flex-1 overflow-y-auto pb-32">
          {page === 'home' && renderHome()}
          {page === 'history' && renderHistory()}
          {page === 'loans' && renderLoans()}
        </div>

        {/* FAB: hanya di Riwayat & Pinjaman */}
        {page !== 'home' && (
          <button
            onClick={page === 'history' ? openAddTransaction : openAddLoan}
            aria-label="Tambah"
            className="absolute bottom-24 right-5 w-14 h-14 bg-blue-600 rounded-full flex justify-center items-center text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-transform z-20"
          >
            <Icon d={ICONS.plus} className="w-7 h-7" />
          </button>
        )}

        {/* Bottom nav */}
        <nav
          className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-around items-center min-h-[72px] z-30"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
        >
          {NAV_ITEMS.map(item => {
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`flex flex-col items-center justify-center w-full pt-2 transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <Icon d={item.icon} className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">{item.label}</span>
                <span className={`mt-1 h-1 w-1 rounded-full ${active ? 'bg-blue-600' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </nav>

        {/* Modal */}
        {showAddTransaction && (
          <AddTransactionView
            initialData={editingItem}
            onClose={() => { setShowAddTransaction(false); setEditingItem(null); }}
            onSave={handleSaveTransaction}
            onDelete={handleDeleteTransaction}
          />
        )}
        {showAddLoan && (
          <AddLoanView
            initialData={editingItem}
            onClose={() => { setShowAddLoan(false); setEditingItem(null); }}
            onSave={handleSaveLoan}
            onDelete={handleDeleteLoan}
          />
        )}
        {payingLoan && (
          <PayLoanView
            loan={payingLoan}
            onClose={() => setPayingLoan(null)}
            onPay={handlePayLoan}
          />
        )}
      </div>
    </div>
  );
}