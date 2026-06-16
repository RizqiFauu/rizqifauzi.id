'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            onComplete();
          }, 500);

          return 100;
        }

        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        exit={{
          opacity: 0,
          filter: 'blur(20px)',
        }}
        className="
          fixed inset-0 z-[999]
          flex flex-col items-center justify-center
          bg-background
        "
      >
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            text-5xl
            font-bold
            mb-4
          "
        >
          Rizqi{' '}
          <span className="text-primary">
            Fauzi
          </span>
        </motion.h1>

        <p className="text-muted-foreground mb-8">
          Loading Experience...
        </p>

        <div className="w-[240px] h-[3px] bg-muted rounded-full">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          {progress}%
        </div>
      </motion.div>
    </AnimatePresence>
  );
}