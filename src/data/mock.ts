import { Body, LacquerMaterial, LacquerMixture, ProcessRecord, ShadowRoom, WorkArchive, CustomOrder, CareGuide } from '@/types'

export const mockBodies: Body[] = [
  { id: 'b001', name: '木胎茶碗', type: '木胎', material: '榉木', size: '直径12cm 高8cm', source: '自制', registerDate: '2026-05-10', status: 'processing', description: '传统造型木胎茶碗，打磨光滑' },
  { id: 'b002', name: '布胎花瓶', type: '布胎', material: '夏布+脱胎', size: '口径15cm 高30cm', source: '定制', registerDate: '2026-05-12', status: 'processing', description: '脱胎漆器花瓶胎体' },
  { id: 'b003', name: '竹胎香盒', type: '竹胎', material: '楠竹', size: '直径8cm 高4cm', source: '自制', registerDate: '2026-05-15', status: 'pending' },
  { id: 'b004', name: '木胎首饰盒', type: '木胎', material: '紫檀木', size: '20cm×15cm×8cm', source: '外购', registerDate: '2026-05-18', status: 'finished', description: '紫檀木首饰盒胎体' },
  { id: 'b005', name: '皮胎酒具套组', type: '皮胎', material: '牛皮', size: '壶15cm×12cm', source: '自制', registerDate: '2026-05-20', status: 'processing' },
  { id: 'b006', name: '纸胎笔筒', type: '纸胎', material: '桑皮纸', size: '直径10cm 高15cm', source: '自制', registerDate: '2026-05-22', status: 'pending' },
  { id: 'b007', name: '木胎果盘', type: '木胎', material: '胡桃木', size: '直径25cm', source: '外购', registerDate: '2026-05-25', status: 'finished' },
  { id: 'b008', name: '布胎茶盘', type: '布胎', material: '夏布脱胎', size: '30cm×20cm', source: '定制', registerDate: '2026-05-28', status: 'processing' },
  { id: 'b009', name: '金属胎香炉', type: '金属胎', material: '铜胎', size: '直径10cm 高8cm', source: '外购', registerDate: '2026-06-01', status: 'pending' },
  { id: 'b010', name: '木胎茶叶罐', type: '木胎', material: '杉木', size: '直径10cm 高15cm', source: '自制', registerDate: '2026-06-05', status: 'processing', description: '传统造型杉木胎茶叶罐' }
]

export const mockLacquerMaterials: LacquerMaterial[] = [
  { id: 'l001', name: '毛坝生漆', category: '生漆', quantity: 5000, unit: 'g', stock: 3200, productionDate: '2026-04-01', origin: '湖北毛坝', description: '优质天然生漆' },
  { id: 'l002', name: '城口生漆', category: '生漆', quantity: 3000, unit: 'g', stock: 1800, productionDate: '2026-04-15', origin: '重庆城口' },
  { id: 'l003', name: '朱红漆', category: '色漆', quantity: 2000, unit: 'g', stock: 1200, productionDate: '2026-05-01', origin: '自制' },
  { id: 'l004', name: '黑漆', category: '色漆', quantity: 2500, unit: 'g', stock: 2000, productionDate: '2026-05-05', origin: '自制' },
  { id: 'l005', name: '推光漆', category: '熟漆', quantity: 1500, unit: 'g', stock: 800, productionDate: '2026-05-10', origin: '自制' },
  { id: 'l006', name: '瓦灰', category: '腻子', quantity: 8000, unit: 'g', stock: 6000, productionDate: '2026-03-20', origin: '自制' },
  { id: 'l007', name: '鹿角霜', category: '腻子', quantity: 2000, unit: 'g', stock: 500, productionDate: '2026-04-10', origin: '外购' },
  { id: 'l008', name: '24K金箔', category: '金箔', quantity: 500, unit: '张', stock: 280, productionDate: '2026-05-01', origin: '南京' },
  { id: 'l009', name: '螺钿片', category: '螺钿', quantity: 300, unit: '片', stock: 150, productionDate: '2026-04-20', origin: '外购' },
  { id: 'l010', name: '透明漆', category: '熟漆', quantity: 1800, unit: 'g', stock: 1000, productionDate: '2026-05-12', origin: '自制' }
]

export const mockLacquerMixtures: LacquerMixture[] = [
  {
    id: 'm001',
    name: '裱布漆',
    formula: [
      { materialId: 'l001', materialName: '毛坝生漆', ratio: 70 },
      { materialId: 'l006', materialName: '瓦灰', ratio: 30 }
    ],
    usage: '用于夏布裱糊',
    createDate: '2026-05-15',
    operator: '张师傅'
  },
  {
    id: 'm002',
    name: '底漆配方',
    formula: [
      { materialId: 'l002', materialName: '城口生漆', ratio: 60 },
      { materialId: 'l006', materialName: '瓦灰', ratio: 40 }
    ],
    usage: '用于头道底漆',
    createDate: '2026-05-18',
    operator: '李师傅'
  }
]

