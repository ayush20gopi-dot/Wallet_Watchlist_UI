import { useMemo, useState } from 'react'
import { PageShell } from '../components/PageShell'
import { WalletForm } from '../components/WalletForm'
import { WalletListView } from '../components/WalletListView'
import { useWalletMutations } from '../hooks/useWalletMutations'
import { useWallets } from '../hooks/useWallets'
import { useTheme } from '../hooks/useTheme'
import type { WalletDetail, WalletInput } from '../types/wallet'
import { filterWallets } from '../utils/walletUtils'

export function WalletListPage() {
    const { wallets, loading, error, refresh } = useWallets()
    const { theme, toggleTheme } = useTheme()
    const { createWallet, updateWallet, deleteWallet, loading: saving, error: mutationError } = useWalletMutations()
    const [query, setQuery] = useState('')
    const [chain, setChain] = useState('All')
    const [openForm, setOpenForm] = useState(false)
    const [editingWallet, setEditingWallet] = useState<WalletDetail | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<WalletDetail | null>(null)
    const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString())

    const filteredWallets = useMemo(() => filterWallets(wallets, query, chain), [chain, query, wallets])
    const chainCounts = useMemo(() => {
        return wallets.reduce<Record<string, number>>((acc, wallet) => {
            acc[wallet.chain] = (acc[wallet.chain] ?? 0) + 1
            return acc
        }, {})
    }, [wallets])

    const handleSubmit = async (data: WalletInput) => {
        try {
            if (editingWallet) {
                await updateWallet(editingWallet.id, data)
                setMessage('Wallet updated successfully.')
            } else {
                await createWallet(data)
                setMessage('Wallet added successfully.')
            }
            setOpenForm(false)
            setEditingWallet(null)
            setLastUpdated(new Date().toLocaleTimeString())
            await refresh()
        } catch {
            setMessage('Unable to save the wallet right now.')
        }
    }

    const handleDelete = async (wallet: WalletDetail) => {
        setConfirmDelete(wallet)
    }

    const confirmDeletion = async () => {
        if (!confirmDelete) return
        try {
            await deleteWallet(confirmDelete.id)
            setMessage('Wallet deleted successfully.')
            setLastUpdated(new Date().toLocaleTimeString())
            await refresh()
        } catch {
            setMessage('Unable to delete this wallet right now.')
        } finally {
            setConfirmDelete(null)
        }
    }

    return (
        <PageShell showBackButton={false}>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Wallet Watchlist</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Monitor your wallets at a glance</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Track balances, activity, and quickly add or edit important wallet addresses.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={() => { void refresh(); setLastUpdated(new Date().toLocaleTimeString()) }} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600">Refresh data</button>
                        <button type="button" onClick={() => { setEditingWallet(null); setOpenForm(true) }} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">Add wallet</button>
                        <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600">
                            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                        </button>
                    </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-800/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Wallets</p>
                        <p className="mt-1 text-xl font-semibold">{wallets.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-800/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Chains</p>
                        <p className="mt-1 text-xl font-semibold">{Object.keys(chainCounts).length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-800/70">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Updated</p>
                        <p className="mt-1 text-xl font-semibold">{lastUpdated}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 flex-col gap-3 md:flex-row">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="wallet-search">
                            <span className="sr-only">Search wallets</span>
                            <input id="wallet-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search label or address" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500 md:max-w-xs" />
                        </label>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="wallet-chain">
                            <span className="sr-only">Filter by chain</span>
                            <select id="wallet-chain" value={chain} onChange={(event) => setChain(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-500 md:w-40">
                                <option value="All">All chains</option>
                                <option value="Ethereum">Ethereum</option>
                                <option value="Polygon">Polygon</option>
                                <option value="Solana">Solana</option>
                                <option value="Bitcoin">Bitcoin</option>
                            </select>
                        </label>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{filteredWallets.length} wallet{filteredWallets.length === 1 ? '' : 's'}</div>
                </div>

                {message ? <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">{message}</p> : null}

                {loading ? <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-300">Loading wallets…</div> : null}
                {!loading && error ? <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">{error}</div> : null}
                {!loading && !error && filteredWallets.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No wallets match your search.</div> : null}
                {!loading && !error && filteredWallets.length > 0 ? <div className="mt-6"><WalletListView wallets={filteredWallets} onSelect={(wallet) => { setEditingWallet(wallet); setOpenForm(true) }} onDelete={handleDelete} /></div> : null}
            </section>

            {confirmDelete ? (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40" aria-label="Confirm delete wallet">
                    <h2 className="text-xl font-semibold">Delete wallet?</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This will permanently remove the wallet from the current view.</p>
                    <div className="mt-4 flex gap-3">
                        <button type="button" onClick={() => setConfirmDelete(null)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600">Cancel</button>
                        <button type="button" onClick={confirmDeletion} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400">Delete wallet</button>
                    </div>
                </section>
            ) : null}

            {openForm ? (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40" aria-label="Wallet form">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">{editingWallet ? 'Edit wallet' : 'Add wallet'}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Keep your watchlist up to date.</p>
                        </div>
                        <button type="button" onClick={() => { setOpenForm(false); setEditingWallet(null) }} className="text-sm font-semibold text-slate-600 transition hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-slate-300 dark:hover:text-slate-100">Close</button>
                    </div>
                    <WalletForm
                        wallet={editingWallet}
                        onSubmit={handleSubmit}
                        onCancel={() => { setOpenForm(false); setEditingWallet(null) }}
                        submitting={saving}
                        error={mutationError}
                    />
                </section>
            ) : null}
        </PageShell>
    )
}
