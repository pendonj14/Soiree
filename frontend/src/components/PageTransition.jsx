import { motion } from 'framer-motion'

export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    style={{ width: '100%' }}
  >
    {children}
  </motion.div>
)
