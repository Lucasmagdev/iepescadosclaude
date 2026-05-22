export interface Promotor {
  id: string
  name: string
  email: string
  phone: string
  regional: string
  lastSyncTime: string
  firstSyncTime: string
  networkType: '3G' | '4G' | 'WiFi'
  device: string
  connectionStatus: 'online' | 'offline' | 'not_accessed'
  completionPct: number
  visitsCompleted: number
  visitsTotal: number
  photosCount: number
  syncProgress: { completed: number; total: number }
}

export interface Store {
  id: string
  name: string
  address: string
  regional: string
  productIds: string[]
}

export interface Product {
  id: string
  sku: string
  name: string
  imageUrl?: string
}

export interface Visit {
  id: string
  storeId: string
  promotorId: string
  date: string
  status: 'pending' | 'in_progress' | 'completed' | 'justified'
  checkInTime?: string
  checkOutTime?: string
  checkInPhoto?: string
  checkOutPhoto?: string
  checkInLat?: number
  checkInLng?: number
  checkOutLat?: number
  checkOutLng?: number
  occurrenceType?: string
  occurrenceNote?: string
}

export interface ProductCheck {
  id: string
  visitId: string
  productId: string
  sku: string
  available: boolean
  price?: number
  stock?: number
  expiryDate?: string
  competitorPrice?: number
}

export interface User {
  id: string
  email: string
  name: string
  role: 'promotor' | 'gestao'
}
