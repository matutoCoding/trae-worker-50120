import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import Taro from '@tarojs/taro'
import {
  Body,
  LacquerMaterial,
  LacquerMixture,
  ProcessRecord,
  ShadowRoom,
  WorkArchive,
  CustomOrder,
  CareGuide
} from '@/types'
import {
  mockBodies,
  mockLacquerMaterials,
  mockLacquerMixtures,
  mockProcessRecords,
  mockShadowRooms,
  mockWorkArchives,
  mockCustomOrders,
  mockCareGuides
} from '@/data/mock'

const STORAGE_KEY = 'lacquer_workshop_data'

interface AppState {
  bodies: Body[]
  lacquerMaterials: LacquerMaterial[]
  lacquerMixtures: LacquerMixture[]
  processRecords: ProcessRecord[]
  shadowRooms: ShadowRoom[]
  workArchives: WorkArchive[]
  customOrders: CustomOrder[]
  careGuides: CareGuide[]
}

type ActionType =
  | { type: 'ADD_BODY'; payload: Body }
  | { type: 'UPDATE_BODY'; payload: Body }
  | { type: 'ADD_PROCESS_RECORD'; payload: ProcessRecord }
  | { type: 'UPDATE_SHADOW_ROOM'; payload: ShadowRoom }
  | { type: 'ADD_WORK_ARCHIVE'; payload: WorkArchive }
  | { type: 'UPDATE_WORK_ARCHIVE'; payload: WorkArchive }
  | { type: 'ADD_CUSTOM_ORDER'; payload: CustomOrder }
  | { type: 'UPDATE_CUSTOM_ORDER'; payload: CustomOrder }
  | { type: 'INIT_STATE'; payload: AppState }

const initialState: AppState = {
  bodies: mockBodies,
  lacquerMaterials: mockLacquerMaterials,
  lacquerMixtures: mockLacquerMixtures,
  processRecords: mockProcessRecords,
  shadowRooms: mockShadowRooms,
  workArchives: mockWorkArchives,
  customOrders: mockCustomOrders,
  careGuides: mockCareGuides
}

const STORAGE_KEY_BODIES = 'lw_bodies'
const STORAGE_KEY_PROCESS = 'lw_process'
const STORAGE_KEY_SHADOW = 'lw_shadow'
const STORAGE_KEY_WORKS = 'lw_works'
const STORAGE_KEY_ORDERS = 'lw_orders'

function reducer(state: AppState, action: ActionType): AppState {
  switch (action.type) {
    case 'INIT_STATE':
      return { ...action.payload }

    case 'ADD_BODY': {
      const newBodies = [action.payload, ...state.bodies]
      Taro.setStorageSync(STORAGE_KEY_BODIES, JSON.stringify(newBodies))
      return { ...state, bodies: newBodies }
    }

    case 'UPDATE_BODY': {
      const newBodies = state.bodies.map(b =>
        b.id === action.payload.id ? action.payload : b
      )
      Taro.setStorageSync(STORAGE_KEY_BODIES, JSON.stringify(newBodies))
      return { ...state, bodies: newBodies }
    }

    case 'ADD_PROCESS_RECORD': {
      const newRecords = [action.payload, ...state.processRecords]
      Taro.setStorageSync(STORAGE_KEY_PROCESS, JSON.stringify(newRecords))
      return { ...state, processRecords: newRecords }
    }

    case 'UPDATE_SHADOW_ROOM': {
      const newRooms = state.shadowRooms.map(r =>
        r.id === action.payload.id ? action.payload : r
      )
      Taro.setStorageSync(STORAGE_KEY_SHADOW, JSON.stringify(newRooms))
      return { ...state, shadowRooms: newRooms }
    }

    case 'ADD_WORK_ARCHIVE': {
      const newWorks = [action.payload, ...state.workArchives]
      Taro.setStorageSync(STORAGE_KEY_WORKS, JSON.stringify(newWorks))
      return { ...state, workArchives: newWorks }
    }

    case 'UPDATE_WORK_ARCHIVE': {
      const newWorks = state.workArchives.map(w =>
        w.id === action.payload.id ? action.payload : w
      )
      Taro.setStorageSync(STORAGE_KEY_WORKS, JSON.stringify(newWorks))
      return { ...state, workArchives: newWorks }
    }

    case 'ADD_CUSTOM_ORDER': {
      const newOrders = [action.payload, ...state.customOrders]
      Taro.setStorageSync(STORAGE_KEY_ORDERS, JSON.stringify(newOrders))
      return { ...state, customOrders: newOrders }
    }

    case 'UPDATE_CUSTOM_ORDER': {
      const newOrders = state.customOrders.map(o =>
        o.id === action.payload.id ? action.payload : o
      )
      Taro.setStorageSync(STORAGE_KEY_ORDERS, JSON.stringify(newOrders))
      return { ...state, customOrders: newOrders }
    }

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<ActionType>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    try {
      const savedBodies = Taro.getStorageSync(STORAGE_KEY_BODIES)
      const savedProcess = Taro.getStorageSync(STORAGE_KEY_PROCESS)
      const savedShadow = Taro.getStorageSync(STORAGE_KEY_SHADOW)
      const savedWorks = Taro.getStorageSync(STORAGE_KEY_WORKS)
      const savedOrders = Taro.getStorageSync(STORAGE_KEY_ORDERS)

      const loadedState: AppState = { ...initialState }

      if (savedBodies) {
        try {
          loadedState.bodies = JSON.parse(savedBodies)
        } catch (e) {
          console.error('[AppContext] 解析胎体数据失败:', e)
        }
      }
      if (savedProcess) {
        try {
          loadedState.processRecords = JSON.parse(savedProcess)
        } catch (e) {
          console.error('[AppContext] 解析工序数据失败:', e)
        }
      }
      if (savedShadow) {
        try {
          loadedState.shadowRooms = JSON.parse(savedShadow)
        } catch (e) {
          console.error('[AppContext] 解析荫房数据失败:', e)
        }
      }
      if (savedWorks) {
        try {
          loadedState.workArchives = JSON.parse(savedWorks)
        } catch (e) {
          console.error('[AppContext] 解析作品数据失败:', e)
        }
      }
      if (savedOrders) {
        try {
          loadedState.customOrders = JSON.parse(savedOrders)
        } catch (e) {
          console.error('[AppContext] 解析订单数据失败:', e)
        }
      }

      dispatch({ type: 'INIT_STATE', payload: loadedState })
      console.log('[AppContext] 数据加载完成')
    } catch (e) {
      console.error('[AppContext] 加载本地存储失败:', e)
    }
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppStore(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider')
  }
  return context
}
