import React, { useState, useMemo } from 'react'
import { View, Text, Input, Textarea, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import Button from '@/components/Button'
import { useAppStore } from '@/store'
import { ProcessTypeList, type ProcessRecord } from '@/types'
import { generateId } from '@/utils'
import styles from './index.module.scss'

const ProcessAddPage: React.FC = () => {
  const { state, dispatch } = useAppStore()

  const workOptions = useMemo(() => {
    return state.workArchives.map(w => ({ label: w.name, value: w.id }))
  }, [state.workArchives])

  const [form, setForm] = useState({
    workId: '',
    workName: '',
    processType: '',
    layer: 1,
    operator: '',
    duration: 60,
    temperature: '',
    humidity: '',
    notes: ''
  })

  const handleWorkChange = (e: any) => {
    const idx = e.detail.value
    const selected = workOptions[idx]
    if (selected) {
      setForm({ ...form, workId: selected.value, workName: selected.label })
    }
  }

  const handleSubmit = () => {
    if (!form.workId || !form.processType || !form.operator) {
      Taro.showToast({ title: '请填写必填项', icon: 'none' })
      return
    }

    const newRecord: ProcessRecord = {
      id: generateId('p'),
      workId: form.workId,
      workName: form.workName,
      processType: form.processType as any,
      layer: Number(form.layer) || 1,
      operator: form.operator,
      date: new Date().toISOString(),
      duration: Number(form.duration) || 0,
      temperature: form.temperature ? Number(form.temperature) : undefined,
      humidity: form.humidity ? Number(form.humidity) : undefined,
      status: 'pending',
      notes: form.notes
    }

    dispatch({ type: 'ADD_PROCESS_RECORD', payload: newRecord })
    console.log('[ProcessAdd] 新增工序记录:', newRecord)

    Taro.showToast({ title: '新增成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleReset = () => {
    setForm({
      workId: '',
      workName: '',
      processType: '',
      layer: 1,
      operator: '',
      duration: 60,
      temperature: '',
      humidity: '',
      notes: ''
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>基本信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>选择作品
          </Text>
          <Picker
            mode="selector"
            range={workOptions.map(w => w.label)}
            onChange={handleWorkChange}
          >
            <View className={styles.picker}>
              <Text className={classnames(styles.pickerText, !form.workName && styles.pickerPlaceholder)}>
                {form.workName || '请选择作品'}
              </Text>
              <Text style={{ fontSize: '24rpx', color: '#8B7355' }}>▼</Text>
            </View>
          </Picker>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>工序类型
          </Text>
          <View className={styles.optionsGrid}>
            {ProcessTypeList.map(type => (
              <Text
                key={type}
                className={classnames(styles.optionItem, form.processType === type && styles.optionActive)}
                onClick={() => setForm({ ...form, processType: type })}
              >
                {type}
              </Text>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>操作人
          </Text>
          <Input
            className={styles.input}
            placeholder="请输入操作人姓名"
            value={form.operator}
            onInput={(e) => setForm({ ...form, operator: e.detail.value })}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>工序详情</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>层数</Text>
          <Input
            type="number"
            className={styles.input}
            placeholder="请输入第几层"
            value={String(form.layer)}
            onInput={(e) => setForm({ ...form, layer: Number(e.detail.value) })}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>预计用时（分钟）</Text>
          <Input
            type="number"
            className={styles.input}
            placeholder="请输入预计用时"
            value={String(form.duration)}
            onInput={(e) => setForm({ ...form, duration: Number(e.detail.value) })}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>环境温度（°C）</Text>
          <Input
            type="digit"
            className={styles.input}
            placeholder="如髹涂时的温度，选填"
            value={form.temperature}
            onInput={(e) => setForm({ ...form, temperature: e.detail.value })}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>环境湿度（%）</Text>
          <Input
            type="digit"
            className={styles.input}
            placeholder="如髹涂时的湿度，选填"
            value={form.humidity}
            onInput={(e) => setForm({ ...form, humidity: e.detail.value })}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>备注</Text>
          <Textarea
            className={styles.textarea}
            placeholder="请输入工序备注、注意事项等"
            value={form.notes}
            onInput={(e) => setForm({ ...form, notes: e.detail.value })}
          />
        </View>
      </View>

      <View className={styles.footer}>
        <Button type="outline" block onClick={handleReset}>
          重置
        </Button>
        <Button block onClick={handleSubmit}>
          提交
        </Button>
      </View>
    </View>
  )
}

export default ProcessAddPage
