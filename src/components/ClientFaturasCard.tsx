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
              <tr
                key={fatura.id}
                className="table-row-clickable"
                onClick={() => onSelectFatura(fatura)}
              >
                <td>{formatDate(fatura.date)}</td>
                <td>{fatura.nr}</td>
                <td>{fatura.description}</td>
                <td>{fatura.quantity}</td>
                <td>{formatCurrency(total)}</td>
                <td>
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
  )
}

export default ClientFaturasCard
