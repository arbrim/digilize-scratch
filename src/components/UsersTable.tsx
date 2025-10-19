import type { FC } from "react"

const rows = [
  { name: "Ardit H.", role: "Administrator", email: "ardit@example.com", lastActive: "para 2 ore" },
  { name: "Besarta K.", role: "Menaxhere", email: "besarta@example.com", lastActive: "dje" },
  { name: "Lindon P.", role: "Suport", email: "lindon@example.com", lastActive: "para 5 minutash" },
]

const UsersTable: FC = () => {
  return (
    <div className="data-card">
      <h2 className="data-card-title">Anetaret e ekipit</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Emri</th>
            <th scope="col">Roli</th>
            <th scope="col">Email</th>
            <th scope="col">Aktiv per here te fundit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.email}>
              <td>{row.name}</td>
              <td>{row.role}</td>
              <td>{row.email}</td>
              <td>{row.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable
