import type { FC } from "react"
import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import FaturaDetailCard from "../components/FaturaDetailCard"
import type { Client, Fatura } from "../data/sampleData"

type FaturaDetailPageProps = {
  faturas: Fatura[]
  clients: Client[]
  onBackToClient: (clientId: string) => void
}

const FaturaDetailPage: FC<FaturaDetailPageProps> = ({ faturas, clients, onBackToClient }) => {
  const { faturaId } = useParams()
  const navigate = useNavigate()

  const fatura = useMemo(() => faturas.find((entry) => entry.id === faturaId), [faturas, faturaId])
  const client = useMemo(() => (fatura ? clients.find((entry) => entry.id === fatura.clientId) : undefined), [
    clients,
    fatura,
  ])

  if (!fatura) {
    return (
      <div className="data-card">
        <h2 className="data-card-title">Fatura nuk u gjet</h2>
        <p>Fatura e kerkuar nuk ekziston ose eshte hequr.</p>
        <div className="fatura-detail-actions">
          <button type="button" className="secondary-action" onClick={() => navigate("/fatura")}>
            Kthehu te faturat
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-section-stack">
      <div className="data-card">
        <button type="button" className="link-button" onClick={() => navigate("/fatura")}>
          &lt;- Kthehu te faturat
        </button>
      </div>
      <FaturaDetailCard
        fatura={fatura}
        client={client}
        onBackToClient={client ? onBackToClient : undefined}
      />
    </div>
  )
}

export default FaturaDetailPage
