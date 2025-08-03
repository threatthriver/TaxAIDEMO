
'use client'
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const sections = [
  {
    title: 'experiences',
    description: 'Our eyes are set on an entirely new class of AI-centered experiences built for people.',
    image: 'https://placehold.co/1080x720.png'
  },
  {
    title: 'connection',
    description: 'We make beautiful, interconnected experiences that are infused with warmth.',
    image: 'https://placehold.co/1080x720.png'
  }
];

const values = [
  {
    title: 'Kindness',
    description: 'Kindness is at the heart of how we conduct ourselves.',
    image: 'https://placehold.co/400x400.png'
  },
  {
    title: 'Trust',
    description: 'We put our users first and focus on earning their trust.',
    image: 'https://placehold.co/400x400.png'
  },
  {
    title: 'Quality',
    description: 'We only deliver beautiful, reliable and category-defining products that delight.',
    image: 'https://placehold.co/400x400.png'
  },
];

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState(0);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const newSection = Math.min(sections.length - 1, Math.floor(latest * 4));
      if (newSection !== currentSection) {
        setCurrentSection(newSection);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, currentSection]);

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  const safeCurrentSection = sections[currentSection] || sections[0];
  
  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-[#f5f3ef] min-h-screen text-[#3a3a3a]">
      {/* Hero Section */}
      <div className="h-[150vh] relative">
        <motion.div style={{ y }} className="sticky top-0 h-screen flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-7xl md:text-9xl font-serif">
              We build
              <br />
              <motion.span
                key={safeCurrentSection.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="inline-block"
              >
                {safeCurrentSection.title}.
              </motion.span>
            </h1>
            <motion.p
              key={safeCurrentSection.description}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-4 text-xl max-w-2xl mx-auto"
            >
              {safeCurrentSection.description}
            </motion.p>
          </div>
          <motion.div
            key={safeCurrentSection.image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={safeCurrentSection.image}
              alt={safeCurrentSection.title}
              fill
              objectFit="cover"
              className="opacity-20"
              data-ai-hint="people meeting"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="py-32">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-serif">Our Values</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            In everything we do, we embody the following principles:
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="relative border-b border-gray-300 py-8"
              onMouseEnter={() => setHoveredValue(index)}
              onMouseLeave={() => setHoveredValue(null)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-5xl font-serif text-gray-400 hover:text-gray-800 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-lg max-w-xs text-right">{value.description}</p>
              </div>
              <AnimatePresence>
                {hoveredValue === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: -40, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full"
                  >
                    <Image
                      src={value.image}
                      alt={`${value.title} value`}
                      width={150}
                      height={150}
                      className="rounded-full shadow-2xl"
                      data-ai-hint="abstract technology"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
