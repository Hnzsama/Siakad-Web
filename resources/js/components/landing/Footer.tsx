import { useTheme } from '@/components/theme-provider';

interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface FooterProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const Footer = ({
    logo = {
        src: "https://www.shadcnblocks.com/images/block/block-1.svg",
        alt: "blocks for shadcn/ui",
        title: "Shadcnblocks.com",
        url: "https://www.shadcnblocks.com",
    },
    tagline = "Components made easy.",
    menuItems = [
        {
            title: "Layanan",
            links: [
                { text: "Absensi Digital", url: "#" },
                { text: "Pelanggaran Siswa", url: "#" },
                { text: "Penilaian", url: "#" },
                { text: "Jadwal Pelajaran", url: "#" },
            ],
        },
        {
            title: "Pengguna",
            links: [
                { text: "Siswa", url: "#" },
                { text: "Guru", url: "#" },
                { text: "Wali Murid", url: "#" },
                { text: "Administrator", url: "#" },
            ],
        },
        {
            title: "Informasi",
            links: [
                { text: "Panduan Penggunaan", url: "#" },
                { text: "FAQ", url: "#" },
                { text: "Hubungi Kami", url: "#contact" },
            ],
        },
        {
            title: "Legal",
            links: [
                { text: "Ketentuan Layanan", url: "#" },
                { text: "Kebijakan Privasi", url: "#" },
            ],
        },
    ],
    copyright = "© 2024 Copyright. All rights reserved.",
    bottomLinks = [
        { text: "Ketentuan Layanan", url: "#" },
        { text: "Kebijakan Privasi", url: "#" },
    ],
}: FooterProps) => {
    const { theme } = useTheme();
    const logoSrc = theme === 'dark' ? '/assets/white.svg' : '/assets/black.svg';

    return (
        <footer className="w-full py-16 border-t bg-background"> {/* Restored padding */}
            <div className="container px-6 mx-auto lg:px-8"> {/* Restored padding */}
                <div className="grid gap-8 md:gap-12 lg:grid-cols-6">
                    <div className="space-y-4 col-span-full lg:col-span-2">
                        <div className="flex items-center space-x-2">
                            <a href={logo.url} className="flex items-center gap-2">
                                <img
                                    src={logoSrc}
                                    alt={logo.alt}
                                    className="w-auto h-16"
                                />
                                <span className="text-xl font-semibold">{logo.title}</span>
                            </a>
                        </div>
                        <p className="text-lg font-medium text-muted-foreground">
                            {tagline}
                        </p>
                    </div>
                    {menuItems.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-base font-semibold">{section.title}</h3>
                            <ul className="space-y-3 text-sm">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <a
                                            href={link.url}
                                            className="transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center justify-between gap-4 pt-8 mt-16 border-t md:flex-row">
                    <p className="text-sm text-muted-foreground">{copyright}</p>
                    <nav className="flex gap-4">
                        {bottomLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                className="text-sm transition-colors text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                            >
                                {link.text}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export { Footer };
