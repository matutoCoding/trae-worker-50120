import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import SegmentedControl from '@/components/SegmentedControl'
import Tag from '@/components/Tag'
import { useAppStore } from '@/store'
import { formatDate, getStatusText, getStatusColor } from '@/utils'
import styles from './index.module.scss'

const statusItems = [
  { label: '全部', value: 'all' },
  { label: '制作中', value: 'in_progress' },
  { label: '已完成', value: 'finished' },
  { label: '已售出', value: 'sold' }
]

const ArchivePage: React.FC = () => {
  const { state } = useAppStore()
  const [currentStatus, setCurrentStatus] = useState('all')

  const filteredWorks = useMemo(() => {
    if (currentStatus === 'all') return state.workArchives
    return state.workArchives.filter(w => w.status === currentStatus)
  }, [state.workArchives, currentStatus])

  const handleWorkClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/work-detail/index?id=${id}` })
  }

  const getWorkTags = (work: typeof state.workArchives[0]) => {
    const tags: string[] = [work.style]
    if (work.hasMakiE) tags.push('莳绘')
    if (work.hasGoldPaint) tags.push('描金')
    return tags
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.filters}>
        <SegmentedControl items={statusItems} value={currentStatus} onChange={setCurrentStatus} />
      </View>

      {filteredWorks.map(work => (
        <View key={work.id} className={styles.workCard} onClick={() => handleWorkClick(work.id)}>
          <View className={styles.workHeader}>
            <Text className={styles.workName}>{work.name}</Text>
            <Tag text={getStatusText(work.status)} color={getStatusColor(work.status)} />
          </View>

          <View className={styles.workMeta}>
            <Text className={styles.workMetaItem}>胎体：{work.bodyName}</Text>
            <Text className={styles.workMetaItem}>工艺师：{work.artist}</Text>
          </View>

          <View className={styles.workTags}>
            {getWorkTags(work).map((tag, idx) => (
              <Tag key={idx} text={tag} type="gold" />
            ))}
          </View>

          <Text className={styles.workDesc}>{work.description}</Text>

          <View className={styles.workFooter}>
            <View>
              <Text className={styles.workArtist}>工艺师：{work.artist}</Text>
              {work.finishDate && (
                <Text className={styles.workFinishDate}>
                  {'  '}· 完成日期：{formatDate(work.finishDate)}
                </Text>
              )}
            </View>
            {work.price && (
              <Text className={styles.workPrice}>¥{work.price.toLocaleString()}</Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

export default ArchivePage
