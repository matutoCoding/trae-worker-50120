import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import SegmentedControl from '@/components/SegmentedControl'
import Tag from '@/components/Tag'
import { mockLacquerMaterials, mockLacquerMixtures } from '@/data/mock'
import { formatDate } from '@/utils'
import styles from './index.module.scss'

const tabItems = [
  { label: '漆料库存', value: 'stock' },
  { label: '生漆配料', value: 'mixture' }
]

const categoryItems = [
  { label: '全部', value: 'all' },
  { label: '生漆', value: '生漆' },
  { label: '熟漆', value: '熟漆' },
  { label: '色漆', value: '色漆' },
  { label: '腻子', value: '腻子' },
  { label: '金箔', value: '金箔' },
  { label: '螺钿', value: '螺钿' }
]

const LacquerPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('stock')
  const [currentCategory, setCurrentCategory] = useState('all')

  const filteredMaterials = useMemo(() => {
    if (currentTab !== 'stock') return []
    if (currentCategory === 'all') return mockLacquerMaterials
    return mockLacquerMaterials.filter(m => m.category === currentCategory)
  }, [currentTab, currentCategory])

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabs}>
        <SegmentedControl items={tabItems} value={currentTab} onChange={setCurrentTab} />
      </View>

      {currentTab === 'stock' && (
        <View>
          <ScrollView scrollX className={styles.categoryTabs}>
            {categoryItems.map(item => (
              <Text
                key={item.value}
                className={classnames(styles.categoryTab, currentCategory === item.value && styles.categoryTabActive)}
                onClick={() => setCurrentCategory(item.value)}
              >
                {item.label}
              </Text>
            ))}
          </ScrollView>

          {filteredMaterials.map(material => {
            const stockPercent = Math.round((material.stock / material.quantity) * 100)
            const isLow = stockPercent < 30
            return (
              <View key={material.id} className={styles.materialCard}>
                <View className={styles.materialHeader}>
                  <Text className={styles.materialName}>{material.name}</Text>
                  <Tag text={material.category} type={isLow ? 'warning' : 'gold'} />
                </View>

                <View className={styles.materialMeta}>
                  <Text className={styles.materialMetaItem}>产地：{material.origin}</Text>
                  <Text className={styles.materialMetaItem}>批次：{formatDate(material.productionDate)}</Text>
                </View>

                {material.description && (
                  <Text style={{ fontSize: '24rpx', color: '#8B7355', marginBottom: '16rpx' }}>
                    {material.description}
                  </Text>
                )}

                <View className={styles.stockBar}>
                  <View className={styles.stockProgress}>
                    <View
                      className={classnames(styles.stockFill, isLow && styles.stockFillLow)}
                      style={{ width: `${stockPercent}%` }}
                    />
                  </View>
                  <Text className={styles.stockText}>
                    库存 {material.stock}/{material.quantity} {material.unit}
                  </Text>
                </View>

                <View className={styles.materialFooter}>
                  <Text className={styles.materialFooterText}>剩余占比 {stockPercent}%</Text>
                  {isLow && (
                    <Text style={{ fontSize: '22rpx', color: '#D4882A' }}>库存偏低，请及时补充</Text>
                  )}
                </View>
              </View>
            )
          })}
        </View>
      )}

      {currentTab === 'mixture' && (
        <View>
          {mockLacquerMixtures.map(formula => (
            <View key={formula.id} className={styles.formulaCard}>
              <View className={styles.formulaHeader}>
                <Text className={styles.formulaName}>{formula.name}</Text>
                <Tag text="配方" type="primary" />
              </View>

              <Text className={styles.formulaUsage}>用途：{formula.usage}</Text>

              <View className={styles.formulaItems}>
                {formula.formula.map((item, idx) => (
                  <View key={idx} className={styles.formulaItem}>
                    <Text className={styles.formulaItemName}>{item.materialName}</Text>
                    <Text className={styles.formulaItemRatio}>{item.ratio}%</Text>
                  </View>
                ))}
              </View>

              <View className={styles.formulaFooter}>
                <Text className={styles.formulaFooterText}>调配人：{formula.operator}</Text>
                <Text className={styles.formulaFooterText}>创建日期：{formatDate(formula.createDate)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

export default LacquerPage
