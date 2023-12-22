import classNames from 'classnames'
import { motion } from 'framer-motion'
import { type PropsWithChildren } from 'react'
import { useScreenSize } from '@/hooks/useScreenSize'

export default function Motion(props: PropsWithChildren & { className?: string }) {
  const { isSm } = useScreenSize()
  return (
    <motion.div
      initial={{ opacity: 0, translateY: isSm ? '36px' : '72px' }}
      transition={{
        duration: 1,
      }}
      whileInView={{ opacity: 1, translateY: 0 }}
      viewport={{ once: true }}
      className={classNames('w-full', props.className)}
    >
      {props.children}
    </motion.div>
  )
}
