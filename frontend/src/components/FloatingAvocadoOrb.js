import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const FloatingAvocadoOrb = () => {
  const { scrollYProgress } = useScroll();
  
  // Smooth spring physics for the orb movement
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  // Y position follows scroll with smooth spring
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 200]),
    springConfig
  );
  
  // Rotation effect
  const rotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 360]),
    springConfig
  );
  
  // Scale pulses subtly
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);
  
  // Opacity fades in and out at key points
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.4, 0.6, 0.9, 1],
    [1, 1, 0.8, 0.6, 0.3, 0]
  );

  return (
    <motion.div
      className="fixed top-1/4 right-[10%] z-30 pointer-events-none"
      style={{ y, opacity }}
    >
      <motion.div
        style={{ rotate, scale }}
        className="relative"
      >
        {/* Main orb with gradient */}
        <motion.div
          className="w-32 h-32 rounded-full relative"
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-avocado-light/30 to-avocado-forest/30 blur-2xl" />
          
          {/* Main sphere */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-avocado-light via-avocado-forest to-[#8B4513] shadow-2xl">
            {/* Shine effect */}
            <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/40 blur-xl" />
            
            {/* Subtle texture */}
            <div className="absolute inset-0 rounded-full opacity-20" 
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 50%)'
              }}
            />
          </div>
          
          {/* Rotating ring */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-1/2 left-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-avocado-light/50 to-transparent transform -translate-x-1/2 -translate-y-1/2 blur-sm" />
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-avocado-light"
            style={{
              top: `${30 + i * 20}%`,
              left: `${20 + i * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
