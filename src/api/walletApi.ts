import { mockWallets } from '../mocks/data'
import type { ActivityStatus, WalletDetail, WalletInput } from '../types/wallet'

const delay = (ms = 250) => new Promise((resolve) => window.setTimeout(resolve, ms))

export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

let walletStore: WalletDetail[] = mockWallets.map((wallet) => ({ ...wallet }))

export async function getWallets(): Promise<WalletDetail[]> {
    await delay()
    return walletStore.map((wallet) => ({ ...wallet, balances: [...wallet.balances], activity: [...wallet.activity] }))
}

export async function getWallet(walletId: string): Promise<WalletDetail> {
    await delay()
    const wallet = walletStore.find((item) => item.id === walletId)
    if (!wallet) {
        throw new ApiError(404, 'Wallet not found')
    }
    return { ...wallet, balances: [...wallet.balances], activity: [...wallet.activity] }
}

export async function createWallet(data: WalletInput): Promise<WalletDetail> {
    await delay()
    const wallet: WalletDetail = {
        id: crypto.randomUUID(),
        label: data.label.trim(),
        address: data.address.trim(),
        chain: data.chain,
        createdAt: new Date().toISOString(),
        balances: [],
        activity: [],
    }
    walletStore = [wallet, ...walletStore]
    return { ...wallet, balances: [...wallet.balances], activity: [...wallet.activity] }
}

export async function updateWallet(walletId: string, data: WalletInput): Promise<WalletDetail> {
    await delay()
    const index = walletStore.findIndex((wallet) => wallet.id === walletId)
    if (index === -1) {
        throw new ApiError(404, 'Wallet not found')
    }

    const existing = walletStore[index]
    const updated = {
        ...existing,
        label: data.label.trim(),
        address: data.address.trim(),
        chain: data.chain,
    }
    walletStore[index] = updated
    return { ...updated, balances: [...updated.balances], activity: [...updated.activity] }
}

export async function deleteWallet(walletId: string): Promise<void> {
    await delay()
    const next = walletStore.filter((wallet) => wallet.id !== walletId)
    if (next.length === walletStore.length) {
        throw new ApiError(404, 'Wallet not found')
    }
    walletStore = next
}

export async function getBalances(walletId: string) {
    await delay()
    const wallet = walletStore.find((item) => item.id === walletId)
    if (!wallet) {
        throw new ApiError(404, 'Wallet not found')
    }
    return wallet.balances.map((balance) => ({ ...balance }))
}

export async function getActivity(walletId: string, statusFilter?: ActivityStatus | 'all') {
    await delay()
    const wallet = walletStore.find((item) => item.id === walletId)
    if (!wallet) {
        throw new ApiError(404, 'Wallet not found')
    }

    const activity = wallet.activity.filter((item) => (statusFilter && statusFilter !== 'all' ? item.status === statusFilter : true))
    return activity.map((item) => ({ ...item }))
}
