import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="animated-bg">
      {/* Grid Pattern */}
      <div className="grid-pattern" />
      
      {/* Floating Orbs */}
      <motion.div 
        className="orb orb-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.div 
        className="orb orb-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
      />
      <motion.div 
        className="orb orb-3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
      />
      <motion.div 
        className="orb orb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 2, delay: 0.9, ease: "easeOut" }}
      />
      
      {/* Additional Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-blue-400/30 animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-purple-400/30 animate-pulse animation-delay-500" />
      <div className="absolute bottom-1/4 left-1/2 w-2 h-2 rounded-full bg-pink-400/30 animate-pulse animation-delay-1000" />
      <div className="absolute top-2/3 right-1/4 w-1 h-1 rounded-full bg-cyan-400/30 animate-pulse animation-delay-1500" />
    </div>
  );
};

export default AnimatedBackground;
