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
      <div className="data-card">
        <h2 className="data-card-title">Detajet e klientit</h2>
        <p>Zgjidh nje klient nga lista per te hapur faqen me faturat dhe informacionet shoqeruese.</p>
      </div>
    </div>
  )
}

export default ClientsPage
