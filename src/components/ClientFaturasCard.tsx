import type { FC } from "react"
import type { Client, Fatura } from "../data/sampleData"
import { calculateFaturaTotal, formatCurrency, formatDate } from "../data/sampleData"

type ClientFaturasCardProps = {
  client: Client
  faturas: Fatura[]
  onSelectFatura: (fatura: Fatura) => void
}

const ClientFaturasCard: FC<ClientFaturasCardProps> = ({ client, faturas, onSelectFatura }) => {
  const sorted = [...faturas].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (sorted.length === 0) {
    return (
      <div className="data-card">
        <h2 className="data-card-title">Faturat per {client.name}</h2>
        <p>Ky klient ende nuk ka fatura te regjistruara.</p>
      </div>
    )
  }

  return (
    <div className="data-card">
      <div className="client-card-header">
        <div>
          <h2 className="data-card-title">Faturat per {client.name}</h2>
          <p className="client-card-sub">Industria: {client.industry} - Kontakti: {client.contact}</p>
        </div>
      </div>
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
                const total = calculateFaturaTotal(fatura)
                return (
                  <tr key={fatura.id} className="table-row-clickable" onClick={() => onSelectFatura(fatura)}>
                    <td data-label="Data">{formatDate(fatura.date)}</td>
                    <td data-label="NR">{fatura.nr}</td>
                    <td data-label="Pershkrimi">{fatura.description}</td>
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
          const total = calculateFaturaTotal(fatura)
          return (
            <button
              type="button"
              key={fatura.id}
              className="table-card"
              onClick={() => onSelectFatura(fatura)}
            >
              <div className="table-card-header">
                <div>
                  <p className="table-card-title">{fatura.nr}</p>
                  <p className="table-card-subtitle">{formatDate(fatura.date)}</p>
                </div>
                <span className={`badge badge-${fatura.paid ? "success" : "warning"}`}>
                  {fatura.paid ? "Paguar" : "Pa paguar"}
                </span>
              </div>
              <p className="table-card-description">{fatura.description}</p>
              <div className="table-card-body-grid">
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

export default ClientFaturasCard
