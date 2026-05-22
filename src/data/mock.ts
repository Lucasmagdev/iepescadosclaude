import { Product, Store, Promotor, Visit } from '../types'
import { ProductCheck } from '../types'

const IMG_SHRIMP_COOKED = 'https://upload.wikimedia.org/wikipedia/commons/6/60/NCI_steamed_shrimp.jpg'
const IMG_SHRIMP_WHOLE  = 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Crispy_deep-fried_prawn_of_Ulakan.JPG'
const IMG_PAELLA        = 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Paella_seafood.JPG'
const IMG_TILAPIA       = 'https://upload.wikimedia.org/wikipedia/commons/4/48/Tilapia_fish.jpg'


export const mockProducts: Product[] = [
  { id: '1', sku: '239957', name: 'Camarão coz. int. 18/26 – pct 180g',          imageUrl: IMG_SHRIMP_COOKED },
  { id: '2', sku: '239872', name: 'Camarão coz. s/cabeça 36/52 – pct 180g',      imageUrl: IMG_SHRIMP_WHOLE  },
  { id: '3', sku: '239961', name: 'Camarão coz. desc. 36/52 – pct 180g',         imageUrl: IMG_SHRIMP_COOKED },
  { id: '4', sku: '239959', name: 'Camarão coz. desc. 40/60 – pct 300g',         imageUrl: IMG_SHRIMP_COOKED },
  { id: '5', sku: '239953', name: 'Camarão coz. evis. colinha 25/40 – pct 300g', imageUrl: IMG_SHRIMP_WHOLE  },
  { id: '6', sku: '239954', name: 'Camarão cinza desc. eviscerado',               imageUrl: IMG_SHRIMP_WHOLE  },
  { id: '7', sku: '239960', name: 'Mix frutos do mar paella',                     imageUrl: IMG_PAELLA        },
  { id: '8', sku: '239962', name: 'Filé de tilápia',                              imageUrl: IMG_TILAPIA       },
]

export const mockStores: Store[] = [
  { id: '1', name: 'SUPER NOSSO 433', address: 'Gonçalves Dias, 687', regional: 'BH Centro', productIds: ['1', '2', '3'], lat: -19.9334, lng: -43.9383 },
  { id: '2', name: 'EPA 476', address: 'Av. São Luiz, 234', regional: 'BH Centro', productIds: ['1', '2', '3', '4', '5'], lat: -19.9248, lng: -43.9701 },
  { id: '3', name: 'EPA 512', address: 'Rua Vitório Marçola, 153', regional: 'BH Norte', productIds: ['1', '3', '6', '8'], lat: -19.8938, lng: -43.9445 },
  { id: '4', name: 'SUPER NOSSO 289', address: 'Av. Prof. Mário Werneck, 1685', regional: 'BH Oeste', productIds: ['1', '2', '4', '6', '7', '8'], lat: -19.9189, lng: -43.9876 },
  { id: '5', name: 'BH SHOPPING 601', address: 'Rod. BR-356, 3049 – Belvedere', regional: 'BH Sul', productIds: ['1', '2', '3', '4', '5', '6', '7', '8'], lat: -19.9547, lng: -43.9512 },
  { id: '6', name: 'EPA 347', address: 'Av. dos Engenheiros, 1280', regional: 'BH Leste', productIds: ['2', '4', '6'], lat: -19.9012, lng: -43.9134 },
]

