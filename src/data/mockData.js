export const today = "21/05/2026";

export const products = [
  { sku: "IE-CAM-CIN-400", name: "Camarão Cinza 400g", category: "Camarão" },
  { sku: "IE-CAM-DES-400", name: "Camarão Descascado 400g", category: "Camarão" },
  { sku: "IE-CAM-COZ-400", name: "Camarão Cozido 400g", category: "Camarão" },
  { sku: "IE-CAM-ROSA-400", name: "Camarão Rosa 400g", category: "Camarão" },
  { sku: "IE-CAM-7B-500", name: "Camarão Sete Barbas 500g", category: "Camarão" },
  { sku: "IE-MIX-PAELLA-500", name: "Mix Paella 500g", category: "Mix" },
  { sku: "IE-TIL-FILE-500", name: "Filé de Tilápia 500g", category: "Tilápia" },
  { sku: "IE-TIL-POSTA-800", name: "Posta de Tilápia 800g", category: "Tilápia" }
];

export const stores = [
  {
    id: "store-1",
    name: "Super Nosso Savassi",
    banner: "Super Nosso",
    address: "Av. Cristóvão Colombo, 916 - Savassi",
    city: "Belo Horizonte",
    routeWindow: "09:00 - 10:30"
  },
  {
    id: "store-2",
    name: "EPA Buritis",
    banner: "EPA",
    address: "Av. Professor Mário Werneck, 1685 - Buritis",
    city: "Belo Horizonte",
    routeWindow: "11:00 - 12:30"
  },
  {
    id: "store-3",
    name: "Super Nosso Pampulha",
    banner: "Super Nosso",
    address: "Av. Portugal, 3050 - Santa Amélia",
    city: "Belo Horizonte",
    routeWindow: "14:00 - 15:30"
  },
  {
    id: "store-4",
    name: "EPA Castelo",
    banner: "EPA",
    address: "Av. dos Engenheiros, 1280 - Castelo",
    city: "Belo Horizonte",
    routeWindow: "16:00 - 17:00"
  }
];

export const promoters = [
  { id: "prom-1", name: "Ana Luiza", phone: "5531999990101", online: true, lastAccess: "21/05/2026 08:12", scheduled: 18, completed: 18, justified: 0, photos: 36, synced: true },
  { id: "prom-2", name: "Bruno Reis", phone: "5531999990202", online: true, lastAccess: "21/05/2026 08:41", scheduled: 17, completed: 15, justified: 1, photos: 31, synced: false },
  { id: "prom-3", name: "Carla Mota", phone: "5531999990303", online: false, lastAccess: "21/05/2026 07:58", scheduled: 15, completed: 12, justified: 2, photos: 24, synced: true },
  { id: "prom-4", name: "Diego Alves", phone: "5531999990404", online: true, lastAccess: "21/05/2026 09:04", scheduled: 14, completed: 9, justified: 1, photos: 19, synced: false },
  { id: "prom-5", name: "Fernanda Costa", phone: "5531999990505", online: false, lastAccess: "20/05/2026 17:22", scheduled: 12, completed: 4, justified: 2, photos: 8, synced: false },
  { id: "prom-6", name: "Gabriel Souza", phone: "5531999990606", online: false, lastAccess: "Sem acesso hoje", scheduled: 6, completed: 0, justified: 0, photos: 0, synced: false }
];

const baseItems = products.map((product, index) => ({
  sku: product.sku,
  available: index < 6,
  price: 34.9 + index * 3,
  stock: 12 + index * 2,
  expiryDate: index % 3 === 0 ? "18/06/2026" : "",
  competitorPrice: index % 2 === 0 ? 39.9 + index * 2 : ""
}));

export const initialVisits = [
  {
    id: "visit-1",
    storeId: "store-1",
    promoterId: "prom-1",
    status: "pending",
    checkInAt: "",
    checkOutAt: "",
    beforePhoto: "",
    afterPhoto: "",
    occurrenceType: "",
    occurrenceNote: "",
    items: baseItems
  },
  {
    id: "visit-2",
    storeId: "store-2",
    promoterId: "prom-1",
    status: "pending",
    checkInAt: "",
    checkOutAt: "",
    beforePhoto: "",
    afterPhoto: "",
    occurrenceType: "",
    occurrenceNote: "",
    items: baseItems.map((item, index) => ({ ...item, stock: item.stock + index }))
  },
  {
    id: "visit-3",
    storeId: "store-3",
    promoterId: "prom-1",
    status: "justified",
    checkInAt: "",
    checkOutAt: "",
    beforePhoto: "",
    afterPhoto: "",
    occurrenceType: "Loja sem abastecimento",
    occurrenceNote: "Loja sem abastecimento no horário da visita.",
    items: baseItems,
    justification: "Loja sem abastecimento no horário da visita."
  }
];

export const gallerySeed = [
  { id: "photo-1", storeId: "store-1", promoterId: "prom-1", type: "Depois", status: "completed", time: "09:46" },
  { id: "photo-2", storeId: "store-2", promoterId: "prom-2", type: "Antes", status: "pending", time: "10:18" },
  { id: "photo-3", storeId: "store-3", promoterId: "prom-3", type: "Depois", status: "completed", time: "11:32" },
  { id: "photo-4", storeId: "store-4", promoterId: "prom-4", type: "Depois", status: "completed", time: "13:05" },
  { id: "photo-5", storeId: "store-1", promoterId: "prom-1", type: "Antes", status: "completed", time: "14:11" },
  { id: "photo-6", storeId: "store-2", promoterId: "prom-2", type: "Depois", status: "completed", time: "15:24" }
];
