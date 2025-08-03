
'use client';
import Image from "next/image";

const teamMembers = [
    {
        name: 'Jasmine Patel',
        role: 'LEAD AI STRATEGIST',
        imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDB8fHx8MTc1Mzk2NTAwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
        bgColor: 'bg-primary/20',
        description: 'Jasmine pioneers our AI-driven tax analysis, ensuring our strategies are always one step ahead.',
        linkText: 'The Future of Tax Law →'
    },
    {
        name: 'Leo Rodriguez',
        role: 'HEAD OF ENGINEERING',
        imageUrl: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbnxlbnwwfHx8fDE3NTM5NjUwMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
        bgColor: 'bg-accent',
        description: 'Leo leads the development of our robust platform, turning complex algorithms into a seamless user experience.',
        linkText: 'Building Secure FinTech →'
    }
]

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen py-20 md:py-32">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="md:col-span-1">
                        <h1 className="font-serif text-6xl font-light text-foreground leading-tight">
                            Get to<br/>know us
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Meet the brilliant minds behind TaxAI.
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-24">
                           {teamMembers.map((member, index) => (
                               <div key={member.name} className={`relative ${index % 2 !== 0 ? 'sm:mt-24' : ''}`}>
                                   <div className="relative group">
                                       <div className={`absolute -inset-4 ${member.bgColor} rounded-full transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3`} style={{clipPath: 'ellipse(60% 50% at 50% 50%)'}} />
                                       <Image
                                           src={member.imageUrl}
                                           alt={member.name}
                                           width={400}
                                           height={500}
                                           className="relative z-10 w-full rounded-lg shadow-lg object-cover h-[400px]"
                                           data-ai-hint="professional portrait"
                                       />
                                       <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                                           <div className="bg-foreground/80 backdrop-blur-sm text-background w-56 h-56 rounded-full flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <p className="text-xl font-semibold leading-tight">{member.description}</p>
                                                <p className="text-sm mt-3 font-medium text-primary">{member.linkText}</p>
                                           </div>
                                       </div>
                                   </div>
                                   <div className="mt-6 text-center">
                                       <p className="text-sm font-semibold text-primary tracking-widest">{member.role}</p>
                                       <p className="text-xl font-bold text-foreground mt-1">{member.name}</p>
                                   </div>
                               </div>
                           ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
