import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import SegmentedControl from '@/components/SegmentedControl'
import ListItem from '@/components/ListItem'
import Button from '@/components/Button'
import { mockBodies } from '@/data/mock'
import { BodyTypeList, type Body } from '@/types'
import { formatDate } from '@/utils'
import styles from './index.module.scss'

const typeItems = [
  { label: '全部', value: 'all' },
  ...BodyTypeList.map(t => ({ label: t, value: t }))
]

const statusItems = [
  { label: '全部', value: 'all' },
  { label: '待加工', value: 'pending' },
  { label: '加工中', value: 'processing' },
  { label: '已完成', value: 'finished' }
]

const BodyPage: React.FC = () => {
  const [currentType, setCurrentType] = useState('all')
  const [currentStatus, setCurrentStatus] = useState('all')

  const filteredBodies = useMemo(() => {
    return mockBodies.filter(b => {
      const typeMatch = currentType === 'all' || b.type === currentType
      const statusMatch = currentStatus === 'all' || b.status === currentStatus
      return typeMatch && statusMatch
    })
  }, [currentType, currentStatus])

  const handleClick = (body: Body) => {
    Taro.showToast({ title: `查看 ${body.name}`, icon: 'none' })
  }

  const handleRegister = () => {
    Taro.navigateTo({ url: '/pages/body-register/index' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.filters}>
        <ScrollView scrollX className={styles.typeTabs}>
          <SegmentedControl items={typeItems} value={currentType} onChange={setCurrentType} />
        </ScrollView>
        <View className={styles.statusTabs}>
          {statusItems.map(item => (
            <Text
              key={item.value}
              className={classnames(styles.statusTab, currentStatus === item.value && styles.statusTabActive)}
              onClick={() => setCurrentStatus(item.value)}
            >
              {item.label}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView scrollY className={styles.list}>
        {filteredBodies.length > 0 ? (
          filteredBodies.map(body => (
            <ListItem
              key={body.id}
              title={body.name}
              status={body.status}
              meta={[
                { label: '类型', value: body.type },
                { label: '材质', value: body.material },
                { label: '尺寸', value: body.size }
              ]}
              desc={body.description}
              footerText={`登记日期：${formatDate(body.registerDate)} · 来源：${body.source}`}
              onClick={() => handleClick(body)}
            />
          ))
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyText}>暂无胎体数据</Text>
            <Button onClick={handleRegister}>登记新胎体</Button>
          </View>
        )}
      </ScrollView>

      <View className={styles.fab} onClick={handleRegister}>
        <Text className={styles.fabText}>+</Text>
      </View>
    </View>
  )
}

export default BodyPage
