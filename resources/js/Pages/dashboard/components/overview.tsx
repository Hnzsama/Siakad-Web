import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { usePage } from '@inertiajs/react'
import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';

interface ClassData {
    id: string;
    name: string;
    total: number;
}


interface Response extends PageProps {
    studentsPerClass: ClassData[];
    auth: {
        user: User;
    }
}

export function Overview() {
    const { studentsPerClass } = usePage<Response>().props

    return (
        <ResponsiveContainer width='100%' height={350}>
            <BarChart data={studentsPerClass}>
                <XAxis
                    dataKey='name'
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value} siswa`}
                />
                <Tooltip
                    formatter={(value) => [`${value} siswa`, 'Total']}
                    labelStyle={{ color: '#888888' }}
                />
                <Bar
                    dataKey='total'
                    fill='currentColor'
                    radius={[4, 4, 0, 0]}
                    className='fill-primary'
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
