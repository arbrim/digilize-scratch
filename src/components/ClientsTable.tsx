import type { FC } from "react"
import type { Client } from "../data/sampleData"

type ClientsTableProps = {
  clients: Client[]
  onSelect: (clientId: string) => void
  selectedClientId?: string | null
}

const ClientsTable: FC<ClientsTableProps> = ({ clients, onSelect, selectedClientId }) => {
  return (
    <div className="data-card">
      <h2 className="data-card-title">Clients Overview</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Company</th>
            <th scope="col">Industry</th>
            <th scope="col">Primary Contact</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const isSelected = selectedClientId === client.id
            return (
              <tr
                key={client.id}
                className={isSelected ? "table-row-clickable table-row-selected" : "table-row-clickable"}
                onClick={() => onSelect(client.id)}
              >
                <td>{client.name}</td>
                <td>{client.industry}</td>
                <td>{client.contact}</td>
                <td>
                  <span className={`badge badge-${client.status === "Active" ? "success" : client.status === "Pending" ? "warning" : "inactive"}`}>
                    {client.status}
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

export default ClientsTable
