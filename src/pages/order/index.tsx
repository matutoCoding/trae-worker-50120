import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button as TaroButton } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import SegmentedControl from '@/components/SegmentedControl'
import Tag from '@/components/Tag'
import { mockCustomOrders, mockCareGuides, mockWorkArchives } from '@/data/mock'
import { formatDate, getStatusText, getStatusColor } from '@/utils'
import styles from './index.module.scss'

const tabItems = [
  { label: '定制订单', value: 'orders' },
  { label: '养护指南', value: 'care' }
]

const statusItems = [
  { label: '全部', value: 'all' },
  { label: '待确认', value: 'pending' },
  { label: '制作中', value: 'in_progress' },
  { label: '已完成', value: 'finished' },
  { label: '已交付', value: 'delivered' }
]

const OrderPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('orders')
  const [currentStatus, setCurrentStatus] = useState('all')

  const filteredOrders = useMemo(() => {
    if (currentTab !== 'orders') return []
    if (currentStatus === 'all') return mockCustomOrders
    return mockCustomOrders.filter(o => o.status === currentStatus)
  }, [currentTab, currentStatus])

  const salesStats = useMemo(() => {
    const soldWorks = mockWorkArchives.filter(w => w.status === 'sold')
    const total = soldWorks.reduce((sum, w) => sum + (w.price || 0), 0)
    return { total, count: soldWorks.length }
  }, [])

  const handleOrderClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/order-detail/index?id=${id}` })
  }

  const handleNewOrder = () => {
    Taro.showToast({ title: '新建订单', icon: 'none' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabs}>
        <SegmentedControl items={tabItems} value={currentTab} onChange={setCurrentTab} />
      </View>

      {currentTab === 'orders' && (
        <View>
          <View className={styles.salesSummary}>
            <Text className={styles.salesTitle}>本月销售</Text>
            <Text className={styles.salesAmount}>¥{salesStats.total.toLocaleString()}</Text>
            <Text className={styles.salesCount}>已售出 {salesStats.count} 件作品</Text>
          </View>

          <ScrollView scrollX className={styles.statusTabs}>
            {statusItems.map(item => (
              <Text
                key={item.value}
                className={classnames(styles.statusTab, currentStatus === item.value && styles.statusTabActive)}
                onClick={() => setCurrentStatus(item.value)}
              >
                {item.label}
              </Text>
            ))}
          </ScrollView>

          {filteredOrders.map(order => (
            <View key={order.id} className={styles.orderCard} onClick={() => handleOrderClick(order.id)}>
              <View className={styles.orderHeader}>
                <Text className={styles.orderNo}>订单号：{order.orderNo}</Text>
                <Tag text={getStatusText(order.status)} color={getStatusColor(order.status)} />
              </View>

              <Text className={styles.orderCustomer}>{order.customerName}</Text>
              <Text className={styles.orderType}>{order.workType}</Text>

              <View className={styles.orderReq}>
                <Text>定制要求：{order.requirements}</Text>
              </View>

              {order.notes && (
                <Text style={{ fontSize: '24rpx', color: '#8B7355', marginBottom: '16rpx' }}>
                  备注：{order.notes}
                </Text>
              )}

              <View className={styles.orderFooter}>
                <View className={styles.orderPrices}>
                  <Text className={styles.orderTotal}>¥{order.totalPrice.toLocaleString()}</Text>
                  <Text className={styles.orderDeposit}>定金 ¥{order.deposit.toLocaleString()}</Text>
                </View>
                <View className={styles.orderDates}>
                  <Text className={styles.orderDateItem}>下单：{formatDate(order.createDate)}</Text>
                  <Text className={styles.orderDateItem}>预计：{formatDate(order.expectedDate)}</Text>
                </View>
              </View>

              <View className={styles.actionRow}>
                <TaroButton
                  className={styles.actionBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    Taro.makePhoneCall({ phoneNumber: order.customerPhone }).catch(() => {})
                  }}
                >
                  联系客户
                </TaroButton>
                <TaroButton
                  className={styles.actionBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    Taro.showToast({ title: '查看进度', icon: 'none' })
                  }}
                >
                  查看进度
                </TaroButton>
              </View>
            </View>
          ))}
        </View>
      )}

      {currentTab === 'care' && (
        <View>
          {mockCareGuides.map(guide => (
            <View key={guide.id} className={styles.careCard}>
              <View className={styles.careHeader}>
                <Text className={styles.careTitle}>{guide.title}</Text>
                <Tag text={guide.category} type="info" />
              </View>
              <Text className={styles.careContent}>{guide.content}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

export default OrderPage
