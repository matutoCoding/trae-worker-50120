import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import SectionCard from '@/components/SectionCard'
import QuickEntry from '@/components/QuickEntry'
import Tag from '@/components/Tag'
import { mockWorkArchives, mockProcessRecords } from '@/data/mock'
import { getStatusText, getStatusColor } from '@/utils'
import styles from './index.module.scss'

const HomePage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)

  const stats = useMemo(() => {
    const inProgress = mockWorkArchives.filter(w => w.status === 'in_progress').length
    const pendingTasks = mockProcessRecords.filter(p => p.status === 'pending').length
    const finishedMonth = mockWorkArchives.filter(w => {
      if (!w.finishDate) return false
      return dayjs(w.finishDate).format('YYYY-MM') === dayjs().format('YYYY-MM')
    }).length
    return { inProgress, pendingTasks, finishedMonth }
  }, [])

  const quickItems = [
    { label: '胎体登记', icon: '器', path: '/pages/body-register/index' },
    { label: '漆料管理', icon: '漆', path: '/pages/lacquer/index' },
    { label: '新增工序', icon: '髹', onClick: () => Taro.showToast({ title: '新增工序', icon: 'none' }) },
    { label: '入荫管理', icon: '荫', onClick: () => Taro.switchTab({ url: '/pages/process/index' }) },
    { label: '打磨推光', icon: '磨', onClick: () => Taro.switchTab({ url: '/pages/process/index' }) },
    { label: '作品入库', icon: '藏', onClick: () => Taro.switchTab({ url: '/pages/archive/index' }) },
    { label: '新建订单', icon: '单', onClick: () => Taro.showToast({ title: '新建订单', icon: 'none' }) },
    { label: '养护指南', icon: '养', onClick: () => Taro.switchTab({ url: '/pages/order/index' }) }
  ]

  const inProgressWorks = mockWorkArchives.filter(w => w.status === 'in_progress').slice(0, 3)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
      Taro.showToast({ title: '刷新成功', icon: 'success' })
    }, 1000)
  }

  const calcProgress = (work: typeof mockWorkArchives[0]) => {
    if (work.processRecords.length === 0) return 0
    const finished = work.processRecords.filter(r => r.status === 'finished').length
    return Math.round((finished / work.processRecords.length) * 100)
  }

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={handleRefresh}
    >
      <View className={styles.header}>
        <Text className={styles.greeting}>漆艺师，您好</Text>
        <Text className={styles.date}>{dayjs().format('YYYY年M月D日 dddd')}</Text>
      </View>

      <View className={styles.stats}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.inProgress}</Text>
          <Text className={styles.statLabel}>在制作品</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={[styles.statValue, styles.statValueGold].join(' ')}>{stats.pendingTasks}</Text>
          <Text className={styles.statLabel}>待办工序</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={[styles.statValue, styles.statValueGreen].join(' ')}>{stats.finishedMonth}</Text>
          <Text className={styles.statLabel}>本月完成</Text>
        </View>
      </View>

      <SectionCard title="快捷操作">
        <View className={styles.quickGrid}>
          <QuickEntry items={quickItems.slice(0, 4)} />
          <QuickEntry items={quickItems.slice(4, 8)} />
        </View>
      </SectionCard>

      <View className={styles.todoSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleText}>待办事项</Text>
          <Text className={styles.more}>查看全部</Text>
        </View>
        <View className={styles.todoList}>
          {mockProcessRecords.filter(p => p.status === 'pending').slice(0, 3).map(item => (
            <View key={item.id} className={styles.todoItem}>
              <View className={styles.todoLeft}>
                <View className={styles.todoDot} />
                <View className={styles.todoContent}>
                  <Text className={styles.todoTitle}>{item.workName} - {item.processType}</Text>
                  <Text className={styles.todoDesc}>第{item.layer}层 · {item.operator}负责</Text>
                </View>
              </View>
              <Text className={styles.todoTime}>待处理</Text>
            </View>
          ))}
          {mockProcessRecords.filter(p => p.status === 'processing').slice(0, 2).map(item => (
            <View key={item.id} className={styles.todoItem}>
              <View className={styles.todoLeft}>
                <View className={[styles.todoDot, styles.todoDotWarning].join(' ')} />
                <View className={styles.todoContent}>
                  <Text className={styles.todoTitle}>{item.workName} - {item.processType}</Text>
                  <Text className={styles.todoDesc}>进行中 · 已用时约{item.duration}分钟</Text>
                </View>
              </View>
              <Text className={styles.todoTime} style={{ color: getStatusColor('processing') }}>
                进行中
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.progressSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleText}>在制作品</Text>
          <Text className={styles.more}>全部作品</Text>
        </View>
        {inProgressWorks.map(work => (
          <View
            key={work.id}
            className={styles.progressCard}
            onClick={() => Taro.navigateTo({ url: `/pages/work-detail/index?id=${work.id}` })}
          >
            <View className={styles.progressHeader}>
              <Text className={styles.progressName}>{work.name}</Text>
              <Text className={styles.progressPercent}>{calcProgress(work)}%</Text>
            </View>
            <View className={styles.progressBar}>
              <View className={styles.progressFill} style={{ width: `${calcProgress(work)}%` }} />
            </View>
            <View className={styles.progressSteps}>
              {work.processRecords.slice(0, 6).map((r, idx) => (
                <Tag
                  key={idx}
                  text={r.processType}
                  color={getStatusColor(r.status)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default HomePage
