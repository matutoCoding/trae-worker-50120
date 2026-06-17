import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface SectionCardProps {
  title: string
  extra?: string
  children: React.ReactNode
  onClick?: () => void
}

const SectionCard: React.FC<SectionCardProps> = ({ title, extra, children, onClick }) => {
  return (
    <View className={styles.container} onClick={onClick}>
      <View className={styles.header}>
        <Text className={styles.title}>{title}</Text>
        {extra && <Text className={styles.extra}>{extra}</Text>}
      </View>
      <View className={styles.content}>{children}</View>
    </View>
  )
}

export default SectionCard
