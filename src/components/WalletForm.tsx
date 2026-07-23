import { useEffect, useId, useMemo, useState } from 'react'
import type { Wallet, WalletInput } from '../types/wallet'
import { validateWalletInput } from '../utils/walletUtils'

interface WalletFormProps {
    wallet?: Wallet | null
    onSubmit: (data: WalletInput) => Promise<void>
    onCancel: () => void
    submitting: boolean
    error: string | null
}

const initialState = (wallet?: Wallet | null): WalletInput => ({
    label: wallet?.label ?? '',
    address: wallet?.address ?? '',
    chain: wallet?.chain ?? 'Ethereum',
})

export function WalletForm({ wallet, onSubmit, onCancel, submitting, error }: WalletFormProps) {
    const [form, setForm] = useState<WalletInput>(initialState(wallet))
    const [touched, setTouched] = useState({ label: false, address: false })
    const labelId = useId()
    const addressId = useId()
    const chainId = useId()

    useEffect(() => {
        setForm(initialState(wallet))
        setTouched({ label: false, address: false })
    }, [wallet])

    const validation = useMemo(() => validateWalletInput(form), [form])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setTouched({ label: true, address: true })
        if (!validation.isValid) return
        await onSubmit(form)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950" noValidate>
            <div>
                <label htmlFor={labelId} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Label</label>
                <input
                    id={labelId}
                    aria-invalid={touched.label && validation.labelError}
                    aria-describedby={touched.label && validation.labelError ? `${labelId}-error` : undefined}
                    value={form.label}
                    onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))}
                    onBlur={() => setTouched((current) => ({ ...current, label: true }))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                    placeholder="Wallet label"
                />
                {touched.label && validation.labelError ? <p id={`${labelId}-error`} className="mt-1 text-sm text-rose-600 dark:text-rose-400">{validation.labelMessage}</p> : null}
            </div>

            <div>
                <label htmlFor={addressId} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                <input
                    id={addressId}
                    aria-invalid={touched.address && validation.addressError}
                    aria-describedby={touched.address && validation.addressError ? `${addressId}-error` : undefined}
                    value={form.address}
                    onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                    onBlur={() => setTouched((current) => ({ ...current, address: true }))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                    placeholder="0x..."
                />
                {touched.address && validation.addressError ? <p id={`${addressId}-error`} className="mt-1 text-sm text-rose-600 dark:text-rose-400">{validation.addressMessage}</p> : null}
            </div>

            <div>
                <label htmlFor={chainId} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Chain</label>
                <select
                    id={chainId}
                    value={form.chain}
                    onChange={(event) => setForm((current) => ({ ...current, chain: event.target.value as WalletInput['chain'] }))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-500"
                >
                    <option value="Ethereum">Ethereum</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Solana">Solana</option>
                    <option value="Bitcoin">Bitcoin</option>
                </select>
            </div>

            {error ? <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">{error}</p> : null}

            <div className="flex justify-end gap-3">
                <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600">Cancel</button>
                <button type="submit" disabled={!validation.isValid || submitting} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                    {submitting ? 'Saving…' : wallet ? 'Save changes' : 'Add wallet'}
                </button>
            </div>
        </form>
    )
}
