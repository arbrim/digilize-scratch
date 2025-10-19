import type { FC } from "react"
import type { Client, Fatura } from "../data/sampleData"
import FaturaDetailCard from "../components/FaturaDetailCard"
import FaturaTable from "../components/FaturaTable"

type FaturaPageProps = {
  faturas: Fatura[]
  clients: Client[]
  selectedFatura: Fatura | null
  onSelectFatura: (fatura: Fatura) => void
  onBackToClient: (clientId: string) => void
}

const FaturaPage: FC<FaturaPageProps> = ({ faturas, clients, selectedFatura, onSelectFatura, onBackToClient }) => {
  if (selectedFatura) {
    const client = clients.find((entry) => entry.id === selectedFatura.clientId)
    return <FaturaDetailCard fatura={selectedFatura} client={client} onBackToClient={onBackToClient} />
  }

  return (
    <FaturaTable faturas={faturas} clients={clients} heading="Lista e faturave" onSelect={onSelectFatura} />
  )
}

export default FaturaPage
