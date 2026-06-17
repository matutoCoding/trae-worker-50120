import React, { useState, useMemo } from 'react'
import { View, Text, Button as TaroButton, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import SegmentedControl from '@/components/SegmentedControl'
import SectionCard from '@/components/SectionCard'
import Tag from '@/components/Tag'
import Button from '@/components/Button'
import { useAppStore } from '@/store'
import { ProcessTypeList, type ShadowRoom } from '@/types'
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
  const { state, dispatch } = useAppStore()
  const [currentTab, setCurrentTab] = useState('coating')
  const [currentProcess, setCurrentProcess] = useState('all')

  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<ShadowRoom | null>(null)
  const [adjustTemp, setAdjustTemp] = useState('')
  const [adjustHumidity, setAdjustHumidity] = useState('')

  const filteredProcesses = useMemo(() => {
    if (currentTab !== 'coating') return []
    return state.processRecords.filter(r => {
      if (currentProcess === 'all') return true
      return r.processType === currentProcess
    })
  }, [state.processRecords, currentTab, currentProcess])

  const polishingWorks = useMemo(() => {
    return state.workArchives.filter(w => {
      const hasPolishing = w.processRecords.some(r => r.processType === '打磨' || r.processType === '推光')
      return hasPolishing || w.status === 'in_progress'
    }).slice(0, 5)
  }, [state.workArchives])

  const handleAdjustShadow = (room: ShadowRoom) => {
    setCurrentRoom(room)
    setAdjustTemp(String(room.temperature))
    setAdjustHumidity(String(room.humidity))
    setShowAdjustModal(true)
  }

  const handleSaveAdjust = () => {
    if (!currentRoom) return

    const temp = Number(adjustTemp)
    const humidity = Number(adjustHumidity)

    if (isNaN(temp) || isNaN(humidity)) {
      Taro.showToast({ title: '请输入有效的数值', icon: 'none' })
      return
    }

    if (temp < 10 || temp > 40) {
      Taro.showToast({ title: '温度应在10-40°C之间', icon: 'none' })
      return
    }

    if (humidity < 30 || humidity > 95) {
      Taro.showToast({ title: '湿度应在30-95%之间', icon: 'none' })
      return
    }

    const isNormal = temp >= 20 && temp <= 25 && humidity >= 70 && humidity <= 80

    const updatedRoom: ShadowRoom = {
      ...currentRoom,
      temperature: temp,
      humidity,
      status: isNormal ? 'normal' : 'warning'
    }

    dispatch({ type: 'UPDATE_SHADOW_ROOM', payload: updatedRoom })
    console.log('[ProcessPage] 调整荫房环境:', updatedRoom)

    setShowAdjustModal(false)
    Taro.showToast({ title: '保存成功', icon: 'success' })
  }

  const handleTakeOut = (roomId: string, workId: string) => {
    const room = state.shadowRooms.find(r => r.id === roomId)
    if (!room) return

    const updatedRoom: ShadowRoom = {
      ...room,
      works: room.works.filter(w => w.workId !== workId)
    }

    dispatch({ type: 'UPDATE_SHADOW_ROOM', payload: updatedRoom })
    console.log('[ProcessPage] 取出作品:', workId)

    Taro.showToast({ title: '已取出作品', icon: 'success' })
  }

  const handleAddProcess = () => {
    Taro.navigateTo({ url: '/pages/process-add/index' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabs}>
        <SegmentedControl items={tabItems} value={currentTab} onChange={setCurrentTab} />
      </View>

      {currentTab === 'coating' && (
        <View>
          <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32rpx' }}>
            <ScrollView scrollX style={{ flex: 1, marginRight: '16rpx' }}>
              <SegmentedControl items={processItems} value={currentProcess} onChange={setCurrentProcess} />
            </ScrollView>
            <View className={styles.addBtn} onClick={handleAddProcess}>
              <Text className={styles.addBtnText}>+ 新增</Text>
            </View>
          </View>
          <View className={styles.section}>
            {filteredProcesses.length > 0 ? (
              filteredProcesses.map(record => (
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
                  {record.temperature !== undefined && (
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
              ))
            ) : (
              <View style={{ textAlign: 'center', padding: '80rpx 0' }}>
                <Text style={{ fontSize: '28rpx', color: '#8B7355' }}>暂无工序记录</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {currentTab === 'shadow' && (
        <View className={styles.section}>
          {state.shadowRooms.map(room => (
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
                {room.works.length > 0 ? (
                  room.works.map(work => (
                    <View key={work.workId} className={styles.workItem}>
                      <View style={{ flex: 1 }}>
                        <Text className={styles.workName}>{work.workName}</Text>
                        <Text className={styles.workTime}>入荫：{work.enterTime} ~ {work.expectedExit}</Text>
                      </View>
                      <TaroButton
                        className={styles.enterBtn}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTakeOut(room.id, work.workId)
                        }}
                      >
                        取出
                      </TaroButton>
                    </View>
                  ))
                ) : (
                  <Text style={{ fontSize: '24rpx', color: '#8B7355', padding: '16rpx 0' }}>暂无入荫作品</Text>
                )}
              </View>
              <View style={{ marginTop: '24rpx' }}>
                <Button type="outline" size="small" block onClick={() => handleAdjustShadow(room)}>
                  调控温湿度
                </Button>
              </View>
            </View>
          ))}

          <SectionCard title="入荫提醒">
            <View style={{ padding: '16rpx 0' }}>
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
                描金：在漆面用金粉描绘纹饰，是传统漆器装饰技法之一。
              </Text>
            </View>
          </SectionCard>
        </View>
      )}

      {showAdjustModal && currentRoom && (
        <View className={styles.modalMask} onClick={() => setShowAdjustModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>调控温湿度 - {currentRoom.name}</Text>

            <View style={{ marginBottom: '32rpx' }}>
              <Text className={styles.modalLabel}>目标温度（°C）</Text>
              <Input
                type="digit"
                className={styles.modalInput}
                value={adjustTemp}
                onInput={(e) => setAdjustTemp(e.detail.value)}
                placeholder="请输入温度，建议20-25°C"
              />
            </View>

            <View style={{ marginBottom: '40rpx' }}>
              <Text className={styles.modalLabel}>目标湿度（%）</Text>
              <Input
                type="digit"
                className={styles.modalInput}
                value={adjustHumidity}
                onInput={(e) => setAdjustHumidity(e.detail.value)}
                placeholder="请输入湿度，建议70-80%"
              />
            </View>

            <View className={styles.modalBtns}>
              <Button type="outline" block onClick={() => setShowAdjustModal(false)}>
                取消
              </Button>
              <Button block onClick={handleSaveAdjust}>
                保存
              </Button>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default ProcessPage
