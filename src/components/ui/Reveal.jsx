import { motion } from 'framer-motion'

export default function Reveal({ children, delay = 0, y = 18, className = '', ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
