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
        <button type="button" className="back-button" onClick={() => navigate("/fatura")}>
          <span aria-hidden="true" className="back-button-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18L9 12L15 6" />
              <path d="M10 12H20" />
            </svg>
          </span>
          <span>Kthehu te faturat</span>
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
