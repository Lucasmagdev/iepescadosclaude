import { Product, Store, Promotor, Visit } from '../types'

export const mockProducts: Product[] = [
  { id: '1', sku: '239957', name: 'Camarão coz. int. 18/26 – pct 180g' },
  { id: '2', sku: '239872', name: 'Camarão coz. s/cabeça 36/52 – pct 180g' },
  { id: '3', sku: '239961', name: 'Camarão coz. desc. 36/52 – pct 180g' },
  { id: '4', sku: '239959', name: 'Camarão coz. desc. 40/60 – pct 300g' },
  { id: '5', sku: '239953', name: 'Camarão coz. evis. colinha 25/40 – pct 300g' },
  { id: '6', sku: '239954', name: 'Camarão cinza desc. eviscerado' },
  { id: '7', sku: '239960', name: 'Mix frutos do mar paella' },
  { id: '8', sku: '239962', name: 'Filé de tilápia' },
]

export const mockStores: Store[] = [
  { id: '1', name: 'Super Nosso', address: 'Gonçalves Dias, 687', regional: 'BH Centro' },
  { id: '2', name: 'EPA São Luiz', address: 'Av. São Luiz, 234', regional: 'BH Centro' },
  { id: '3', name: 'EPA Vitório Marçola', address: 'Rua Vitório Marçola, 153', regional: 'BH Norte' },
]

export const mockPromotores: Promotor[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@iepescados.com.br',
    phone: '(31) 99999-0001',
    regional: 'BH Centro',
    lastSyncTime: '09:45',
    firstSyncTime: '07:30',
    networkType: '4G',
    device: 'Android',
    connectionStatus: 'online',
    completionPct: 100,
    visitsCompleted: 4,
    visitsTotal: 4,
    photosCount: 12,
    syncProgress: { completed: 4, total: 4 }
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@iepescados.com.br',
    phone: '(31) 99999-0002',
    regional: 'BH Centro',
    lastSyncTime: '09:30',
    firstSyncTime: '08:00',
    networkType: 'WiFi',
    device: 'Android',
    connectionStatus: 'online',
    completionPct: 88,
    visitsCompleted: 7,
    visitsTotal: 8,
    photosCount: 18,
    syncProgress: { completed: 7, total: 8 }
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@iepescados.com.br',
    phone: '(31) 99999-0003',
    regional: 'BH Norte',
    lastSyncTime: '09:15',
    firstSyncTime: '07:45',
    networkType: '4G',
    device: 'iOS',
    connectionStatus: 'online',
    completionPct: 75,
    visitsCompleted: 3,
    visitsTotal: 4,
    photosCount: 8,
    syncProgress: { completed: 3, total: 4 }
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro@iepescados.com.br',
    phone: '(31) 99999-0004',
    regional: 'BH Sul',
    lastSyncTime: '08:45',
    firstSyncTime: '08:30',
    networkType: '3G',
    device: 'Android',
    connectionStatus: 'offline',
    completionPct: 69,
    visitsCompleted: 9,
    visitsTotal: 13,
    photosCount: 22,
    syncProgress: { completed: 9, total: 13 }
  },
  {
    id: '5',
    name: 'Carla Mendes',
    email: 'carla@iepescados.com.br',
    phone: '(31) 99999-0005',
    regional: 'BH Leste',
    lastSyncTime: '07:30',
    firstSyncTime: '07:00',
    networkType: '4G',
    device: 'Android',
    connectionStatus: 'offline',
    completionPct: 50,
    visitsCompleted: 2,
    visitsTotal: 4,
    photosCount: 6,
    syncProgress: { completed: 2, total: 4 }
  },
  {
    id: '6',
    name: 'Lucas Ferreira',
    email: 'lucas@iepescados.com.br',
    phone: '(31) 99999-0006',
    regional: 'BH Oeste',
    lastSyncTime: '-',
    firstSyncTime: '-',
    networkType: 'WiFi',
    device: 'Android',
    connectionStatus: 'not_accessed',
    completionPct: 0,
    visitsCompleted: 0,
    visitsTotal: 5,
    photosCount: 0,
    syncProgress: { completed: 0, total: 5 }
  },
]

export const mockVisits: Visit[] = [
  {
    id: '1',
    storeId: '1',
    promotorId: 'current',
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  },
  {
    id: '2',
    storeId: '2',
    promotorId: 'current',
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  },
  {
    id: '3',
    storeId: '3',
    promotorId: 'current',
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
    checkInTime: '08:30',
    checkOutTime: '09:15'
  },
]

export const dashboardStats = {
  programadas: 92,
  executadas: 66,
  justificadas: 0,
  percentual: 71,
}
