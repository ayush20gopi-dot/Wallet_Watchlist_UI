export type Chain = 'Ethereum' | 'Polygon' | 'Solana' | 'Bitcoin'

export type ActivityType = 'send' | 'receive' | 'swap'
export type ActivityStatus = 'pending' | 'confirmed' | 'failed'

export interface Wallet {
    id: string
    label: string
    address: string
    chain: Chain
    createdAt: string
}

export interface TokenBalance {
    symbol: string
    amount: string
    usdValue: number
}

export interface ActivityItem {
    id: string
    type: ActivityType
    status: ActivityStatus
    amount: string
    symbol: string
    timestamp: string
}

export interface WalletDetail extends Wallet {
    balances: TokenBalance[]
    activity: ActivityItem[]
}

export interface WalletInput {
    label: string
    address: string
    chain: Chain
}
