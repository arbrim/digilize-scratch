import type { FC } from "react"
import type { Client } from "../data/sampleData"
import ClientsTable from "../components/ClientsTable"

type ClientsPageProps = {
  clients: Client[]
  onSelectClient: (clientId: string) => void
}

const ClientsPage: FC<ClientsPageProps> = ({ clients, onSelectClient }) => {
  return (
    <div className="dashboard-section-stack">
      <ClientsTable clients={clients} onSelect={onSelectClient} />
    </div>
  )
}

export default ClientsPage
