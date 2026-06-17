import React, { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import Tag from '@/components/Tag'
import { useAppStore } from '@/store'
import { formatDate, formatDateTime, getStatusText, getStatusColor, calcDurationText } from '@/utils'
import styles from './index.module.scss'

const WorkDetailPage: React.FC = () => {
  const { state } = useAppStore()
  const router = useRouter()
  const workId = router.params.id || 'w001'

  const work = useMemo(() => {
    return state.workArchives.find(w => w.id === workId) || state.workArchives[0]
  }, [state.workArchives, workId])

  const body = useMemo(() => {
    return state.bodies.find(b => b.id === work.bodyId)
  }, [state.bodies, work])

  const getWorkTags = () => {
    const tags: { text: string; type?: any }[] = [{ text: work.style, type: 'gold' as const }]
    if (work.hasMakiE) tags.push({ text: '含莳绘', type: 'primary' as const })
    if (work.hasGoldPaint) tags.push({ text: '含描金', type: 'primary' as const })
    return tags
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.workName}>{work.name}</Text>
        <Text className={styles.workArtist}>工艺师：{work.artist}</Text>
        <Text className={styles.workStyle}>
          {getStatusText(work.status)} · {work.style}
        </Text>
        <View className={styles.tags}>
          {getWorkTags().map((tag, idx) => (
            <Tag key={idx} text={tag.text} type={tag.type} />
          ))}
        </View>
      </View>

      <View className={styles.basicInfo}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>胎体名称</Text>
          <Text className={styles.infoValue}>{work.bodyName}</Text>
        </View>
        {body && (
          <>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>胎体类型</Text>
              <Text className={styles.infoValue}>{body.type}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>胎体材质</Text>
              <Text className={styles.infoValue}>{body.material}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>尺寸规格</Text>
              <Text className={styles.infoValue}>{body.size}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>胎体来源</Text>
              <Text className={styles.infoValue}>{body.source}</Text>
            </View>
          </>
        )}
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>工艺师</Text>
          <Text className={styles.infoValue}>{work.artist}</Text>
        </View>
        {work.finishDate && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>完成日期</Text>
            <Text className={styles.infoValue}>{formatDate(work.finishDate)}</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>作品描述</Text>
        <View className={styles.descBox}>
          <Text>{work.description}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          工序进度（{work.processRecords.filter(r => r.status === 'finished').length}/{work.processRecords.length || 0}）
        </Text>
        {work.processRecords.length > 0 ? (
          <View className={styles.timeline}>
            {work.processRecords.map((record, idx) => (
              <View key={record.id} className={styles.timelineItem}>
                <View className={classnames(styles.timelineDot, {
                  [styles.dotFinished]: record.status === 'finished',
                  [styles.dotProcessing]: record.status === 'processing',
                  [styles.dotPending]: record.status === 'pending'
                })} />
                <View className={styles.timelineLine} />
                <View className={styles.timelineHeader}>
                  <Text className={styles.timelineType}>
                    {record.processType}（第{record.layer}层）
                  </Text>
                  <Text className={classnames(styles.timelineStatus, {
                    [styles.statusFinished]: record.status === 'finished',
                    [styles.statusProcessing]: record.status === 'processing'
                  })}>
                    {getStatusText(record.status)}
                  </Text>
                </View>
                <Text className={styles.timelineMeta}>
                  {formatDateTime(record.date)} · {record.operator} · 用时{calcDurationText(record.duration)}
                </Text>
                {record.temperature && (
                  <Text className={styles.timelineMeta}>
                    温度 {record.temperature}°C · 湿度 {record.humidity}%
                  </Text>
                )}
                {record.notes && <Text className={styles.timelineNote}>{record.notes}</Text>}
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: '26rpx', color: '#8B7355' }}>暂无工序记录</Text>
        )}
      </View>

      {work.careGuide && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>养护指导</Text>
          <View className={styles.careBox}>
            <Text className={styles.careTitle}>漆器养护须知</Text>
            <Text className={styles.careContent}>{work.careGuide}</Text>
          </View>
        </View>
      )}

      {work.price && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>销售信息</Text>
          <View className={styles.priceBox}>
            <Text className={styles.priceLabel}>
              {work.status === 'sold' ? '已售价格' : '参考售价'}
            </Text>
            <Text className={styles.priceValue}>¥{work.price.toLocaleString()}</Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default WorkDetailPage