export const mockPromotores: Promotor[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@iepescados.com.br',
    phone: '(31) 98801-2234',
    regional: 'BH Centro',
    lastSyncTime: '10:12',
    firstSyncTime: '07:18',
    networkType: '4G',
    device: 'Samsung Galaxy A54',
    connectionStatus: 'online',
    completionPct: 100,
    visitsCompleted: 5,
    visitsTotal: 5,
    photosCount: 18,
    syncProgress: { completed: 5, total: 5 },
    lat: -19.9245, lng: -43.9705,
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@iepescados.com.br',
    phone: '(31) 98802-3341',
    regional: 'BH Centro',
    lastSyncTime: '10:05',
    firstSyncTime: '07:55',
    networkType: 'WiFi',
    device: 'Motorola G84',
    connectionStatus: 'online',
    completionPct: 83,
    visitsCompleted: 5,
    visitsTotal: 6,
    photosCount: 16,
    syncProgress: { completed: 5, total: 6 },
    lat: -19.9338, lng: -43.9380,
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@iepescados.com.br',
    phone: '(31) 98803-5512',
    regional: 'BH Norte',
    lastSyncTime: '10:31',
    firstSyncTime: '07:48',
    networkType: '4G',
    device: 'iPhone 13',
    connectionStatus: 'online',
    completionPct: 40,
    visitsCompleted: 2,
    visitsTotal: 5,
    photosCount: 8,
    syncProgress: { completed: 2, total: 5 },
    lat: -19.8940, lng: -43.9448,
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro@iepescados.com.br',
    phone: '(31) 98804-7723',
    regional: 'BH Sul',
    lastSyncTime: '09:47',
    firstSyncTime: '08:22',
    networkType: '3G',
    device: 'Xiaomi Redmi 12',
    connectionStatus: 'offline',
    completionPct: 57,
    visitsCompleted: 4,
    visitsTotal: 7,
    photosCount: 14,
    syncProgress: { completed: 4, total: 7 },
    lat: -19.9550, lng: -43.9508,
  },
  {
    id: '5',
    name: 'Carla Mendes',
    email: 'carla@iepescados.com.br',
    phone: '(31) 98805-9934',
    regional: 'BH Leste',
    lastSyncTime: '08:55',
    firstSyncTime: '07:02',
    networkType: '4G',
    device: 'Samsung Galaxy A34',
    connectionStatus: 'online',
    completionPct: 75,
    visitsCompleted: 3,
    visitsTotal: 4,
    photosCount: 10,
    syncProgress: { completed: 3, total: 4 },
    lat: -19.9015, lng: -43.9130,
  },
  {
    id: '6',
    name: 'Rafael Nunes',
    email: 'rafael@iepescados.com.br',
    phone: '(31) 98806-1145',
    regional: 'BH Oeste',
    lastSyncTime: '-',
    firstSyncTime: '-',
    networkType: 'WiFi',
    device: 'Motorola Edge 30',
    connectionStatus: 'not_accessed',
    completionPct: 0,
    visitsCompleted: 0,
    visitsTotal: 6,
    photosCount: 0,
    syncProgress: { completed: 0, total: 6 },
    lat: -19.9192, lng: -43.9880,
  },
]

