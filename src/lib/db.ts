import Dexie, { Table } from 'dexie'
import { Visit, ProductCheck, Store, Product, Promotor } from '../types'

export interface SyncQueueItem {
  id?: number
  type: 'visit' | 'productCheck' | 'photo'
  data: Record<string, unknown>
  timestamp: number
  synced: boolean
}

export class IEPescadosDB extends Dexie {
  visits!: Table<Visit>
  productChecks!: Table<ProductCheck>
  stores!: Table<Store>
  products!: Table<Product>
  syncQueue!: Table<SyncQueueItem>

  constructor() {
    super('IEPescadosDB')
    this.version(1).stores({
      visits: 'id, storeId, promotorId, date, status',
      productChecks: 'id, visitId, productId',
      stores: 'id, regional',
      products: 'id, sku',
      syncQueue: '++id, type, synced, timestamp'
    })
    this.version(2).stores({
      visits: 'id, storeId, promotorId, date, status',
      productChecks: 'id, visitId, productId',
      stores: 'id, regional',
      products: 'id, sku',
      syncQueue: '++id, type, synced, timestamp'
    }).upgrade(tx => tx.table('visits').clear().then(() => tx.table('productChecks').clear()))
  }
}

export const db = new IEPescadosDB()

// Sync queue helpers
export async function addToSyncQueue(type: SyncQueueItem['type'], data: Record<string, unknown>) {
  await db.syncQueue.add({
    type,
    data,
    timestamp: Date.now(),
    synced: false
  })
}

export async function getPendingSyncItems() {
  return await db.syncQueue.where('synced').equals(0).toArray()
}

export async function markAsSynced(id: number) {
  await db.syncQueue.update(id, { synced: true })
}

export async function clearSyncedItems() {
  await db.syncQueue.where('synced').equals(1).delete()
}

// Initialize default data
export async function initializeOfflineData(stores: Store[], products: Product[]) {
  const existingStores = await db.stores.count()
  if (existingStores === 0) {
    await db.stores.bulkAdd(stores)
  }
  
  const existingProducts = await db.products.count()
  if (existingProducts === 0) {
    await db.products.bulkAdd(products)
  }
}
