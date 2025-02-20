import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from '@/components/theme-provider';

interface HeroProps {
    badge?: string;
    heading: string;
    description: string;
    buttons?: {
        primary?: {
            text: string;
            url: string;
        };
        secondary?: {
            text: string;
            url: string;
        };
    };
    image: {
        src: string;
        alt: string;
    };
}

const Hero = ({
    badge = "✨ Your Website Builder",
    heading = "Blocks Built With Shadcn & Tailwind",
    description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
    buttons = {
        primary: {
            text: "Discover all components",
            url: "https://www.shadcnblocks.com",
        },
        secondary: {
            text: "View on GitHub",
            url: "https://www.shadcnblocks.com",
        },
    },
    image = {
        src: "https://www.shadcnblocks.com/images/block/placeholder-1.svg",
        alt: "Hero section demo image showing interface components",
    },
}: HeroProps) => {
    const { theme } = useTheme();
    const logoSrc = theme === 'dark' ? '/assets/white.svg' : '/assets/black.svg';

    return (
        <section className="w-full min-h-[calc(100vh-64px)] flex items-center py-20">
            <div className="container px-4 mx-auto md:px-6">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8">
                        <h1 className="text-4xl font-bold tracking-tight lg:text-7xl">
                            {heading}
                        </h1>
                        <p className="max-w-xl text-lg text-muted-foreground lg:text-xl">
                            {description}
                        </p>
                        <div className="flex flex-col justify-center w-full gap-4 sm:flex-row lg:justify-start">
                            {buttons.primary && (
                                <Button asChild size="lg" className="w-full sm:w-auto">
                                    <a href={buttons.primary.url}>{buttons.primary.text}</a>
                                </Button>
                            )}
                            {buttons.secondary && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    <a href={buttons.secondary.url} className="inline-flex items-center">
                                        {buttons.secondary.text}
                                        <ArrowRight className="ml-2 size-4" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                        <div className="flex justify-center object-cover w-full h-auto max-w-2xl rounded-lg shadow-lg py-32 bg-muted/30">
                            <img
                                src={logoSrc}
                                alt={image.alt}
                                className="w-auto h-80"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Hero };