const today = new Date().toISOString().split('T')[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

// Visitas do promotor logado (Ana Costa) — roteiro de demo
export const mockVisits: Visit[] = [
  {
    id: 'v-c1', storeId: '1', promotorId: 'current', date: today, status: 'completed',
    checkInTime: '07:52', checkOutTime: '08:44',
    checkInLat: -19.9334, checkInLng: -43.9383,
    checkOutLat: -19.9334, checkOutLng: -43.9383,
    occurrenceType: 'Sem ocorrência', occurrenceNote: '',
  },
  {
    id: 'v-c2', storeId: '2', promotorId: 'current', date: today, status: 'completed',
    checkInTime: '09:05', checkOutTime: '10:01',
    checkInLat: -19.9248, checkInLng: -43.9701,
    checkOutLat: -19.9248, checkOutLng: -43.9701,
    occurrenceType: 'Preço divergente',
    occurrenceNote: 'Camarão 18/26 marcado R$16,90 na prateleira, sistema R$14,50',
  },
  {
    id: 'v-c3', storeId: '3', promotorId: 'current', date: today, status: 'in_progress',
    checkInTime: '10:28',
    checkInLat: -19.8938, checkInLng: -43.9445,
  },
  { id: 'v-c4', storeId: '4', promotorId: 'current', date: today, status: 'pending' },
  { id: 'v-c5', storeId: '5', promotorId: 'current', date: today, status: 'pending' },
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
    checkInTime: '09:00', checkOutTime: '09:50', occurrenceType: 'Sem espaço no freezer',
    occurrenceNote: 'Freezer reorganizado pelo supermercado, Mix Paella sem espaço',
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

  // ── Ontem (dados históricos para filtro de período) ──────────────────────
  { id: 'v-y-1', storeId: '3', promotorId: '1', date: yesterday, status: 'completed', checkInTime: '08:10', checkOutTime: '09:05', occurrenceType: 'Sem ocorrência', checkInLat: -19.8938, checkInLng: -43.9445 },
  { id: 'v-y-2', storeId: '4', promotorId: '1', date: yesterday, status: 'completed', checkInTime: '09:30', checkOutTime: '10:20', occurrenceType: 'Sem ocorrência' },
  { id: 'v-y-3', storeId: '5', promotorId: '1', date: yesterday, status: 'completed', checkInTime: '11:00', checkOutTime: '11:50', occurrenceType: 'Sem ocorrência', checkInLat: -19.9547, checkInLng: -43.9512 },
  { id: 'v-y-4', storeId: '1', promotorId: '2', date: yesterday, status: 'completed', checkInTime: '08:05', checkOutTime: '08:58', occurrenceType: 'Sem ocorrência', checkInLat: -19.9334, checkInLng: -43.9383 },
  { id: 'v-y-5', storeId: '6', promotorId: '2', date: yesterday, status: 'completed', checkInTime: '09:20', checkOutTime: '10:10', occurrenceType: 'Preço divergente', occurrenceNote: 'Camarão Cinza R$16,99 vs sistema R$14,90' },
  { id: 'v-y-6', storeId: '2', promotorId: '2', date: yesterday, status: 'justified', occurrenceType: 'Loja fechada', occurrenceNote: 'Feriado municipal' },
  { id: 'v-y-7', storeId: '5', promotorId: '4', date: yesterday, status: 'completed', checkInTime: '08:30', checkOutTime: '09:25', occurrenceType: 'Sem ocorrência', checkInLat: -19.9547, checkInLng: -43.9512 },
  { id: 'v-y-8', storeId: '3', promotorId: '5', date: yesterday, status: 'completed', checkInTime: '07:15', checkOutTime: '08:05', occurrenceType: 'Ruptura de produto', occurrenceNote: 'Mix Paella sem estoque no CD' },
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

export interface MockPhoto {
  id: string
  storeId: string
  promotorId: string
  timestamp: string
  date: string
  imageUrl: string
  lat?: number
  lng?: number
}

const P = (lock: number) => `https://loremflickr.com/640/480/seafood,fish?lock=${lock}`

export const mockPhotos: MockPhoto[] = [
  // Hoje — Maria Silva
  { id: 'mp-101', storeId: '1', promotorId: '1', timestamp: '08:18', date: today, imageUrl: P(12), lat: -19.9334, lng: -43.9383 },
  { id: 'mp-102', storeId: '2', promotorId: '1', timestamp: '09:30', date: today, imageUrl: P(14), lat: -19.9248, lng: -43.9701 },
  // Hoje — João Santos
  { id: 'mp-201', storeId: '1', promotorId: '2', timestamp: '08:52', date: today, imageUrl: P(22), lat: -19.9334, lng: -43.9383 },
  { id: 'mp-202', storeId: '2', promotorId: '2', timestamp: '09:58', date: today, imageUrl: P(24) },
  // Hoje — Ana Costa
  { id: 'mp-301', storeId: '3', promotorId: '3', timestamp: '08:40', date: today, imageUrl: P(32) },
  { id: 'mp-302', storeId: '6', promotorId: '3', timestamp: '09:50', date: today, imageUrl: P(34) },
  // Hoje — Pedro Oliveira
  { id: 'mp-401', storeId: '5', promotorId: '4', timestamp: '09:25', date: today, imageUrl: P(42), lat: -19.9547, lng: -43.9512 },
  // Hoje — Carla Mendes
  { id: 'mp-501', storeId: '6', promotorId: '5', timestamp: '07:55', date: today, imageUrl: P(52) },
  { id: 'mp-502', storeId: '3', promotorId: '5', timestamp: '09:10', date: today, imageUrl: P(54) },
  // Ontem — Maria Silva
  { id: 'mp-y101', storeId: '3', promotorId: '1', timestamp: '09:05', date: yesterday, imageUrl: P(62), lat: -19.8938, lng: -43.9445 },
  { id: 'mp-y102', storeId: '5', promotorId: '1', timestamp: '11:50', date: yesterday, imageUrl: P(64), lat: -19.9547, lng: -43.9512 },
  // Ontem — João Santos
  { id: 'mp-y201', storeId: '1', promotorId: '2', timestamp: '08:58', date: yesterday, imageUrl: P(72), lat: -19.9334, lng: -43.9383 },
  // Ontem — Carla Mendes
  { id: 'mp-y501', storeId: '3', promotorId: '5', timestamp: '08:05', date: yesterday, imageUrl: P(82) },
]

export const dashboardStats = {
  programadas: mockPromotores.reduce((sum, p) => sum + p.visitsTotal, 0),
  executadas: mockPromotores.reduce((sum, p) => sum + p.visitsCompleted, 0),
  justificadas: 1,
  get percentual() {
    return Math.round((this.executadas / this.programadas) * 100)
  },
}
