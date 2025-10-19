import type { FC } from "react"
import type { Client, Fatura } from "../data/sampleData"
import { calculateFaturaTotal, formatCurrency, formatDate } from "../data/sampleData"

type FaturaDetailCardProps = {
  fatura: Fatura
  client?: Client
  onBackToClient?: (clientId: string) => void
}

const FaturaDetailCard: FC<FaturaDetailCardProps> = ({ fatura, client, onBackToClient }) => {
  const total = calculateFaturaTotal(fatura)

  return (
    <div className="data-card">
      <div className="fatura-detail-header">
        <div>
          <h2 className="data-card-title">Fatura {fatura.nr}</h2>
          <p className="client-card-sub">
            Data: {formatDate(fatura.date)} - {client ? `Klienti: ${client.name}` : "Klient i panjohur"}
          </p>
        </div>
        <span className={`badge badge-${fatura.paid ? "success" : "warning"}`}>
          {fatura.paid ? "Paid" : "Unpaid"}
        </span>
      </div>

      <div className="fatura-detail-grid">
        <div>
          <h3>Pershkrimi</h3>
          <p>{fatura.description}</p>
        </div>
        <div>
          <h3>Sasia</h3>
          <p>{fatura.quantity}</p>
        </div>
        <div>
          <h3>Totali</h3>
          <p>{formatCurrency(total)}</p>
        </div>
      </div>

      {client && onBackToClient ? (
        <div className="fatura-detail-actions">
          <button type="button" className="secondary-action" onClick={() => onBackToClient(client.id)}>
            Kthehu te klienti
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default FaturaDetailCard


