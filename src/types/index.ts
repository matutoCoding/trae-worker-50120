export interface Body {
  id: string
  name: string
  type: string
  material: string
  size: string
  source: string
  registerDate: string
  status: 'pending' | 'processing' | 'finished'
  description?: string
}

export type BodyType =
  | '木胎'
  | '布胎'
  | '皮胎'
  | '竹胎'
  | '金属胎'
  | '纸胎'

export const BodyTypeList: BodyType[] = ['木胎', '布胎', '皮胎', '竹胎', '金属胎', '纸胎']

export interface LacquerMaterial {
  id: string
  name: string
  category: '生漆' | '熟漆' | '色漆' | '腻子' | '金箔' | '螺钿'
  quantity: number
  unit: string
  stock: number
  productionDate: string
  origin: string
  description?: string
}

export interface LacquerMixture {
  id: string
  name: string
  formula: Array<{
    materialId: string
    materialName: string
    ratio: number
  }>
  usage: string
  createDate: string
  operator: string
}

export type ProcessType =
  | '裱布'
  | '刮灰'
  | '底漆'
  | '面漆'
  | '入荫'
  | '打磨'
  | '推光'
  | '莳绘'
  | '描金'

export const ProcessTypeList: ProcessType[] = ['裱布', '刮灰', '底漆', '面漆', '入荫', '打磨', '推光', '莳绘', '描金']

export interface ProcessRecord {
  id: string
  workId: string
  workName: string
  processType: ProcessType
  layer: number
  operator: string
  date: string
  duration: number
  humidity?: number
  temperature?: number
  status: 'pending' | 'processing' | 'finished'
  notes?: string
}

export interface ShadowRoom {
  id: string
  name: string
  temperature: number
  humidity: number
  targetTemp: number
  targetHumidity: number
  status: 'normal' | 'warning'
  works: Array<{
    workId: string
    workName: string
    enterTime: string
    expectedExit: string
  }>
}

export interface WorkArchive {
  id: string
  name: string
  bodyId: string
  bodyName: string
  artist: string
  processRecords: ProcessRecord[]
  finishDate: string
  style: string
  description: string
  hasMakiE: boolean
  hasGoldPaint: boolean
  image?: string
  status: 'in_progress' | 'finished' | 'sold'
  price?: number
  careGuide?: string
}

export interface CustomOrder {
  id: string
  orderNo: string
  customerName: string
  customerPhone: string
  workType: string
  requirements: string
  deposit: number
  totalPrice: number
  status: 'pending' | 'in_progress' | 'finished' | 'delivered'
  createDate: string
  expectedDate: string
  workId?: string
  notes?: string
}

export interface CareGuide {
  id: string
  title: string
  category: '日常保养' | '季节养护' | '修复指南'
  content: string
}
