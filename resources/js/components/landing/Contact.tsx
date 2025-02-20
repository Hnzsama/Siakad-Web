import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
    return (
        <section className="w-full py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-sm font-semibold">Reach Us</span>
                    <h2 className="mb-3 mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                        Speak with Our Friendly Team
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        We&apos;d love to assist you. Fill out the form or drop us an email.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center">
                        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent">
                            <Mail className="size-6" />
                        </span>
                        <p className="mb-2 text-lg font-semibold">Email Us</p>
                        <p className="mb-3 text-muted-foreground">
                            Our team is ready to assist.
                        </p>
                        <a href="mailto:abc@example.com" className="font-semibold hover:underline">
                            abc@example.com
                        </a>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent">
                            <MapPin className="size-6" />
                        </span>
                        <p className="mb-2 text-lg font-semibold">Visit Us</p>
                        <p className="mb-3 text-muted-foreground">
                            Drop by our office for a chat.
                        </p>
                        <a href="#" className="font-semibold hover:underline">
                            1234 Street Name, City Name
                        </a>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent">
                            <Phone className="size-6" />
                        </span>
                        <p className="mb-2 text-lg font-semibold">Call Us</p>
                        <p className="mb-3 text-muted-foreground">
                            We&apos;re available Mon-Fri, 9am-5pm.
                        </p>
                        <a href="tel:+1234567890" className="font-semibold hover:underline">
                            +123 456 7890
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Contact };