export const mockProcessRecords: ProcessRecord[] = [
  { id: 'p001', workId: 'w001', workName: '朱红花瓶', processType: '裱布', layer: 1, operator: '张师傅', date: '2026-05-20', duration: 180, status: 'finished', notes: '夏布裱糊完成' },
  { id: 'p002', workId: 'w001', workName: '朱红花瓶', processType: '刮灰', layer: 1, operator: '张师傅', date: '2026-05-22', duration: 120, status: 'finished' },
  { id: 'p003', workId: 'w001', workName: '朱红花瓶', processType: '底漆', layer: 1, operator: '李师傅', date: '2026-05-25', duration: 90, temperature: 22, humidity: 75, status: 'finished' },
  { id: 'p004', workId: 'w001', workName: '朱红花瓶', processType: '面漆', layer: 2, operator: '李师傅', date: '2026-06-01', duration: 60, temperature: 23, humidity: 78, status: 'finished' },
  { id: 'p005', workId: 'w002', workName: '黑漆茶碗', processType: '裱布', layer: 1, operator: '王师傅', date: '2026-05-28', duration: 150, status: 'finished' },
  { id: 'p006', workId: 'w002', workName: '黑漆茶碗', processType: '刮灰', layer: 2, operator: '王师傅', date: '2026-05-30', duration: 100, status: 'processing' },
  { id: 'p007', workId: 'w003', workName: '描金香盒', processType: '底漆', layer: 1, operator: '张师傅', date: '2026-06-02', duration: 80, temperature: 24, humidity: 76, status: 'pending' },
  { id: 'p008', workId: 'w004', workName: '螺钿首饰盒', processType: '面漆', layer: 3, operator: '李师傅', date: '2026-06-05', duration: 70, status: 'finished' },
  { id: 'p009', workId: 'w004', workName: '螺钿首饰盒', processType: '打磨', layer: 1, operator: '王师傅', date: '2026-06-08', duration: 200, status: 'processing' },
  { id: 'p010', workId: 'w005', workName: '朱红茶叶罐', processType: '面漆', layer: 1, operator: '张师傅', date: '2026-06-10', duration: 90, status: 'pending' }
]

export const mockShadowRooms: ShadowRoom[] = [
  {
    id: 's001',
    name: '一号荫房',
    temperature: 23,
    humidity: 78,
    targetTemp: 22,
    targetHumidity: 75,
    status: 'normal',
    works: [
      { workId: 'w001', workName: '朱红花瓶', enterTime: '2026-06-10 08:00', expectedExit: '2026-06-12 08:00' },
      { workId: 'w002', workName: '黑漆茶碗', enterTime: '2026-06-11 10:00', expectedExit: '2026-06-13 10:00' }
    ]
  },
  {
    id: 's002',
    name: '二号荫房',
    temperature: 26,
    humidity: 65,
    targetTemp: 22,
    targetHumidity: 75,
    status: 'warning',
    works: [
      { workId: 'w003', workName: '描金香盒', enterTime: '2026-06-12 09:00', expectedExit: '2026-06-14 09:00' }
    ]
  }
]

export const mockWorkArchives: WorkArchive[] = [
  {
    id: 'w001',
    name: '朱红花瓶',
    bodyId: 'b002',
    bodyName: '布胎花瓶',
    artist: '李明轩',
    processRecords: mockProcessRecords.filter(r => r.workId === 'w001'),
    finishDate: '',
    style: '朱漆',
    description: '传统朱红花瓶，色泽温润，器型典雅，是收藏级作品',
    hasMakiE: false,
    hasGoldPaint: false,
    status: 'in_progress',
    careGuide: '避免阳光直射，定期用柔软干布擦拭'
  },
  {
    id: 'w002',
    name: '黑漆茶碗',
    bodyId: 'b001',
    bodyName: '木胎茶碗',
    artist: '张德远',
    processRecords: mockProcessRecords.filter(r => r.workId === 'w002'),
    finishDate: '',
    style: '黑漆',
    description: '素黑漆茶碗，禅意十足',
    hasMakiE: false,
    hasGoldPaint: false,
    status: 'in_progress'
  },
  {
    id: 'w003',
    name: '描金香盒',
    bodyId: 'b003',
    bodyName: '竹胎香盒',
    artist: '王丹青',
    processRecords: mockProcessRecords.filter(r => r.workId === 'w003'),
    finishDate: '',
    style: '描金漆器',
    description: '竹胎描金香盒，精致典雅',
    hasMakiE: false,
    hasGoldPaint: true,
    status: 'in_progress'
  },
  {
    id: 'w004',
    name: '螺钿首饰盒',
    bodyId: 'b004',
    bodyName: '木胎首饰盒',
    artist: '李玉华',
    processRecords: mockProcessRecords.filter(r => r.workId === 'w004'),
    finishDate: '2026-05-20',
    style: '螺钿镶嵌',
    description: '紫檀木胎螺钿镶嵌首饰盒，华美精致',
    hasMakiE: false,
    hasGoldPaint: false,
    status: 'finished',
    price: 8800,
    careGuide: '避免潮湿环境，定期用软布轻擦螺钿部位'
  },
  {
    id: 'w005',
    name: '朱红茶叶罐',
    bodyId: 'b010',
    bodyName: '木胎茶叶罐',
    artist: '陈墨白',
    processRecords: mockProcessRecords.filter(r => r.workId === 'w005'),
    finishDate: '2026-05-15',
    style: '朱漆',
    description: '传统朱红杉木胎茶叶罐，密封性好',
    hasMakiE: false,
    hasGoldPaint: false,
    status: 'sold',
    price: 2600
  },
  {
    id: 'w006',
    name: '莳绘果盘',
    bodyId: 'b007',
    bodyName: '木胎果盘',
    artist: '赵雅之',
    processRecords: [],
    finishDate: '2026-04-28',
    style: '莳绘',
    description: '胡桃木胎莳绘果盘，绘有松鹤延年图案',
    hasMakiE: true,
    hasGoldPaint: true,
    status: 'finished',
    price: 12800
  },
  {
    id: 'w007',
    name: '脱胎茶盘',
    bodyId: 'b008',
    bodyName: '布胎茶盘',
    artist: '孙若水',
    processRecords: [],
    finishDate: '2026-04-10',
    style: '素髹',
    description: '脱胎茶盘，轻便耐用',
    hasMakiE: false,
    hasGoldPaint: false,
    status: 'sold',
    price: 3500
  },
  {
    id: 'w008',
    name: '铜胎香炉',
    bodyId: 'b009',
    bodyName: '金属胎香炉',
    artist: '周明哲',
    processRecords: [],
    finishDate: '2026-03-20',
    style: '仿古铜漆',
    description: '铜胎仿古漆香炉，古朴典雅',
    hasMakiE: false,
    hasGoldPaint: true,
    status: 'finished',
    price: 6800
  }
]

