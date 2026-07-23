import { useCallback, useEffect, useState } from 'react'
import { getWallets } from '../api/walletApi'
import type { WalletDetail } from '../types/wallet'

export function useWallets() {
    const [wallets, setWallets] = useState<WalletDetail[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getWallets()
            setWallets(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load wallets')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void refresh()
    }, [refresh])

    return { wallets, loading, error, refresh }
}
