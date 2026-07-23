import { useEffect, useState } from 'react'

const STORAGE_KEY = 'wallet-watchlist-theme'
const DARK_CLASS = 'dark'

function getSystemTheme() {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme() {
    if (typeof window === 'undefined') return 'light'
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved
    return getSystemTheme()
}

export function useTheme() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme())

    useEffect(() => {
        const root = document.documentElement
        root.classList.toggle(DARK_CLASS, theme === 'dark')
        root.setAttribute('data-theme', theme)
        window.localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
    }

    return { theme, toggleTheme }
}
