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
        <button type="button" className="link-button" onClick={() => navigate("/clients")}>
          &lt;- Kthehu te klientet
        </button>
      </div>
      <ClientFaturasCard client={client} faturas={clientFaturas} onSelectFatura={onSelectFatura} />
    </div>
  )
}

export default ClientDetailsPage
