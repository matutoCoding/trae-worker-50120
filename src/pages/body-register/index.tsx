import React, { useState } from 'react'
import { View, Text, Input, Textarea, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import Button from '@/components/Button'
import { BodyTypeList } from '@/types'
import { generateId } from '@/utils'
import styles from './index.module.scss'

const sourceOptions = ['自制', '外购', '定制']

const BodyRegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    material: '',
    size: '',
    source: '',
    description: ''
  })

  const handleSubmit = () => {
    if (!form.name || !form.type || !form.material || !form.size) {
      Taro.showToast({ title: '请填写必填项', icon: 'none' })
      return
    }
    console.log('[BodyRegister] 提交数据:', {
      id: generateId('b'),
      ...form,
      registerDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    })
    Taro.showToast({ title: '登记成功', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleReset = () => {
    setForm({ name: '', type: '', material: '', size: '', source: '', description: '' })
    Taro.showToast({ title: '已重置', icon: 'none' })
  }

  return (
    <View className={styles.page}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>基本信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>胎体名称
          </Text>
          <Input
            className={styles.input}
            placeholder="请输入胎体名称"
            value={form.name}
            onInput={(e) => setForm({ ...form, name: e.detail.value })}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>胎体类型
          </Text>
          <View className={styles.optionsGrid}>
            {BodyTypeList.map(type => (
              <Text
                key={type}
                className={classnames(styles.optionItem, form.type === type && styles.optionActive)}
                onClick={() => setForm({ ...form, type })}
              >
                {type}
              </Text>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>材质
          </Text>
          <Input
            className={styles.input}
            placeholder="请输入材质，如榉木、夏布、楠竹等"
            value={form.material}
            onInput={(e) => setForm({ ...form, material: e.detail.value })}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>尺寸规格
          </Text>
          <Input
            className={styles.input}
            placeholder="请输入尺寸，如直径12cm 高8cm"
            value={form.size}
            onInput={(e) => setForm({ ...form, size: e.detail.value })}
          />
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>补充信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>来源</Text>
          <View className={styles.optionsGrid}>
            {sourceOptions.map(item => (
              <Text
                key={item}
                className={classnames(styles.optionItem, form.source === item && styles.optionActive)}
                onClick={() => setForm({ ...form, source: item })}
              >
                {item}
              </Text>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>备注说明</Text>
          <Textarea
            className={styles.textarea}
            placeholder="请输入胎体描述、预处理情况等备注信息"
            value={form.description}
            onInput={(e) => setForm({ ...form, description: e.detail.value })}
          />
        </View>
      </View>

      <View className={styles.footer}>
        <Button type="outline" block onClick={handleReset}>
          重置
        </Button>
        <Button block onClick={handleSubmit}>
          提交登记
        </Button>
      </View>
    </View>
  )
}

export default BodyRegisterPage
