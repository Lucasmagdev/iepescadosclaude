import { Product, Store, Promotor, Visit } from '../types'
import { ProductCheck } from '../types'

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
  { id: '1', name: 'SUPER NOSSO 433', address: 'Gonçalves Dias, 687', regional: 'BH Centro', productIds: ['1', '2', '3'] },
  { id: '2', name: 'EPA 476', address: 'Av. São Luiz, 234', regional: 'BH Centro', productIds: ['1', '2', '3', '4', '5'] },
  { id: '3', name: 'EPA 512', address: 'Rua Vitório Marçola, 153', regional: 'BH Norte', productIds: ['1', '3', '6', '8'] },
  { id: '4', name: 'SUPER NOSSO 289', address: 'Av. Prof. Mário Werneck, 1685', regional: 'BH Oeste', productIds: ['1', '2', '4', '6', '7', '8'] },
  { id: '5', name: 'BH SHOPPING 601', address: 'Rod. BR-356, 3049 – Belvedere', regional: 'BH Sul', productIds: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  { id: '6', name: 'EPA 347', address: 'Av. dos Engenheiros, 1280', regional: 'BH Leste', productIds: ['2', '4', '6'] },
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
    syncProgress: { completed: 4, total: 4 },
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
    syncProgress: { completed: 7, total: 8 },
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
    syncProgress: { completed: 3, total: 4 },
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
    syncProgress: { completed: 9, total: 13 },
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
    syncProgress: { completed: 2, total: 4 },
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
    syncProgress: { completed: 0, total: 5 },
  },
]

const today = new Date().toISOString().split('T')[0]

// Visitas do promotor logado (current)
export const mockVisits: Visit[] = [
  { id: 'v-c1', storeId: '1', promotorId: 'current', date: today, status: 'pending' },
  { id: 'v-c2', storeId: '2', promotorId: 'current', date: today, status: 'pending' },
  {
    id: 'v-c3', storeId: '3', promotorId: 'current', date: today, status: 'completed',
    checkInTime: '08:30', checkOutTime: '09:15',
    occurrenceType: 'Sem ocorrência', occurrenceNote: '',
  },
]

// Visitas históricas de todos promotores (para gestão)
export const mockAllVisits: Visit[] = [
  // Maria Silva – BH Centro
  {
    id: 'v-1-1', storeId: '1', promotorId: '1', date: today, status: 'completed',
    checkInTime: '07:32', checkOutTime: '08:18', occurrenceType: 'Sem ocorrência',
    checkInLat: -19.9334, checkInLng: -43.9383,
  },
  {
    id: 'v-1-2', storeId: '2', promotorId: '1', date: today, status: 'completed',
    checkInTime: '08:41', checkOutTime: '09:30', occurrenceType: 'Preço divergente',
    occurrenceNote: 'Etiqueta mostrando R$14,90, sistema com R$13,50',
    checkInLat: -19.9248, checkInLng: -43.9701,
  },
  {
    id: 'v-1-3', storeId: '4', promotorId: '1', date: today, status: 'completed',
    checkInTime: '10:05', checkOutTime: '10:55', occurrenceType: 'Sem ocorrência',
  },
  {
    id: 'v-1-4', storeId: '5', promotorId: '1', date: today, status: 'completed',
    checkInTime: '11:20', checkOutTime: '12:10', occurrenceType: 'Sem ocorrência',
  },
  // João Santos – BH Centro
  {
    id: 'v-2-1', storeId: '1', promotorId: '2', date: today, status: 'completed',
    checkInTime: '08:00', checkOutTime: '08:52', occurrenceType: 'Ruptura de produto',
    occurrenceNote: 'Tilápia sem estoque desde ontem',
    checkInLat: -19.9334, checkInLng: -43.9383,
  },
  {
    id: 'v-2-2', storeId: '2', promotorId: '2', date: today, status: 'completed',
    checkInTime: '09:10', checkOutTime: '09:58', occurrenceType: 'Sem ocorrência',
  },
  {
    id: 'v-2-3', storeId: '3', promotorId: '2', date: today, status: 'justified',
    occurrenceType: 'Loja fechada', occurrenceNote: 'Loja interditada por reforma',
  },
  // Ana Costa – BH Norte
  {
    id: 'v-3-1', storeId: '3', promotorId: '3', date: today, status: 'completed',
    checkInTime: '07:47', checkOutTime: '08:40', occurrenceType: 'Sem ocorrência',
  },
  {
    id: 'v-3-2', storeId: '6', promotorId: '3', date: today, status: 'completed',
    checkInTime: '09:00', checkOutTime: '09:50', occurrenceType: 'Sem espaço no FREEZER',
    occurrenceNote: 'FREEZER reorganizado pelo supermercado, Mix Paella sem espaço',
  },
  {
    id: 'v-3-3', storeId: '1', promotorId: '3', date: today, status: 'completed',
    checkInTime: '10:15', checkOutTime: '11:00', occurrenceType: 'Sem ocorrência',
  },
  {
    id: 'v-3-4', storeId: '2', promotorId: '3', date: today, status: 'pending' },
  // Pedro Oliveira – BH Sul
  {
    id: 'v-4-1', storeId: '5', promotorId: '4', date: today, status: 'completed',
    checkInTime: '08:31', checkOutTime: '09:25', occurrenceType: 'Sem ocorrência',
  },
  {
    id: 'v-4-2', storeId: '4', promotorId: '4', date: today, status: 'completed',
    checkInTime: '09:50', checkOutTime: '10:40', occurrenceType: 'Ruptura de produto',
    occurrenceNote: 'Camarão Cinza esgotado no CD, não chegou para o cliente',
  },
  // Carla Mendes – BH Leste
  {
    id: 'v-5-1', storeId: '6', promotorId: '5', date: today, status: 'completed',
    checkInTime: '07:03', checkOutTime: '07:55', occurrenceType: 'Sem ocorrência',
  },
  {
    id: 'v-5-2', storeId: '3', promotorId: '5', date: today, status: 'completed',
    checkInTime: '08:20', checkOutTime: '09:10', occurrenceType: 'Preço divergente',
    occurrenceNote: 'Concorrente com promoção agressiva: Camarão Rosa R$11,99',
  },
  // Lucas Ferreira – sem acesso
]

