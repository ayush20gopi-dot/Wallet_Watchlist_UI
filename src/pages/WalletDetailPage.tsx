import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getActivity, getBalances, getWallet } from '../api/walletApi'
import { PageShell } from '../components/PageShell'
import { WalletForm } from '../components/WalletForm'
import { useWalletMutations } from '../hooks/useWalletMutations'
import { useTheme } from '../hooks/useTheme'
import type { ActivityItem, ActivityStatus, TokenBalance, WalletDetail, WalletInput } from '../types/wallet'
import { filterActivityByStatus } from '../utils/walletUtils'

export function WalletDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { updateWallet, deleteWallet, loading: saving, error: mutationError } = useWalletMutations()
    const { theme, toggleTheme } = useTheme()
    const [wallet, setWallet] = useState<WalletDetail | null>(null)
    const [balances, setBalances] = useState<TokenBalance[]>([])
    const [activity, setActivity] = useState<ActivityItem[]>([])
    const [status, setStatus] = useState<ActivityStatus | 'all'>('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editing, setEditing] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const loadDetails = async () => {
        if (!id) return
        setLoading(true)
        setError(null)
        try {
            const [walletData, balancesData, activityData] = await Promise.all([
                getWallet(id),
                getBalances(id),
                getActivity(id, status),
            ])
            setWallet(walletData)
            setBalances(balancesData)
            setActivity(activityData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load wallet')
        } finally {
            setLoading(false)
        }
    }

    const visibleActivity = filterActivityByStatus(activity, status)

    useEffect(() => {
        void loadDetails()
    }, [id, status])

    const handleSubmit = async (data: WalletInput) => {
        if (!id) return
        try {
            await updateWallet(id, data)
            setMessage('Wallet updated')
            setEditing(false)
            await loadDetails()
        } catch {
            setMessage(null)
        }
    }

    const handleDelete = async () => {
        if (!id) return
        try {
            await deleteWallet(id)
            navigate('/')
        } catch {
            setMessage(null)
        }
    }

    if (loading) {
        return (
            <PageShell>
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    Loading wallet details...
                </div>
            </PageShell>
        )
    }

    if (!wallet || error) {
        return (
            <PageShell>
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-rose-600 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-rose-400">
                    {error ?? 'Wallet not found'}
                </div>
            </PageShell>
        )
    }

    return (
        <PageShell>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Wallet detail</p>
                        <h1 className="mt-2 text-3xl font-semibold">{wallet.label}</h1>
                        <p className="mt-2 break-all text-sm text-slate-600 dark:text-slate-300">{wallet.address}</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{wallet.chain} • Created {new Date(wallet.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600">
                            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                        </button>
                        <button type="button" onClick={() => setEditing((value) => !value)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600">{editing ? 'Cancel edit' : 'Edit wallet'}</button>
                        <button type="button" onClick={handleDelete} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500">Delete wallet</button>
                    </div>
                </div>
                {message ? <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">{message}</p> : null}
            </section>

            {editing ? (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
                    <WalletForm wallet={wallet} onSubmit={handleSubmit} onCancel={() => setEditing(false)} submitting={saving} error={mutationError} />
                </section>
            ) : null}

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
                    <h2 className="text-xl font-semibold">Balances</h2>
                    <div className="mt-4 space-y-3">
                        {balances.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No balances yet.</div> : balances.map((balance) => (
                            <div key={balance.symbol} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">{balance.symbol}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{balance.amount}</p>
                                </div>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">${balance.usdValue.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold">Activity</h2>
                        <select value={status} onChange={(event) => setStatus(event.target.value as ActivityStatus | 'all')} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-500">
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div className="mt-4 space-y-3">
                        {visibleActivity.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No activity for this filter.</div> : visibleActivity.map((item) => (
                            <div key={item.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-slate-900 dark:text-slate-100">{item.type}</p>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.status}</span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.amount} {item.symbol}</p>
                                <p className="mt-1 text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageShell>
    )
}
