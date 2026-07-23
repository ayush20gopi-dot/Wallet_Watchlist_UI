import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface PageShellProps {
    children: ReactNode
    showBackButton?: boolean
}

export function PageShell({ children, showBackButton = true }: PageShellProps) {
    const navigate = useNavigate()

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                {showBackButton ? (
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-600"
                    >
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path d="M10.5 4.5 5 10l5.5 5.5M6 10h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                    </button>
                ) : null}
                {children}
            </div>
        </main>
    )
}
