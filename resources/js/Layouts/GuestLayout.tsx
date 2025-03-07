interface Props {
    children: React.ReactNode
}

export default function GuestLayout({ children }: Props) {
    return (
        <div className="flex items-center justify-center w-full min-h-svh bg-primary-foreground">
            <div className='container grid flex-col items-center justify-center h-svh lg:max-w-none lg:px-0'>
                <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
                    <div className='flex items-center justify-center mb-4'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='w-6 h-6 mr-2'
                        >
                            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
                        </svg>
                        <h1 className='text-xl font-medium'>Kelas Terbuka</h1>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
