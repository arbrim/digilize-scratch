import type { FC } from "react"
import type { Client, Fatura } from "../data/sampleData"
import FaturaTable from "../components/FaturaTable"

type FaturaPageProps = {
  faturas: Fatura[]
  clients: Client[]
  onSelectFatura: (fatura: Fatura) => void
}

const FaturaPage: FC<FaturaPageProps> = ({ faturas, clients, onSelectFatura }) => {
  return <FaturaTable faturas={faturas} clients={clients} heading="Lista e faturave" onSelect={onSelectFatura} />
}

export default FaturaPage
