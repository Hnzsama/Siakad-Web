import ContentSection from '../components/content-section';
import { usePage } from '@inertiajs/react';
import StudentProfile from './partials/student-profile';
import TeacherProfile from './partials/teacher-profile';
import GuardianProfile from './partials/guardian-profile';
import SchoolProfile from './partials/school-profile';

export default function ProfileSettings() {
    const { user } = usePage().props.auth
    const { school } = usePage().props

    // Generate profile components based on user relationships
    const profiles = [];

    if (user.student) {
        profiles.push({
            value: 'student',
            label: 'Profil Siswa',
            content: <StudentProfile student={user.student}/>
        });
    }

    if (user.teacher) {
        profiles.push({
            value: 'teacher',
            label: 'Profil Guru',
            content: <TeacherProfile teacher={user.teacher}/>
        });
    }

    if (user.guardian) {
        profiles.push({
            value: 'guardian',
            label: 'Profil Wali',
            content: <GuardianProfile guardian={user.guardian} />
        });
    }

    // Always add school profile
    profiles.push({
        value: 'sekolah',
        label: 'Sekolah',
        content: <SchoolProfile school={school} /> // school is now optional
    });

    // Only use tabs if there's more than one profile
    if (profiles.length === 1) {
        return <ContentSection
            title="Sekolah"
            desc="Perbarui pengaturan dan kelola profil sekolah Anda."
        >
            {profiles[0].content}
        </ContentSection>;
    }

    // Use tabs if there are multiple profiles
    return <ContentSection
        title="Profil"
        desc="Perbarui pengaturan profil dan kelola profil Anda."
        tabs={profiles}
        defaultTab={profiles[0].value}
    />;
}