// Product checks vinculados às visitas históricas
export const mockProductChecks: ProductCheck[] = [
  // v-1-1 (Maria / Super Nosso Savassi) - tudo disponível
  { id: 'pc-1-1-1', visitId: 'v-1-1', productId: '1', sku: '239957', available: true, price: 13.99, stock: 24, competitorPrice: 15.50 },
  { id: 'pc-1-1-2', visitId: 'v-1-1', productId: '2', sku: '239872', available: true, price: 12.49, stock: 18 },
  { id: 'pc-1-1-3', visitId: 'v-1-1', productId: '3', sku: '239961', available: true, price: 14.90, stock: 20 },
  { id: 'pc-1-1-4', visitId: 'v-1-1', productId: '4', sku: '239959', available: true, price: 21.90, stock: 15 },
  { id: 'pc-1-1-5', visitId: 'v-1-1', productId: '5', sku: '239953', available: true, price: 22.99, stock: 12 },
  { id: 'pc-1-1-6', visitId: 'v-1-1', productId: '6', sku: '239954', available: true, price: 18.90, stock: 30 },
  { id: 'pc-1-1-7', visitId: 'v-1-1', productId: '7', sku: '239960', available: true, price: 24.90, stock: 10 },
  { id: 'pc-1-1-8', visitId: 'v-1-1', productId: '8', sku: '239962', available: true, price: 19.90, stock: 22 },
  // v-1-2 (Maria / EPA São Luiz) - preço divergente no camarão cinza
  { id: 'pc-1-2-1', visitId: 'v-1-2', productId: '1', sku: '239957', available: true, price: 14.90, stock: 16, competitorPrice: 13.99 },
  { id: 'pc-1-2-2', visitId: 'v-1-2', productId: '2', sku: '239872', available: true, price: 13.50, stock: 14 },
  { id: 'pc-1-2-3', visitId: 'v-1-2', productId: '3', sku: '239961', available: false },
  { id: 'pc-1-2-4', visitId: 'v-1-2', productId: '4', sku: '239959', available: true, price: 22.90, stock: 8 },
  { id: 'pc-1-2-5', visitId: 'v-1-2', productId: '5', sku: '239953', available: true, price: 23.90, stock: 6 },
  { id: 'pc-1-2-6', visitId: 'v-1-2', productId: '6', sku: '239954', available: true, price: 14.90, stock: 20 },
  { id: 'pc-1-2-7', visitId: 'v-1-2', productId: '7', sku: '239960', available: true, price: 25.90, stock: 7 },
  { id: 'pc-1-2-8', visitId: 'v-1-2', productId: '8', sku: '239962', available: true, price: 20.90, stock: 18 },
  // v-2-1 (João / Super Nosso) - ruptura tilápia
  { id: 'pc-2-1-1', visitId: 'v-2-1', productId: '1', sku: '239957', available: true, price: 13.99, stock: 20 },
  { id: 'pc-2-1-2', visitId: 'v-2-1', productId: '2', sku: '239872', available: true, price: 12.49, stock: 15 },
  { id: 'pc-2-1-3', visitId: 'v-2-1', productId: '3', sku: '239961', available: true, price: 14.90, stock: 18 },
  { id: 'pc-2-1-4', visitId: 'v-2-1', productId: '4', sku: '239959', available: true, price: 21.90, stock: 12 },
  { id: 'pc-2-1-5', visitId: 'v-2-1', productId: '5', sku: '239953', available: false },
  { id: 'pc-2-1-6', visitId: 'v-2-1', productId: '6', sku: '239954', available: true, price: 18.90, stock: 25 },
  { id: 'pc-2-1-7', visitId: 'v-2-1', productId: '7', sku: '239960', available: true, price: 24.90, stock: 9 },
  { id: 'pc-2-1-8', visitId: 'v-2-1', productId: '8', sku: '239962', available: false },
  // v-3-1 (Ana / EPA Vitório)
  { id: 'pc-3-1-1', visitId: 'v-3-1', productId: '1', sku: '239957', available: true, price: 13.49, stock: 28 },
  { id: 'pc-3-1-2', visitId: 'v-3-1', productId: '2', sku: '239872', available: true, price: 12.49, stock: 22 },
  { id: 'pc-3-1-3', visitId: 'v-3-1', productId: '3', sku: '239961', available: true, price: 14.90, stock: 16 },
  { id: 'pc-3-1-4', visitId: 'v-3-1', productId: '4', sku: '239959', available: true, price: 21.90, stock: 10 },
  { id: 'pc-3-1-5', visitId: 'v-3-1', productId: '5', sku: '239953', available: true, price: 22.99, stock: 8 },
  { id: 'pc-3-1-6', visitId: 'v-3-1', productId: '6', sku: '239954', available: true, price: 18.90, stock: 35 },
  { id: 'pc-3-1-7', visitId: 'v-3-1', productId: '7', sku: '239960', available: false },
  { id: 'pc-3-1-8', visitId: 'v-3-1', productId: '8', sku: '239962', available: true, price: 19.90, stock: 20 },
  // v-4-1 (Pedro / BH Shopping)
  { id: 'pc-4-1-1', visitId: 'v-4-1', productId: '1', sku: '239957', available: true, price: 14.99, stock: 32, competitorPrice: 16.90 },
  { id: 'pc-4-1-2', visitId: 'v-4-1', productId: '2', sku: '239872', available: true, price: 13.49, stock: 24 },
  { id: 'pc-4-1-3', visitId: 'v-4-1', productId: '3', sku: '239961', available: true, price: 15.90, stock: 20 },
  { id: 'pc-4-1-4', visitId: 'v-4-1', productId: '4', sku: '239959', available: true, price: 22.90, stock: 14 },
  { id: 'pc-4-1-5', visitId: 'v-4-1', productId: '5', sku: '239953', available: true, price: 23.90, stock: 10 },
  { id: 'pc-4-1-6', visitId: 'v-4-1', productId: '6', sku: '239954', available: false },
  { id: 'pc-4-1-7', visitId: 'v-4-1', productId: '7', sku: '239960', available: true, price: 26.90, stock: 8 },
  { id: 'pc-4-1-8', visitId: 'v-4-1', productId: '8', sku: '239962', available: true, price: 20.90, stock: 18 },
  // v-5-1 (Carla / EPA Castelo)
  { id: 'pc-5-1-1', visitId: 'v-5-1', productId: '1', sku: '239957', available: true, price: 13.99, stock: 20 },
  { id: 'pc-5-1-2', visitId: 'v-5-1', productId: '2', sku: '239872', available: true, price: 12.99, stock: 18 },
  { id: 'pc-5-1-3', visitId: 'v-5-1', productId: '3', sku: '239961', available: true, price: 14.90, stock: 14 },
  { id: 'pc-5-1-4', visitId: 'v-5-1', productId: '4', sku: '239959', available: true, price: 21.90, stock: 10 },
  { id: 'pc-5-1-5', visitId: 'v-5-1', productId: '5', sku: '239953', available: false },
  { id: 'pc-5-1-6', visitId: 'v-5-1', productId: '6', sku: '239954', available: true, price: 18.90, stock: 28 },
  { id: 'pc-5-1-7', visitId: 'v-5-1', productId: '7', sku: '239960', available: true, price: 25.90, stock: 6 },
  { id: 'pc-5-1-8', visitId: 'v-5-1', productId: '8', sku: '239962', available: true, price: 19.90, stock: 16 },
]

export const dashboardStats = {
  programadas: mockPromotores.reduce((sum, p) => sum + p.visitsTotal, 0),
  executadas: mockPromotores.reduce((sum, p) => sum + p.visitsCompleted, 0),
  justificadas: 1,
  get percentual() {
    return Math.round((this.executadas / this.programadas) * 100)
  },
}
