import { Link } from 'react-router-dom'
import type { WalletDetail } from '../types/wallet'

interface WalletListViewProps {
    wallets: WalletDetail[]
    onSelect: (wallet: WalletDetail) => void
    onDelete: (wallet: WalletDetail) => void
}

export function WalletListView({ wallets, onSelect, onDelete }: WalletListViewProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {wallets.map((wallet) => (
                <article key={wallet.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/40">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{wallet.label}</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{wallet.chain}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">{wallet.chain}</span>
                    </div>
                    <p className="mt-4 break-all text-sm text-slate-600 dark:text-slate-300">{wallet.address}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                        <span>Created {new Date(wallet.createdAt).toLocaleDateString()}</span>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => onSelect(wallet)} className="font-semibold text-slate-900 transition hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-100">Edit</button>
                            <button type="button" onClick={() => onDelete(wallet)} className="font-semibold text-rose-600 transition hover:text-rose-500">Delete</button>
                        </div>
                    </div>
                    <Link to={`/wallets/${wallet.id}`} className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline transition hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-100">View details</Link>
                </article>
            ))}
        </div>
    )
}

