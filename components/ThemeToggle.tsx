"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Don't render anything on the server to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
        )
    }

    const isDark = resolvedTheme === "dark"

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            {isDark ? (
                <Moon className="w-5 h-5 text-blue-300" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
            )}
        </button>
    )
}
