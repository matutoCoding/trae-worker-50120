import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

interface SegmentedItem {
  label: string
  value: string
}

interface SegmentedControlProps {
  items: SegmentedItem[]
  value: string
  onChange: (value: string) => void
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ items, value, onChange }) => {
  return (
    <View className={styles.container}>
      {items.map((item) => (
        <View
          key={item.value}
          className={classnames(styles.item, value === item.value && styles.active)}
          onClick={() => onChange(item.value)}
        >
          <Text>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}

export default SegmentedControl
