import dayjs from 'dayjs'

export const formatDate = (date: string, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date: string): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

export const getStatusText = (status: string): string => {
  const map: Record<string, string> = {
    pending: '待处理',
    processing: '进行中',
    finished: '已完成',
    sold: '已售出',
    delivered: '已交付',
    in_progress: '制作中',
    normal: '正常',
    warning: '异常'
  }
  return map[status] || status
}

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending: '#D4882A',
    processing: '#8B2323',
    finished: '#2E5D3A',
    sold: '#5C6B8A',
    delivered: '#2E5D3A',
    in_progress: '#8B2323',
    normal: '#2E5D3A',
    warning: '#D4882A'
  }
  return map[status] || '#5C4033'
}

export const generateId = (prefix = ''): string => {
  return `${prefix}${Date.now()}${Math.random().toString(36).substring(2, 8)}`
}

export const calcDurationText = (minutes: number): string => {
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分` : `${hours}小时`
}
