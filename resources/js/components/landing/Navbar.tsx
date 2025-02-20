import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import { Link } from "@inertiajs/react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: JSX.Element;
    items?: MenuItem[];
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];
    mobileExtraLinks?: {
        name: string;
        url: string;
    }[];
    auth?: {
        isAuth: boolean;
        login: {
            text: string;
            url: string;
        };
        signup: {
            text: string;
            url: string;
        };
    };
}

const Navbar = ({
    logo = {
        url: "https://www.shadcnblocks.com",
        src: "https://www.shadcnblocks.com/images/block/block-1.svg",
        alt: "logo",
        title: "Shadcnblocks.com",
    },
    menu = [
        { title: "Home", url: "#" },
        {
            title: "Products",
            url: "#",
            items: [
                {
                    title: "Blog",
                    description: "The latest industry news, updates, and info",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Company",
                    description: "Our mission is to innovate and empower the world",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Careers",
                    description: "Browse job listing and discover our workspace",
                    icon: <Sunset className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Support",
                    description:
                        "Get in touch with our support team or visit our community forums",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "#",
                },
            ],
        },
        {
            title: "Resources",
            url: "#",
            items: [
                {
                    title: "Help Center",
                    description: "Get all the answers you need right here",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Contact Us",
                    description: "We are here to help you with any questions you have",
                    icon: <Sunset className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Status",
                    description: "Check the current status of our services and APIs",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Terms of Service",
                    description: "Our terms and conditions for using our services",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "#",
                },
            ],
        },
        {
            title: "Pricing",
            url: "#",
        },
        {
            title: "Blog",
            url: "#",
        },
    ],
    mobileExtraLinks = [
        { name: "Press", url: "#" },
        { name: "Contact", url: "#" },
        { name: "Imprint", url: "#" },
        { name: "Sitemap", url: "#" },
    ],
    auth = {
        isAuth: false,
        login: { text: "Log in", url: "#" },
        signup: { text: "Sign up", url: "#" },
    },
}: NavbarProps) => {
    return (
        <div className="w-full border-b bg-background">
            <div className="px-4 mx-auto max-w-screen-2xl">
                <div className="flex items-center justify-between h-16">
                    {/* Desktop Navigation */}
                    <nav className="hidden w-full lg:flex items-center">
                        <div className="flex items-center gap-6">
                            <Link href={logo.url} className="flex items-center gap-2">
                                <img src={logo.src} className="w-16" alt={logo.alt} />
                                <span className="text-lg font-semibold">{logo.title}</span>
                            </Link>
                            {/* Menu items moved right after logo */}
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {menu.map((item) => renderMenuItem(item))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                        {/* Auth buttons pushed to the right */}
                        <div className="flex items-center gap-2 ml-auto">
                            {auth.isAuth ? (
                                <Button asChild size="sm">
                                    <Link href={route('dashboard')}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={auth.login.url}>{auth.login.text}</Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link href={auth.signup.url}>{auth.signup.text}</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Navigation */}
                    <div className="flex items-center justify-between w-full lg:hidden">
                        <Link href={logo.url} className="flex items-center gap-2">
                            <img src={logo.src} className="w-16" alt={logo.alt} />
                            <span className="text-lg font-semibold">{logo.title}</span>
                        </Link>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>
                                        <Link href={logo.url} className="flex items-center gap-2">
                                            <img src={logo.src} className="w-16" alt={logo.alt} />
                                            <span className="text-lg font-semibold">
                                                {logo.title}
                                            </span>
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 my-6">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="flex flex-col w-full gap-4"
                                    >
                                        {menu.map((item) => renderMobileMenuItem(item))}
                                    </Accordion>
                                    <div className="py-4 border-t">
                                        <div className="grid justify-start grid-cols-2">
                                            {mobileExtraLinks.map((link, idx) => (
                                                <Link
                                                    key={idx}
                                                    className="inline-flex items-center h-10 gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap text-muted-foreground hover:bg-muted hover:text-accent-foreground"
                                                    href={link.url}
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {auth.isAuth ? (
                                            <Button asChild>
                                                <Link href={route('dashboard')}>Dashboard</Link>
                                            </Button>
                                        ) : (
                                            <>
                                                <Button asChild variant="outline">
                                                    <Link href={auth.login.url}>{auth.login.text}</Link>
                                                </Button>
                                                <Button asChild>
                                                    <Link href={auth.signup.url}>{auth.signup.text}</Link>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </div>
    );
};

const renderMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <NavigationMenuItem key={item.title} className="text-muted-foreground">
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="p-3 w-80">
                        <NavigationMenuLink>
                            {item.items.map((subItem) => (
                                <li key={subItem.title}>
                                    <Link
                                        href={subItem.url}
                                        className="flex gap-4 p-3 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-muted hover:text-accent-foreground"
                                    >
                                        {subItem.icon}
                                        <div>
                                            <div className="text-sm font-semibold">
                                                {subItem.title}
                                            </div>
                                            {subItem.description && (
                                                <p className="text-sm leading-snug text-muted-foreground">
                                                    {subItem.description}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </NavigationMenuLink>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <Link
            key={item.title}
            href={item.url}
            className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md group w-max bg-background text-muted-foreground hover:bg-muted hover:text-accent-foreground"
        >
            {item.title}
        </Link>
    );
};

const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <AccordionItem key={item.title} value={item.title} className="border-b-0">
                <AccordionTrigger className="py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((subItem) => (
                        <Link
                            key={subItem.title}
                            href={subItem.url}
                            className="flex gap-4 p-3 leading-none transition-colors rounded-md outline-none select-none hover:bg-muted hover:text-accent-foreground"
                        >
                            {subItem.icon}
                            <div>
                                <div className="text-sm font-semibold">{subItem.title}</div>
                                {subItem.description && (
                                    <p className="text-sm leading-snug text-muted-foreground">
                                        {subItem.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <Link key={item.title} href={item.url} className="font-semibold">
            {item.title}
        </Link>
    );
};

export { Navbar };
