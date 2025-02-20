import {
    IconActivity,
    IconAlertCircle,
    IconAlertOctagon,
    IconAlertTriangle,
    IconBarrierBlock,
    IconBookmarkQuestion,
    IconBrowserCheck,
    IconBug,
    IconBuildingArch,
    IconBuildingCommunity,
    IconBulb,
    IconCalendarEvent,
    IconCalendarOff,
    IconCalendarStats,
    IconCalendarTime,
    IconChecklist,
    IconCircuitGround,
    IconClock12,
    IconClockEdit,
    IconError404,
    IconFileAlert,
    IconFingerprint,
    IconHelp,
    IconHistory,
    IconLayoutDashboard,
    IconList,
    IconLock,
    IconLockAccess,
    IconMessages,
    IconNotification,
    IconPackages,
    IconPalette,
    IconSchool,
    IconServerOff,
    IconSettings,
    IconShieldCheck,
    IconShieldCheckFilled,
    IconTimeline,
    IconTimelineEventPlus,
    IconTool,
    IconUserCheck,
    IconUserCog,
    IconUserOff,
    IconUsers,
    IconUsersGroup,
    IconUserShield,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData as SidebarProps } from '../types'
import { usePage } from '@inertiajs/react'
import { can, hasAnyRole, hasRole } from '@/utils/permissions'

