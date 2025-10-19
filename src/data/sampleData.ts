export type ClientStatus = "Active" | "Pending" | "Inactive"

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

export const clients: Client[] = [
  {
    id: "client-1",
    name: "Alba Trade",
    industry: "Retail",
    contact: "alba@client.com",
    status: "Active",
  },
  {
    id: "client-2",
    name: "Kosova Logistics",
    industry: "Logistics",
    contact: "info@kosovalog.com",
    status: "Pending",
  },
  {
    id: "client-3",
    name: "Dardan Tech",
    industry: "Technology",
    contact: "support@dardantech.io",
    status: "Active",
  },
]

export const faturas: Fatura[] = [
  {
    id: "FAT-001",
    nr: "001/2025",
    clientId: "client-1",
    date: "2025-02-15",
    description: "Maintenance retainer",
    quantity: 1,
    unitPrice: 220,
    paid: true,
  },
  {
    id: "FAT-002",
    nr: "002/2025",
    clientId: "client-1",
    date: "2025-03-12",
    description: "Point of sale upgrade",
    quantity: 3,
    unitPrice: 145,
    paid: false,
  },
  {
    id: "FAT-003",
    nr: "003/2025",
    clientId: "client-2",
    date: "2025-02-28",
    description: "Logistics integration",
    quantity: 2,
    unitPrice: 310,
    paid: true,
  },
  {
    id: "FAT-004",
    nr: "004/2025",
    clientId: "client-3",
    date: "2025-03-01",
    description: "Infrastructure audit",
    quantity: 1,
    unitPrice: 480,
    paid: false,
  },
]

export const getClientById = (clientId: string): Client | undefined =>
  clients.find((client) => client.id === clientId)

export const getFaturasByClient = (clientId: string): Fatura[] =>
  faturas.filter((fatura) => fatura.clientId === clientId)

export const calculateFaturaTotal = (fatura: Fatura): number =>
  Number((fatura.quantity * fatura.unitPrice).toFixed(2))

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
