import { Contact } from '@/components/landing/Contact';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { Navbar } from '@/components/landing/Navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeSwitch } from '@/components/theme-switch';
import { useTheme } from '@/components/theme-provider';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { ThemeToggle } from '@/components/them-toggle';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const { theme } = useTheme();
    const logoSrc = theme === 'dark' ? '/assets/white.svg' : '/assets/black.svg';

    // Simplified menu for Navbar
    const menu = [
        { title: "Home", url: "/" },
        { title: "Contact", url: "#contact" }
    ];

    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen bg-background">
                {/* Theme Switch */}
                <div className="fixed z-50 bottom-6 right-6">
                    <ThemeToggle />
                </div>

                {/* Header with Navbar */}
                <header className="fixed top-0 left-0 right-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 lg:px-8">
                    <Navbar
                        logo={{
                            url: "/",
                            src: logoSrc,
                            alt: "Logo",
                            title: "Kelas Terbuka"
                        }}
                        menu={menu}
                        auth={{
                            isAuth: auth.user ? true : false,
                            login: {
                                text: "Log in",
                                url: route('login')
                            },
                            signup: {
                                text: "Register",
                                url: route('register')
                            }
                        }}
                    />
                </header>

                {/* Main Content */}
                <main className="px-8 pt-16 lg:px-12"> {/* Restored padding-top */}
                    {/* Hero Section */}
                    <Hero
                        heading="Kelas Terbuka"
                        description="Platform manajemen akademik modern untuk memudahkan pengelolaan data siswa, guru, dan aktivitas sekolah. Dengan fitur absensi digital, pencatatan pelanggaran, dan pemantauan nilai yang terintegrasi."
                        buttons={{
                            primary: {
                                text: "Mulai Sekarang",
                                url: auth.user ? route('dashboard') : route('register')
                            },
                            secondary: {
                                text: auth.user ? "Dashboard" : "Hubungi Kami",
                                url: auth.user ? route('dashboard') : "#contact"
                            }
                        }}
                        image={{
                            src: logoSrc,
                            alt: "Kelas Terbuka Logo"
                        }}
                    />

                    {/* Contact Section */}
                    <div id="contact" className="bg-secondary/5">
                        <Contact />
                    </div>
                </main>

                <Footer
                    logo={{
                        url: "/",
                        src: logoSrc,
                        alt: "Kelas Terbuka",
                        title: "Kelas Terbuka"
                    }}
                    tagline="Sistem Informasi Akademik Digital"
                    copyright={`© ${new Date().getFullYear()} Kelas Terbuka. All rights reserved.`}
                />
            </div>
        </>
    );
}