export const SidebarData = () => {
    const { user } = usePage().props.auth
    const { school } = usePage().props
    const teacher = user.teacher
    const student = user.student
    const guardian = user.guardian
    const prefix = '/admin'

    const sidebarData: SidebarProps = {
        user: {
            name: user.name,
            email: user.email,
            avatar_url: user.avatar_url ?? '',
        },
        teams: [
            {
                name: school?.name ?? "",
                logo: IconSchool,
                plan: 'Kelas Terbuka',
            },
        ],
        navGroups: [
            {
                title: 'Menu Utama',
                items: [
                    {
                        title: 'Dasbor',
                        url: `${prefix}/dashboard`,
                        icon: IconLayoutDashboard,
                        visible: true
                    },
                    {
                        title: 'Pengumuman',
                        url: `${prefix}/announcements`,
                        icon: IconBulb,
                        visible: false
                    }
                ]
            },
            {
                title: 'Manajemen Akademik',
                items: [
                    {
                        title: 'Semester',
                        url: `${prefix}/semesters`,
                        icon: IconCalendarEvent,
                        visible: can('view_any_semester')
                    },
                    {
                        title: 'Sekolah',
                        url: `${prefix}/schools`,
                        icon: IconSchool,
                        visible: false
                    },
                    {
                        title: 'Jurusan',
                        url: `${prefix}/majors`,
                        icon: IconPalette,
                        visible: can('view_any_major')
                    },
                    {
                        title: 'Tingkat Kelas',
                        url: `${prefix}/classLevels`,
                        icon: IconTimelineEventPlus,
                        visible: can('view_any_class_level')
                    },
                    {
                        title: 'Kelompok Belajar',
                        url: `${prefix}/studyGroups`,
                        icon: IconUsersGroup,
                        visible: can('view_any_study_group')
                    },
                    {
                        title: 'Kelas',
                        url: `${prefix}/classrooms`,
                        icon: IconBuildingCommunity,
                        visible: can('view_any_classroom') && hasRole('admin') ? true : false
                    },
                    {
                        title: 'Kelas',
                        url: `${prefix}/classrooms/${student?.classroom_id}`,
                        icon: IconBuildingCommunity,
                        visible: can('view_classroom') && hasRole('student') ? true : false
                    },
                    {
                        title: 'Mata Pelajaran',
                        url: `${prefix}/subjects`,
                        icon: IconBookmarkQuestion,
                        visible: can('view_any_subject')
                    },
                    {
                        title: 'Mapel Yang diajar',
                        url: `${prefix}/subjectTeachers`,
                        icon: IconUserCog,
                        visible: can('view_any_subject_teacher')
                    },
                    {
                        title: hasRole('teacher') ? 'Jadwal Mengajar' : 'Jadwal Palajaran',
                        url: `${prefix}/classSubjects`,
                        icon: IconCalendarTime,
                        visible: can('view_any_class_subject') && !hasRole('student') ? true : false
                    },
                    {
                        title: 'Jadwal Pelajaran',
                        url: `${prefix}/classSubjects/${student?.classroom_id}`,
                        icon: IconCalendarTime,
                        visible: can('view_class_subject') && hasRole('student') ? true : false
                    }
                ]
            },
            {
                title: 'Manajemen Personel',
                items: [
                    {
                        title: 'Peran',
                        url: `${prefix}/roles`,
                        icon: IconShieldCheckFilled,
                        visible: can('view_any_role')
                    },
                    {
                        title: 'Pengguna',
                        url: `${prefix}/users`,
                        icon: IconUsers,
                        visible: can('view_any_user')
                    },
                    {
                        title: 'Guru',
                        url: `${prefix}/teachers`,
                        icon: IconUsersGroup,
                        visible: can('view_any_teacher')
                    },
                    {
                        title: 'Wali Kelas',
                        url: `${prefix}/teachers/${guardian?.id}`,
                        icon: IconUsersGroup,
                        visible: can('view_teacher') && hasRole('guardian') ? true : false
                    },
                    {
                        title: 'Orang Tua',
                        url: `${prefix}/guardians`,
                        icon: IconUserShield,
                        visible: can('view_any_guardian') && teacher?.homeroom_teacher !== null ? true : false
                    },
                    {
                        title: 'Orang Tua',
                        url: `${prefix}/guardians/${student?.guardian_id}`,
                        icon: IconUserShield,
                        visible: can('view_guardian') && hasRole('student') && student?.guardian_id ? true : false
                    },
                    {
                        title: 'Siswa',
                        url: `${prefix}/students`,
                        icon: IconUserCheck,
                        visible: can('view_any_student') && teacher?.homeroom_teacher !== null ? true : false
                    },
                    {
                        title: 'Siswa',
                        url: `${prefix}/students/${guardian?.id}`,
                        icon: IconUserCheck,
                        visible: can('view_student') && hasRole('guardian') ? true : false
                    },
                    {
                        title: 'Riwayat Siswa',
                        url: `${prefix}/studentHistories`,
                        icon: IconHistory,
                        visible: false
                    }
                ]
            },
            {
                title: 'Manajemen Operasional',
                items: [
                    {
                        title: 'Shift',
                        url: `${prefix}/shifts`,
                        icon: IconClock12,
                        visible: can('view_any_shift')
                    },
                    {
                        title: 'Jadwal',
                        url: `${prefix}/schedules`,
                        icon: IconCalendarStats,
                        visible: can('view_any_schedule')
                    },
                    {
                        title: 'Instansi',
                        url: `${prefix}/agencies`,
                        icon: IconBuildingArch,
                        visible: can('view_any_agency')
                    },
                    {
                        title: 'Instansi',
                        url: `${prefix}/agencies/${student ? student.id : teacher ? teacher.id : ''}`,
                        icon: IconBuildingArch,
                        visible: can('view_agency') && hasAnyRole(['student', 'teacher']) ? true : false
                    }
                ]
            },
            {
                title: 'Absensi & Monitoring',
                items: [
                    {
                        title: 'Absensi',
                        url: `${prefix}/attendances`,
                        icon: IconCalendarTime,
                        visible: can('view_any_attendance')
                    },
                    {
                        title: 'Absensi',
                        url: `${prefix}/attendances/monthly/${new Date().getFullYear()}`,
                        icon: IconCalendarTime,
                        visible: can('view_attendance') && hasAnyRole(['student', 'teacher']) ? true : false
                    }
                ]
            },
            {
                title: 'Manajemen Disiplin',
                items: [
                    {
                        title: 'Kategori Peringatan',
                        url: `${prefix}/warningCategories`,
                        icon: IconAlertTriangle,
                        visible: can('view_any_warning_category')
                    },
                    {
                        title: 'Surat Peringatan',
                        url: `${prefix}/warningLetters`,
                        icon: IconFileAlert,
                        visible: can('view_any_warning_letter')
                    },
                    {
                        title: 'Surat Peringatan',
                        url: `${prefix}/warningLetters/${student ? student.id : guardian ? guardian.id : ''}`,
                        icon: IconFileAlert,
                        visible: can('view_warning_letter') && hasAnyRole(['student', 'guardian']) ? true : false
                    },
                    {
                        title: 'Jenis Pelanggaran',
                        url: `${prefix}/violationTypes`,
                        icon: IconAlertOctagon,
                        visible: can('view_any_violation_type')
                    },
                    {
                        title: 'Pelanggaran',
                        url: `${prefix}/violations`,
                        icon: IconAlertCircle,
                        visible: can('view_any_violation')
                    },
                    {
                        title: 'Pelanggaran',
                        url: `${prefix}/violations/${student ? student.id : guardian ? guardian.id : ''}`,
                        icon: IconAlertCircle,
                        visible: can('view_violation') && hasAnyRole(['student', 'guardian']) ? true : false
                    }
                ]
            },
            {
                title: 'Manajemen Cuti',
                items: [
                    {
                        title: 'Jenis Cuti',
                        url: `${prefix}/leaveTypes`,
                        icon: IconList,
                        visible: can('view_any_leave_type')
                    },
                    {
                        title: 'Pengajuan Cuti',
                        url: `${prefix}/leaveRequests`,
                        icon: IconCalendarOff,
                        visible: can('view_any_leave_request')
                    },
                    {
                        title: 'Pengajuan Cuti',
                        url: `${prefix}/leaveRequests/${student ? student.id : guardian ? guardian.id : teacher ? teacher.id : ''}`,
                        icon: IconCalendarOff,
                        visible: can('view_leave_request') && hasAnyRole(['student', 'teacher', 'guardian']) ? true : false
                    },
                ]
            },
            {
                title: 'Lainnya',
                items: [
                    {
                        title: 'Pengaturan',
                        icon: IconSettings,
                        items: [
                            {
                                title: 'Profil',
                                url: '/settings',
                                icon: IconUserCog
                            },
                            {
                                title: 'Akun',
                                url: '/settings/account',
                                icon: IconTool
                            },
                            //   {
                            //     title: 'Penampilan',
                            //     url: '/settings/appearance',
                            //     icon: IconPalette
                            //   },
                            //   {
                            //     title: 'Notifikasi',
                            //     url: '/settings/notifications',
                            //     icon: IconNotification
                            //   },
                            //   {
                            //     title: 'Tampilan',
                            //     url: '/settings/display',
                            //     icon: IconBrowserCheck
                            //   },
                            {
                                title: 'Absensi',
                                url: '/settings/attendanceSetting',
                                icon: IconClockEdit,
                                visible: hasRole('admin') ? true : false
                            },
                        ]
                    },
                    {
                        title: 'Pusat Bantuan',
                        url: '/help-center',
                        icon: IconHelp
                    }
                ]
            }
        ]
    }

    return sidebarData
}
