import { useState } from 'react'
import { createWallet, deleteWallet, updateWallet } from '../api/walletApi'
import type { WalletDetail, WalletInput } from '../types/wallet'

export function useWalletMutations() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const runMutation = async <T>(callback: () => Promise<T>): Promise<T> => {
        setLoading(true)
        setError(null)
        try {
            return await callback()
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Request failed'
            setError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const addWallet = async (data: WalletInput): Promise<WalletDetail> => {
        return runMutation(async () => createWallet(data))
    }

    const editWallet = async (walletId: string, data: WalletInput): Promise<WalletDetail> => {
        return runMutation(async () => updateWallet(walletId, data))
    }

    const removeWallet = async (walletId: string): Promise<void> => {
        return runMutation(async () => deleteWallet(walletId))
    }

    return { createWallet: addWallet, updateWallet: editWallet, deleteWallet: removeWallet, loading, error }
}
