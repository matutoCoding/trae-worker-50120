import React, { useState, useMemo } from 'react'
import { View, Text, Button as TaroButton, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import SegmentedControl from '@/components/SegmentedControl'
import SectionCard from '@/components/SectionCard'
import Tag from '@/components/Tag'
import Button from '@/components/Button'
import { mockProcessRecords, mockShadowRooms, mockWorkArchives } from '@/data/mock'
import { ProcessTypeList } from '@/types'
import { formatDateTime, getStatusText, getStatusColor, calcDurationText } from '@/utils'
import styles from './index.module.scss'

const tabItems = [
  { label: '髹涂工序', value: 'coating' },
  { label: '荫房调控', value: 'shadow' },
  { label: '打磨推光', value: 'polish' }
]

const processItems = [
  { label: '全部', value: 'all' },
  ...ProcessTypeList.map(t => ({ label: t, value: t }))
]

const polishSteps = ['粗磨', '细磨', '精磨', '推光', '揩清']

const ProcessPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('coating')
  const [currentProcess, setCurrentProcess] = useState('all')

  const filteredProcesses = useMemo(() => {
    if (currentTab !== 'coating') return []
    return mockProcessRecords.filter(r => {
      if (currentProcess === 'all') return true
      return r.processType === currentProcess
    })
  }, [currentTab, currentProcess])

  const polishingWorks = useMemo(() => {
    return mockWorkArchives.filter(w => {
      const hasPolishing = w.processRecords.some(r => r.processType === '打磨' || r.processType === '推光')
      return hasPolishing || w.status === 'in_progress'
    }).slice(0, 5)
  }, [])

  const handleAdjustShadow = (roomId: string) => {
    Taro.showToast({ title: '调控温湿度', icon: 'none' })
  }

  const handleTakeOut = (workId: string) => {
    Taro.showToast({ title: '取出作品', icon: 'none' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabs}>
        <SegmentedControl items={tabItems} value={currentTab} onChange={setCurrentTab} />
      </View>

      {currentTab === 'coating' && (
        <View>
          <ScrollView scrollX style={{ marginBottom: '32rpx' }}>
          <SegmentedControl items={processItems} value={currentProcess} onChange={setCurrentProcess} />
          </ScrollView>
          <View className={styles.section}>
            {filteredProcesses.map(record => (
              <View key={record.id} className={styles.processItem}>
                <View className={styles.processHeader}>
                  <Text className={styles.processWork}>{record.workName}</Text>
                  <Tag text={getStatusText(record.status)} color={getStatusColor(record.status)} />
                </View>
                <View className={styles.processMeta}>
                  <Text className={styles.processMetaItem}>工序：{record.processType}</Text>
                  <Text className={styles.processMetaItem}>第{record.layer}层</Text>
                  <Text className={styles.processMetaItem}>用时：{calcDurationText(record.duration)}</Text>
                </View>
                {record.temperature && (
                  <View className={styles.processMeta}>
                    <Text className={styles.processMetaItem}>温度：{record.temperature}°C</Text>
                    <Text className={styles.processMetaItem}>湿度：{record.humidity}%</Text>
                  </View>
                )}
                <View className={styles.processFooter}>
                  <Text className={styles.processDate}>{formatDateTime(record.date)}</Text>
                  <Text className={styles.processLayer}>操作：{record.operator}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {currentTab === 'shadow' && (
        <View className={styles.section}>
          {mockShadowRooms.map(room => (
            <View key={room.id} className={styles.shadowCard}>
              <View className={styles.shadowHeader}>
                <Text className={styles.shadowName}>{room.name}</Text>
                <Text className={classnames(styles.shadowStatus, room.status === 'normal' ? styles.statusNormal : styles.statusWarning)}>
                  {room.status === 'normal' ? '环境正常' : '环境异常'}
                </Text>
              </View>
              <View className={styles.metrics}>
                <View className={styles.metric}>
                  <Text className={styles.metricValue}>{room.temperature}°C</Text>
                  <Text className={styles.metricLabel}>当前温度</Text>
                  <Text className={styles.metricTarget}>目标 {room.targetTemp}°C</Text>
                </View>
                <View className={styles.metric}>
                  <Text className={styles.metricValue}>{room.humidity}%</Text>
                  <Text className={styles.metricLabel}>当前湿度</Text>
                  <Text className={styles.metricTarget}>目标 {room.targetHumidity}%</Text>
                </View>
              </View>
              <View className={styles.meter}>
                <View className={styles.meterFill} style={{ width: `${room.humidity}%` }} />
              </View>
              <View className={styles.worksInShadow}>
                <Text className={styles.worksTitle}>入荫作品（{room.works.length}件）</Text>
                {room.works.map(work => (
                  <View key={work.workId} className={styles.workItem}>
                    <View>
                      <Text className={styles.workName}>{work.workName}</Text>
                      <Text className={styles.workTime}>入荫：{work.enterTime} ~ {work.expectedExit}</Text>
                    </View>
                    <TaroButton className={styles.enterBtn} onClick={() => handleTakeOut(work.workId)}>
                      取出
                    </TaroButton>
                  </View>
                ))}
              </View>
              <View style={{ marginTop: '24rpx' }}>
                <Button type="outline" size="small" block onClick={() => handleAdjustShadow(room.id)}>
                  调控温湿度
                </Button>
              </View>
            </View>
          ))}

          <SectionCard title="入荫提醒">
            <View style={{ padding: '16rpx 0 }}>
              <Tag text="注意" type="warning" />
              <Text style={{ fontSize: '24rpx', color: '#5C4033', marginLeft: '16rpx' }}>
                    荫房最佳环境：温度20-25°C，湿度70-80%
              </Text>
            </View>
          </SectionCard>
        </View>
      )}

      {currentTab === 'polish' && (
        <View className={styles.polishSection}>
          {polishingWorks.map(work => {
            const polishRecords = work.processRecords.filter(r => r.processType === '打磨' || r.processType === '推光')
            const progress = Math.min(Math.round(polishRecords.length / polishSteps.length * 100), 100)
            return (
              <View key={work.id} className={styles.polishCard}>
                <View className={styles.polishHeader}>
                  <Text className={styles.polishTitle}>{work.name}</Text>
                  <Text className={styles.polishProgress}>{progress}%</Text>
                </View>
                <View style={{ marginBottom: '24rpx' }}>
                  <Text style={{ fontSize: '24rpx', color: '#8B7355' }}>
                    胎体：{work.bodyName} · 工艺师：{work.artist}
                  </Text>
                </View>
                <View className={styles.polishSteps}>
                  {polishSteps.map((step, idx) => {
                  const isDone = polishRecords.length > idx
                  const isActive = polishRecords.length === idx
                  return (
                    <Text
                      key={step}
                      className={classnames(styles.stepItem, {
                        [styles.stepDone]: isDone,
                        [styles.stepActive]: isActive && !isDone
                      })}
                    >
                      {step}
                    </Text>
                  )
                })}
                </View>
              </View>
            )
          })}
          <SectionCard title="莳绘描金工序">
            <View style={{ fontSize: '26rpx', color: '#5C4033', lineHeight: 1.8 }}>
              <Text>莳绘：以金、银屑等金属粉撒于漆面上，再施以漆描绘纹样。</Text>
              <Text style={{ display: 'block', marginTop: '8rpx' }}>
                描金：在漆面用金粉描绘纹饰，是传统漆器装饰技法之一。</Text>
            </View>
          </SectionCard>
        </View>
      )}
    </ScrollView>
  )
}

export default ProcessPage
