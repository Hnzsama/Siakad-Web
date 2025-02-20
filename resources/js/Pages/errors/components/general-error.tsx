import { Head, Link } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
    minimal?: boolean
}

export default function GeneralError({
    className,
    minimal = false,
}: GeneralErrorProps) {
    return (
        <>
            <Head title="500 Server Error" />
            <div className={cn('h-svh w-full', className)}>
                <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
                    {!minimal && (
                        <h1 className='text-[7rem] font-bold leading-tight'>500</h1>
                    )}
                    <span className='font-medium'>Oops! Something went wrong {`:')`}</span>
                    <p className='text-center text-muted-foreground'>
                        We apologize for the inconvenience. <br /> Please try again later.
                    </p>
                    {!minimal && (
                        <div className='mt-6 flex gap-4'>
                            <Button variant='outline' onClick={() => window.history.back()}>
                                Go Back
                            </Button>
                            <Link href='/'>
                                <Button>Back to Home</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
