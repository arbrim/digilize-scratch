import type { FC } from "react"
import type { Client, ClientStatus } from "../data/sampleData"

type ClientsTableProps = {
  clients: Client[]
  onSelect: (clientId: string) => void
  selectedClientId?: string | null
}

const statusBadgeVariant: Record<ClientStatus, string> = {
  "I barazuar": "success",
  "Detyrime nga ne": "warning",
  "Detyrime nga klienti": "danger",
}

const ClientsTable: FC<ClientsTableProps> = ({ clients, onSelect, selectedClientId }) => {
  return (
    <div className="data-card">
      <h2 className="data-card-title">Lista e klienteve</h2>
      <div className="desktop-table">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Kompania</th>
                <th scope="col">Industria</th>
                <th scope="col">Kontakti kryesor</th>
                <th scope="col">Statusi</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const isSelected = selectedClientId === client.id
                const badgeVariant = statusBadgeVariant[client.status]
                return (
                  <tr
                    key={client.id}
                    className={isSelected ? "table-row-clickable table-row-selected" : "table-row-clickable"}
                    onClick={() => onSelect(client.id)}
                  >
                    <td data-label="Kompania">{client.name}</td>
                    <td data-label="Industria">{client.industry}</td>
                    <td data-label="Kontakti">{client.contact}</td>
                    <td data-label="Statusi">
                      <span className={`badge badge-${badgeVariant}`}>{client.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mobile-card-grid">
        {clients.map((client) => {
          const isSelected = selectedClientId === client.id
          const badgeVariant = statusBadgeVariant[client.status]
          return (
            <button
              type="button"
              key={client.id}
              className={isSelected ? "table-card table-card-selected" : "table-card"}
              onClick={() => onSelect(client.id)}
            >
              <div className="table-card-header">
                <div>
                  <p className="table-card-title">{client.name}</p>
                  <p className="table-card-subtitle">{client.industry}</p>
                </div>
                <span className={`badge badge-${badgeVariant}`}>{client.status}</span>
              </div>
              <div className="table-card-body">
                <div className="table-card-row">
                  <span className="table-card-label">Kontakti</span>
                  <span className="table-card-value table-card-long">{client.contact}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ClientsTable
