import type { FC } from "react"

const rows = [
  { name: "Ardit H.", role: "Administrator", email: "ardit@example.com", lastActive: "2 hours ago" },
  { name: "Besarta K.", role: "Manager", email: "besarta@example.com", lastActive: "Yesterday" },
  { name: "Lindon P.", role: "Support", email: "lindon@example.com", lastActive: "5 minutes ago" },
]

const UsersTable: FC = () => {
  return (
    <div className="data-card">
      <h2 className="data-card-title">Team Members</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Email</th>
            <th scope="col">Last Active</th>
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