export const mockCustomOrders: CustomOrder[] = [
  { id: 'o001', orderNo: 'LQ202606001', customerName: '王先生', customerPhone: '138****1234', workType: '定制花瓶', requirements: '朱红花瓶一对，高35cm，需要描金装饰', deposit: 3000, totalPrice: 15000, status: 'in_progress', createDate: '2026-06-01', expectedDate: '2026-08-01', workId: 'w001' },
  { id: 'o002', orderNo: 'LQ202606002', customerName: '李女士', customerPhone: '139****5678', workType: '定制茶具', requirements: '茶碗五只，黑漆素髹，配描金莲花纹', deposit: 2000, totalPrice: 8000, status: 'pending', createDate: '2026-06-05', expectedDate: '2026-07-15' },
  { id: 'o003', orderNo: 'LQ202605001', customerName: '张先生', customerPhone: '137****9012', workType: '首饰盒', requirements: '螺钿镶嵌首饰盒，紫檀木胎', deposit: 4000, totalPrice: 12000, status: 'finished', createDate: '2026-05-10', expectedDate: '2026-06-10', workId: 'w004' },
  { id: 'o004', orderNo: 'LQ202605002', customerName: '陈女士', customerPhone: '136****3456', workType: '茶叶罐', requirements: '朱红茶叶罐两个，配礼盒', deposit: 1000, totalPrice: 5200, status: 'delivered', createDate: '2026-05-01', expectedDate: '2026-06-01', workId: 'w005', notes: '客户已收货，非常满意' },
  { id: 'o005', orderNo: 'LQ202606003', customerName: '刘先生', customerPhone: '135****7890', workType: '果盘', requirements: '莳绘果盘，松鹤图案', deposit: 5000, totalPrice: 18000, status: 'pending', createDate: '2026-06-12', expectedDate: '2026-08-15' }
]

export const mockCareGuides: CareGuide[] = [
  { id: 'c001', title: '日常清洁保养', category: '日常保养', content: '1. 使用柔软干净的棉布轻轻擦拭表面灰尘，避免使用化学清洁剂。\n2. 避免硬物刮擦漆器表面。\n3. 使用后及时清理污渍，保持干燥。' },
  { id: 'c002', title: '夏季防潮', category: '季节养护', content: '1. 梅雨季节注意除湿，可放置干燥剂。\n2. 避免长时间处于潮湿环境中。\n3. 定期检查，发现霉斑及时用干布擦拭。' },
  { id: 'c003', title: '冬季防裂', category: '季节养护', content: '1. 冬季避免放置在暖气附近，防止温度骤变。\n2. 空气干燥时可适当增加环境湿度。\n3. 避免阳光直射，防止漆面开裂。' },
  { id: 'c004', title: '轻微划痕修复', category: '修复指南', content: '1. 轻微划痕可用细棉布蘸取少量食用油轻轻擦拭。\n2. 较深划痕建议联系专业漆艺师修复。\n3. 切勿自行使用砂纸打磨。' },
  { id: 'c005', title: '长期保存', category: '日常保养', content: '1. 长期存放前清洁干燥，用软布包裹。\n2. 放置在阴凉干燥处，避免重压。\n3. 定期查看，防止虫蛀霉变。' }
]
