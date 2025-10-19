import type { FC } from "react"
import type { Client, Fatura } from "../data/sampleData"
import { calculateFaturaTotal, formatCurrency, formatDate } from "../data/sampleData"

type FaturaTableProps = {
  faturas: Fatura[]
  clients: Client[]
  heading?: string
  onSelect?: (fatura: Fatura) => void
  highlightId?: string | null
}

const FaturaTable: FC<FaturaTableProps> = ({ faturas, clients, heading = "Faturat", onSelect, highlightId }) => {
  const clientMap = new Map(clients.map((client) => [client.id, client]))

  const sorted = [...faturas].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="data-card">
      <h2 className="data-card-title">{heading}</h2>
      <div className="desktop-table">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">NR</th>
                <th scope="col">Pershkrimi</th>
                <th scope="col">Sasia</th>
                <th scope="col">Totali</th>
                <th scope="col">Statusi</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((fatura) => {
                const client = clientMap.get(fatura.clientId)
                const total = calculateFaturaTotal(fatura)
                const isHighlighted = highlightId === fatura.id
                const rowClassName = onSelect
                  ? isHighlighted
                    ? "table-row-clickable table-row-selected"
                    : "table-row-clickable"
                  : undefined
                return (
                  <tr
                    key={fatura.id}
                    className={rowClassName}
                    onClick={onSelect ? () => onSelect(fatura) : undefined}
                  >
                    <td data-label="Data">{formatDate(fatura.date)}</td>
                    <td data-label="NR">{fatura.nr}</td>
                    <td data-label="Pershkrimi">
                      <div className="table-cell-stack">
                        <span>{fatura.description}</span>
                        {client ? <small className="table-cell-sub">{client.name}</small> : null}
                      </div>
                    </td>
                    <td data-label="Sasia">{fatura.quantity}</td>
                    <td data-label="Totali">{formatCurrency(total)}</td>
                    <td data-label="Statusi">
                      <span className={`badge badge-${fatura.paid ? "success" : "warning"}`}>
                        {fatura.paid ? "Paguar" : "Pa paguar"}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mobile-card-grid">
        {sorted.map((fatura) => {
          const client = clientMap.get(fatura.clientId)
          const total = calculateFaturaTotal(fatura)
          const isHighlighted = highlightId === fatura.id
          const cardClassName = onSelect ? (isHighlighted ? "table-card table-card-selected" : "table-card") : "table-card"
          return (
            <button
              type="button"
              key={fatura.id}
              className={cardClassName}
              onClick={onSelect ? () => onSelect(fatura) : undefined}
              disabled={!onSelect}
            >
              <div className="table-card-header">
                <div>
                  <p className="table-card-title">{fatura.nr}</p>
                  <p className="table-card-subtitle">{client ? client.name : "Klient i panjohur"}</p>
                </div>
                <span className={`badge badge-${fatura.paid ? "success" : "warning"}`}>
                  {fatura.paid ? "Paguar" : "Pa paguar"}
                </span>
              </div>
              <p className="table-card-description">{fatura.description}</p>
              <div className="table-card-body-grid">
                <div className="table-card-row">
                  <span className="table-card-label">Data</span>
                  <span className="table-card-value">{formatDate(fatura.date)}</span>
                </div>
                <div className="table-card-row">
                  <span className="table-card-label">Sasia</span>
                  <span className="table-card-value">{fatura.quantity}</span>
                </div>
                <div className="table-card-row">
                  <span className="table-card-label">Totali</span>
                  <span className="table-card-value table-card-value-strong">{formatCurrency(total)}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FaturaTable
