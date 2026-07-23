import type { WalletDetail } from '../types/wallet'

export const mockWallets: WalletDetail[] = [
    {
        id: 'wallet-1',
        label: 'Primary Treasury',
        address: '0xA1b2C3d4E5f6789012345678901234567890AbCd',
        chain: 'Ethereum',
        createdAt: '2024-02-14T10:00:00.000Z',
        balances: [
            { symbol: 'ETH', amount: '12.42', usdValue: 37695.84 },
            { symbol: 'USDC', amount: '8200', usdValue: 8200 },
        ],
        activity: [
            { id: 'a1', type: 'receive', status: 'confirmed', amount: '1.2', symbol: 'ETH', timestamp: '2024-06-10T10:22:00.000Z' },
            { id: 'a2', type: 'swap', status: 'pending', amount: '125', symbol: 'USDC', timestamp: '2024-06-11T15:18:00.000Z' },
            { id: 'a3', type: 'send', status: 'confirmed', amount: '0.38', symbol: 'ETH', timestamp: '2024-06-12T07:45:00.000Z' },
        ],
    },
    {
        id: 'wallet-2',
        label: 'DAO Ops',
        address: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1908',
        chain: 'Polygon',
        createdAt: '2024-03-01T09:15:00.000Z',
        balances: [
            { symbol: 'MATIC', amount: '6800', usdValue: 4760 },
            { symbol: 'USDT', amount: '5400', usdValue: 5400 },
        ],
        activity: [
            { id: 'a4', type: 'swap', status: 'confirmed', amount: '200', symbol: 'MATIC', timestamp: '2024-06-01T08:00:00.000Z' },
            { id: 'a5', type: 'receive', status: 'failed', amount: '78', symbol: 'USDT', timestamp: '2024-06-03T11:45:00.000Z' },
        ],
    },
    {
        id: 'wallet-3',
        label: 'Community Vault',
        address: '0x1234567890abcdef1234567890abcdef12345678',
        chain: 'Solana',
        createdAt: '2024-04-20T12:05:00.000Z',
        balances: [
            { symbol: 'SOL', amount: '214.4', usdValue: 24831.2 },
        ],
        activity: [
            { id: 'a6', type: 'receive', status: 'confirmed', amount: '20', symbol: 'SOL', timestamp: '2024-06-05T16:20:00.000Z' },
            { id: 'a7', type: 'send', status: 'pending', amount: '7.5', symbol: 'SOL', timestamp: '2024-06-09T20:00:00.000Z' },
        ],
    },
    {
        id: 'wallet-4',
        label: 'Cold Storage',
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        chain: 'Bitcoin',
        createdAt: '2023-11-12T16:30:00.000Z',
        balances: [
            { symbol: 'BTC', amount: '3.14', usdValue: 138000 },
        ],
        activity: [
            { id: 'a8', type: 'send', status: 'confirmed', amount: '0.42', symbol: 'BTC', timestamp: '2024-05-20T09:15:00.000Z' },
            { id: 'a9', type: 'receive', status: 'confirmed', amount: '1.2', symbol: 'BTC', timestamp: '2024-05-21T12:00:00.000Z' },
        ],
    },
    {
        id: 'wallet-5',
        label: 'Launchpad Wallet',
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        chain: 'Ethereum',
        createdAt: '2024-05-03T08:20:00.000Z',
        balances: [
            { symbol: 'ETH', amount: '2.28', usdValue: 6928.32 },
            { symbol: 'DAI', amount: '9300', usdValue: 9300 },
        ],
        activity: [
            { id: 'a10', type: 'swap', status: 'confirmed', amount: '420', symbol: 'DAI', timestamp: '2024-06-06T17:45:00.000Z' },
            { id: 'a11', type: 'receive', status: 'pending', amount: '0.5', symbol: 'ETH', timestamp: '2024-06-07T19:10:00.000Z' },
        ],
    },
]
