import type { ActivityItem, ActivityStatus, WalletDetail, WalletInput } from '../types/wallet'

export function filterWallets(wallets: WalletDetail[], query: string, chain: string) {
    const normalizedQuery = query.trim().toLowerCase()
    return wallets.filter((wallet) => {
        const matchesChain = chain === 'All' || wallet.chain === chain
        const haystack = `${wallet.label} ${wallet.address}`.toLowerCase()
        const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery)
        return matchesChain && matchesQuery
    })
}

export function validateWalletInput(input: WalletInput) {
    const trimmedLabel = input.label.trim()
    const trimmedAddress = input.address.trim()

    const labelError = trimmedLabel.length < 2 || trimmedLabel.length > 40
    const addressError = !isValidAddress(trimmedAddress, input.chain)

    return {
        isValid: !labelError && !addressError,
        labelError,
        addressError,
        labelMessage: labelError ? 'Enter a label between 2 and 40 characters.' : '',
        addressMessage: addressError ? 'Use a valid address for the selected chain.' : '',
    }
}

export function filterActivityByStatus(activity: ActivityItem[], status: ActivityStatus | 'all') {
    if (status === 'all') return activity
    return activity.filter((item) => item.status === status)
}

function isValidAddress(address: string, chain: string) {
    if (chain === 'Bitcoin') {
        return /^bc1[0-9a-z]{25,87}$/i.test(address) || /^1|^3|^bc1/i.test(address)
    }
    if (chain === 'Solana') {
        return address.length >= 20
    }
    return /^0x[a-fA-F0-9]{40}$/.test(address)
}
