import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

interface QuickItem {
  label: string
  icon: string
  path?: string
  onClick?: () => void
}

interface QuickEntryProps {
  items: QuickItem[]
}

const QuickEntry: React.FC<QuickEntryProps> = ({ items }) => {
  const handleClick = (item: QuickItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (item.path) {
      Taro.navigateTo({ url: item.path })
    }
  }

  return (
    <View style={{ display: 'flex' }}>
      {items.map((item, index) => (
        <View key={index} className={styles.item} onClick={() => handleClick(item)}>
          <View className={styles.container}>
            <Text className={styles.iconText}>{item.icon}</Text>
          </View>
          <Text className={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}

export default QuickEntry
