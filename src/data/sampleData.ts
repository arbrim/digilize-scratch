export type ClientStatus = "I barazuar" | "Detyrime nga ne" | "Detyrime nga klienti"

export type FaturaUnit = "m" | "m2" | "cope"

export type Client = {
  id: string
  name: string
  industry: string
  contact: string
  status: ClientStatus
}

export type Fatura = {
  id: string
  nr: string
  clientId: string
  date: string
  description: string
  quantity: number
  unitPrice: number
  paid: boolean
}

export type FaturaLineItem = {
  id: string
  faturaId: string
  description: string
  colorType: string
  quantity: number
  unit: FaturaUnit
  unitPrice: number
}

export const clients: Client[] = [
  {
    id: "client-1",
    name: "Alba Trade",
    industry: "Retail",
    contact: "alba@client.com",
    status: "I barazuar",
  },
  {
    id: "client-2",
    name: "Kosova Logistics",
    industry: "Logjistika",
    contact: "info@kosovalog.com",
    status: "Detyrime nga ne",
  },
  {
    id: "client-3",
    name: "Dardan Tech",
    industry: "Teknologji",
    contact: "support@dardantech.io",
    status: "Detyrime nga klienti",
  },
]

export const faturas: Fatura[] = [
  {
    id: "FAT-001",
    nr: "001/2025",
    clientId: "client-1",
    date: "2025-02-15",
    description: "Mbajtje mujore",
    quantity: 1,
    unitPrice: 220,
    paid: true,
  },
  {
    id: "FAT-002",
    nr: "002/2025",
    clientId: "client-1",
    date: "2025-03-12",
    description: "Upgrade pike shitjeje",
    quantity: 3,
    unitPrice: 145,
    paid: false,
  },
  {
    id: "FAT-003",
    nr: "003/2025",
    clientId: "client-2",
    date: "2025-02-28",
    description: "Integrim logjistik",
    quantity: 2,
    unitPrice: 310,
    paid: true,
  },
  {
    id: "FAT-004",
    nr: "004/2025",
    clientId: "client-3",
    date: "2025-03-01",
    description: "Audit infrastrukture",
    quantity: 1,
    unitPrice: 480,
    paid: false,
  },
]

export const faturaLineItems: FaturaLineItem[] = [
  {
    id: "FAT-001-line-1",
    faturaId: "FAT-001",
    description: "Mbajtje mujore e platformes",
    colorType: "CMYK",
    quantity: 1,
    unit: "cope",
    unitPrice: 220,
  },
  {
    id: "FAT-002-line-1",
    faturaId: "FAT-002",
    description: "Upgrade POS premium",
    colorType: "Pantone",
    quantity: 3,
    unit: "cope",
    unitPrice: 145,
  },
  {
    id: "FAT-002-line-2",
    faturaId: "FAT-002",
    description: "Brending material promocional",
    colorType: "CMYK",
    quantity: 12,
    unit: "m2",
    unitPrice: 18.5,
  },
  {
    id: "FAT-002-line-3",
    faturaId: "FAT-002",
    description: "Konsulence per konfigurim",
    colorType: "-",
    quantity: 4,
    unit: "cope",
    unitPrice: 75,
  },
  {
    id: "FAT-003-line-1",
    faturaId: "FAT-003",
    description: "Integrim magazinimi",
    colorType: "RAL",
    quantity: 1,
    unit: "cope",
    unitPrice: 420,
  },
  {
    id: "FAT-003-line-2",
    faturaId: "FAT-003",
    description: "Trajnim stafi",
    colorType: "-",
    quantity: 6,
    unit: "cope",
    unitPrice: 45,
  },
  {
    id: "FAT-004-line-1",
    faturaId: "FAT-004",
    description: "Audit i rrjetit",
    colorType: "RGB",
    quantity: 1,
    unit: "cope",
    unitPrice: 480,
  },
]

export const getClientById = (clientId: string): Client | undefined =>
  clients.find((client) => client.id === clientId)

export const getFaturasByClient = (clientId: string): Fatura[] =>
  faturas.filter((fatura) => fatura.clientId === clientId)

export const getFaturaLineItems = (faturaId: string): FaturaLineItem[] =>
  faturaLineItems.filter((item) => item.faturaId === faturaId)

export const calculateFaturaTotal = (fatura: Fatura, lineItems?: FaturaLineItem[]): number => {
  const items = lineItems ?? getFaturaLineItems(fatura.id)
  if (items.length > 0) {
    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    return Number(total.toFixed(2))
  }
  return Number((fatura.quantity * fatura.unitPrice).toFixed(2))
}

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value)

export const formatDate = (value: string): string =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(value))
