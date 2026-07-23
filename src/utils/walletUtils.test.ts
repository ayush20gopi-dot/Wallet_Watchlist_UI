import { describe, expect, it } from 'vitest'
import { filterActivityByStatus, filterWallets, validateWalletInput } from './walletUtils'
import type { ActivityItem, WalletDetail } from '../types/wallet'

const wallets: WalletDetail[] = [
    {
        id: '1',
        label: 'Primary Treasury',
        address: '0xA1b2C3d4E5f6789012345678901234567890AbCd',
        chain: 'Ethereum',
        createdAt: '2024-02-14T10:00:00.000Z',
        balances: [],
        activity: [],
    },
    {
        id: '2',
        label: 'DAO Ops',
        address: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1908',
        chain: 'Polygon',
        createdAt: '2024-03-01T09:15:00.000Z',
        balances: [],
        activity: [],
    },
]

const activity: ActivityItem[] = [
    { id: 'a1', type: 'send', status: 'confirmed', amount: '1', symbol: 'ETH', timestamp: '2024-06-10T10:22:00.000Z' },
    { id: 'a2', type: 'receive', status: 'pending', amount: '2', symbol: 'USDC', timestamp: '2024-06-11T15:18:00.000Z' },
]

describe('wallet utilities', () => {
    it('filters wallets by query and chain', () => {
        const result = filterWallets(wallets, 'dao', 'Polygon')
        expect(result).toHaveLength(1)
        expect(result[0].label).toBe('DAO Ops')
    })

    it('validates wallet input for invalid addresses', () => {
        const result = validateWalletInput({ label: 'Test Wallet', address: 'invalid', chain: 'Ethereum' })
        expect(result.isValid).toBe(false)
        expect(result.addressError).toBe(true)
    })

    it('filters activity by status', () => {
        const result = filterActivityByStatus(activity, 'pending')
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('a2')
    })
})
