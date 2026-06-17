import React from 'react'
import { Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

type TagType = 'default' | 'primary' | 'success' | 'warning' | 'info' | 'gold'

interface TagProps {
  text: string
  type?: TagType
  color?: string
}

const Tag: React.FC<TagProps> = ({ text, type = 'default', color }) => {
  const cls = classnames(styles.tag, {
    [styles.primary]: type === 'primary',
    [styles.success]: type === 'success',
    [styles.warning]: type === 'warning',
    [styles.info]: type === 'info',
    [styles.gold]: type === 'gold'
  })

  const style = color ? { color, background: `${color}15` } : undefined

  return <Text className={cls} style={style}>{text}</Text>
}

export default Tag
