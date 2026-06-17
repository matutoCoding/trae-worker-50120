import React, { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import Button from '@/components/Button'
import { mockCustomOrders, mockWorkArchives } from '@/data/mock'
import { formatDate, getStatusText } from '@/utils'
import styles from './index.module.scss'

const OrderDetailPage: React.FC = () => {
  const router = useRouter()
  const orderId = router.params.id || 'o001'

  const order = useMemo(() => {
    return mockCustomOrders.find(o => o.id === orderId) || mockCustomOrders[0]
  }, [orderId])

  const work = useMemo(() => {
    if (order.workId) {
      return mockWorkArchives.find(w => w.id === order.workId)
    }
    return null
  }, [order])

  const steps = useMemo(() => {
    return [
      { name: '订单确认', date: order.createDate, done: order.status !== 'pending', current: order.status === 'pending' },
      { name: '开始制作', date: order.status !== 'pending' ? order.createDate : '', done: ['in_progress', 'finished', 'delivered'].includes(order.status), current: order.status === 'in_progress' },
      { name: '制作完成', date: work?.finishDate || '', done: ['finished', 'delivered'].includes(order.status), current: order.status === 'finished' },
      { name: '交付客户', date: order.status === 'delivered' ? order.expectedDate : '', done: order.status === 'delivered', current: false }
    ]
  }, [order, work])

  const handleCall = () => {
    Taro.makePhoneCall({ phoneNumber: order.customerPhone }).catch(() => {})
  }

  const handleViewProgress = () => {
    if (work) {
      Taro.navigateTo({ url: `/pages/work-detail/index?id=${work.id}` })
    } else {
      Taro.showToast({ title: '作品尚未关联', icon: 'none' })
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.orderNo}>订单号：{order.orderNo}</Text>
        <Text className={styles.orderStatus}>{getStatusText(order.status)}</Text>
        <Text className={styles.orderType}>{order.workType}</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>客户信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>客户姓名</Text>
          <Text className={styles.infoValue}>{order.customerName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>联系电话</Text>
          <Text className={styles.infoValue}>{order.customerPhone}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>定制需求</Text>
        <View className={styles.requirementsBox}>
          <Text className={styles.reqText}>{order.requirements}</Text>
        </View>
        {order.notes && (
          <View style={{ marginTop: '24rpx' }}>
            <Text className={styles.reqText} style={{ color: '#8B7355' }}>备注：{order.notes}</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>订单进度</Text>
        <View className={styles.progress}>
          <View className={styles.steps}>
            {steps.map((step, idx) => (
              <View key={idx} className={styles.stepItem}>
                <View className={classnames(styles.stepDot, {
                  [styles.dotDone]: step.done,
                  [styles.dotCurrent]: step.current && !step.done
                })} />
                <View className={styles.stepLine} />
                <View className={styles.stepHeader}>
                  <Text className={styles.stepName}>{step.name}</Text>
                  {step.date && <Text className={styles.stepDate}>{formatDate(step.date)}</Text>}
                </View>
                {step.current && <Text className={styles.stepDesc}>当前进度</Text>}
              </View>
            ))}
          </View>
        </View>
        <View className={styles.infoRow} style={{ marginTop: '24rpx' }}>
          <Text className={styles.infoLabel}>预计交付</Text>
          <Text className={styles.infoValue}>{formatDate(order.expectedDate)}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>费用明细</Text>
        <View className={styles.priceRow}>
          <Text className={styles.priceLabel}>订单总价</Text>
          <Text className={styles.priceValue}>¥{order.totalPrice.toLocaleString()}</Text>
        </View>
        <View className={styles.priceRow}>
          <Text className={styles.priceLabel}>已收定金</Text>
          <Text className={styles.priceValue}>¥{order.deposit.toLocaleString()}</Text>
        </View>
        <View className={styles.priceRow}>
          <Text className={styles.priceLabel}>待收尾款</Text>
          <Text className={styles.priceValue}>¥{(order.totalPrice - order.deposit).toLocaleString()}</Text>
        </View>
        <View className={styles.totalRow}>
          <Text className={styles.totalLabel}>应收尾款</Text>
          <Text className={styles.totalValue}>¥{(order.totalPrice - order.deposit).toLocaleString()}</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <Button type="outline" block onClick={handleCall}>
          联系客户
        </Button>
        <Button block onClick={handleViewProgress}>
          查看作品进度
        </Button>
      </View>
    </View>
  )
}

export default OrderDetailPage
