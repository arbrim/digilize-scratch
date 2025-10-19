import type { FC } from "react"

const rows = [
  { name: "Alba Trade", industry: "Retail", contact: "alba@client.com", status: "Active" },
  { name: "Kosova Logistics", industry: "Logistics", contact: "info@kosovalog.com", status: "Pending" },
  { name: "Dardan Tech", industry: "Technology", contact: "support@dardantech.io", status: "Active" },
]

const ClientsTable: FC = () => {
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
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.industry}</td>
              <td>{row.contact}</td>
              <td>
                <span className={`badge badge-${row.status === "Active" ? "success" : "warning"}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ClientsTable
