import type { FC } from "react"
import type { Client, Fatura } from "../data/sampleData"
import ClientsTable from "../components/ClientsTable"
import ClientFaturasCard from "../components/ClientFaturasCard"
import { getFaturasByClient } from "../data/sampleData"

type ClientsPageProps = {
  clients: Client[]
  selectedClient: Client | null
  onSelectClient: (clientId: string) => void
  onSelectFatura: (fatura: Fatura) => void
}

const ClientsPage: FC<ClientsPageProps> = ({ clients, selectedClient, onSelectClient, onSelectFatura }) => {
  const clientFaturas = selectedClient ? getFaturasByClient(selectedClient.id) : []

  return (
    <div className="dashboard-section-stack">
      <ClientsTable
        clients={clients}
        onSelect={onSelectClient}
        selectedClientId={selectedClient?.id}
      />
      {selectedClient ? (
        <ClientFaturasCard client={selectedClient} faturas={clientFaturas} onSelectFatura={onSelectFatura} />
      ) : (
        <div className="data-card">
          <h2 className="data-card-title">Zgjidh nje klient</h2>
          <p>Zgjidh nje rresht nga lista per te pare faturat e klientit te perzgjedhur.</p>
        </div>
      )}
    </div>
  )
}

export default ClientsPage
