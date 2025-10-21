import type { FC } from "react"
import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ClientFaturasCard from "../components/ClientFaturasCard"
import type { Client, Fatura } from "../data/sampleData"

type ClientDetailsPageProps = {
  clients: Client[]
  faturas: Fatura[]
  onSelectFatura: (fatura: Fatura) => void
}

const ClientDetailsPage: FC<ClientDetailsPageProps> = ({ clients, faturas, onSelectFatura }) => {
  const { clientId } = useParams()
  const navigate = useNavigate()

  const client = useMemo(() => clients.find((entry) => entry.id === clientId), [clients, clientId])
  const clientFaturas = useMemo(
    () => (client ? faturas.filter((fatura) => fatura.clientId === client.id) : []),
    [client, faturas],
  )

  if (!client) {
    return (
      <div className="data-card">
        <h2 className="data-card-title">Klienti nuk u gjet</h2>
        <p>Klienti i kerkuar nuk ekziston ose eshte hequr.</p>
        <div className="fatura-detail-actions">
          <button type="button" className="secondary-action" onClick={() => navigate("/clients")}>
            Kthehu te klientet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-section-stack">
      <div className="data-card">
        <button type="button" className="back-button" onClick={() => navigate("/clients")}>
          <span aria-hidden="true" className="back-button-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18L9 12L15 6" />
              <path d="M10 12H20" />
            </svg>
          </span>
          <span>Kthehu te klientet</span>
        </button>
      </div>
      <ClientFaturasCard client={client} faturas={clientFaturas} onSelectFatura={onSelectFatura} />
    </div>
  )
}

export default ClientDetailsPage
