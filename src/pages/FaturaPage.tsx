import { useMemo, useState } from "react"
import type { ChangeEvent, FC } from "react"
import type { Client, Fatura } from "../data/sampleData"
import { formatDate } from "../data/sampleData"
import FaturaTable from "../components/FaturaTable"

type FaturaPageProps = {
  faturas: Fatura[]
  clients: Client[]
  onSelectFatura: (fatura: Fatura) => void
}

const FaturaPage: FC<FaturaPageProps> = ({ faturas, clients, onSelectFatura }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFaturas = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (!normalized) {
      return faturas
    }

    return faturas.filter((fatura) => {
      const description = fatura.description.toLowerCase()
      const invoiceNumber = fatura.nr.toLowerCase()
      const statusLabel = (fatura.paid ? "paguar paid" : "pa paguar unpaid").toLowerCase()
      const formattedDate = formatDate(fatura.date).toLowerCase()
      const rawDate = fatura.date.toLowerCase()

      return (
        description.includes(normalized) ||
        invoiceNumber.includes(normalized) ||
        statusLabel.includes(normalized) ||
        formattedDate.includes(normalized) ||
        rawDate.includes(normalized)
      )
    })
  }, [faturas, searchTerm])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const trimmedSearch = searchTerm.trim()
  const hasActiveSearch = trimmedSearch.length > 0

  return (
    <div className="dashboard-section-stack">
      <div className="data-card">
        <div className="form-group">
          <label htmlFor="fatura-search">Kerko faturat</label>
          <input
            id="fatura-search"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Kerko sipas statusit (paguar/pa paguar), dates ose pershkrimit"
          />
        </div>
        <p className="client-card-sub">
          {hasActiveSearch
            ? `${filteredFaturas.length} rezultat${filteredFaturas.length === 1 ? "" : "e"} per "${trimmedSearch}"`
            : "Perdor fushen e kerkes per te filtruar faturat me status, date ose pershkrim."}
        </p>
      </div>
      <FaturaTable
        faturas={filteredFaturas}
        clients={clients}
        heading="Lista e faturave"
        onSelect={onSelectFatura}
      />
    </div>
  )
}

export default FaturaPage
