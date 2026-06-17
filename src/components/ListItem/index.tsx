import React from 'react'
import { View, Text } from '@tarojs/components'
import Tag from '@/components/Tag'
import { getStatusText, getStatusColor } from '@/utils'
import styles from './index.module.scss'

interface MetaItem {
  label: string
  value: string
}

interface ListItemProps {
  title: string
  meta?: MetaItem[]
  desc?: string
  tags?: string[]
  status?: string
  footerText?: string
  onClick?: () => void
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  meta,
  desc,
  tags,
  status,
  footerText,
  onClick
}) => {
  return (
    <View className={styles.container} onClick={onClick}>
      <View className={styles.header}>
        <Text className={styles.title}>{title}</Text>
        {status && (
          <Tag text={getStatusText(status)} color={getStatusColor(status)} />
        )}
      </View>
      {meta && meta.length > 0 && (
        <View className={styles.meta}>
          {meta.map((item, index) => (
            <View key={index} className={styles.metaItem}>
              <Text className={styles.metaLabel}>{item.label}</Text>
              <Text>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
      {tags && tags.length > 0 && (
        <View className={styles.tags}>
          {tags.map((tag, index) => (
            <Tag key={index} text={tag} type="gold" />
          ))}
        </View>
      )}
      {desc && <Text className={styles.desc}>{desc}</Text>}
      {footerText && (
        <View className={styles.footer}>
          <Text className={styles.footerText}>{footerText}</Text>
        </View>
      )}
    </View>
  )
}

export default ListItem
