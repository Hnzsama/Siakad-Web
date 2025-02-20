import { useTheme } from './theme-provider'
import { Button } from '@/components/ui/button'
import { IconMoon, IconSun } from '@tabler/icons-react'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`rounded-full ${
                theme === 'dark'
                    ? 'bg-white hover:bg-white/90'
                    : 'bg-slate-900 hover:bg-slate-900/90'
            }`}
        >
            <IconSun
                className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all
                    ${theme === 'dark' ? 'text-black' : 'text-white'}
                    ${theme === 'dark' ? 'scale-100' : 'scale-0'}`}
            />
            <IconMoon
                className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 transition-all
                    ${theme === 'dark' ? 'text-black' : 'text-white'}
                    ${theme === 'dark' ? 'scale-0' : 'scale-100'}`}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

export default ThemeToggle
