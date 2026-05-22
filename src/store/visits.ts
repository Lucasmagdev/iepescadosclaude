import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Visit, ProductCheck } from '../types'
import { mockVisits } from '../data/mock'
import { db } from '../lib/db'

interface VisitState {
  visits: Visit[]
  currentVisit: Visit | null
  productChecks: ProductCheck[]
  setCurrentVisit: (visit: Visit | null) => void
  updateVisitStatus: (visitId: string, status: Visit['status']) => void
  updateVisit: (visitId: string, updates: Partial<Visit>) => void
  addProductCheck: (check: ProductCheck) => void
  updateProductCheck: (checkId: string, updates: Partial<ProductCheck>) => void
  getVisitProductChecks: (visitId: string) => ProductCheck[]
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error'
  setSyncStatus: (status: 'idle' | 'syncing' | 'synced' | 'error') => void
  loadFromDB: () => Promise<void>
}

export const useVisitStore = create<VisitState>()(
  persist(
    (set, get) => ({
      visits: mockVisits,
      currentVisit: null,
      productChecks: [],
      syncStatus: 'synced',

      setCurrentVisit: (visit) => set({ currentVisit: visit }),

      updateVisitStatus: (visitId, status) => {
        set((state) => ({
          visits: state.visits.map((v) => v.id === visitId ? { ...v, status } : v),
        }))
        const updated = get().visits.find((v) => v.id === visitId)
        if (updated) void db.visits.put(updated)
      },

      updateVisit: (visitId, updates) => {
        set((state) => ({
          visits: state.visits.map((v) => v.id === visitId ? { ...v, ...updates } : v),
          currentVisit:
            state.currentVisit?.id === visitId
              ? { ...state.currentVisit, ...updates }
              : state.currentVisit,
        }))
        const updated = get().visits.find((v) => v.id === visitId)
        if (updated) void db.visits.put(updated)
      },

      addProductCheck: (check) => {
        set((state) => ({ productChecks: [...state.productChecks, check] }))
        void db.productChecks.put(check)
      },

      updateProductCheck: (checkId, updates) => {
        set((state) => ({
          productChecks: state.productChecks.map((c) =>
            c.id === checkId ? { ...c, ...updates } : c
          ),
        }))
        const updated = get().productChecks.find((c) => c.id === checkId)
        if (updated) void db.productChecks.put(updated)
      },

      getVisitProductChecks: (visitId) => {
        return get().productChecks.filter((c) => c.visitId === visitId)
      },

      setSyncStatus: (syncStatus) => set({ syncStatus }),

      loadFromDB: async () => {
        const [dbVisits, dbChecks] = await Promise.all([
          db.visits.toArray(),
          db.productChecks.toArray(),
        ])
        if (dbVisits.length > 0) {
          set({ visits: dbVisits, productChecks: dbChecks })
        }
      },
    }),
    { name: 'ie-pescados-visits-v4', version: 4 }
  )
)
