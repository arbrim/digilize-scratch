import type { FC } from "react"

const rows = [
  { nr: 1, pershkrimi: "Sherbime konsulence", sasia: 2, cmimi: 150.5 },
  { nr: 2, pershkrimi: "Mirembajtje mujore", sasia: 1, cmimi: 89.99 },
  { nr: 3, pershkrimi: "Implementim funksionaliteti", sasia: 3, cmimi: 120 },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value)

const FaturaTable: FC = () => {
  const totalValue = rows.reduce((sum, item) => sum + item.sasia * item.cmimi, 0)

  return (
    <div className="fatura-card">
      <h2 className="fatura-title">Fatura e muajit</h2>
      <table className="fatura-table">
        <thead>
          <tr>
            <th scope="col">Nr.</th>
            <th scope="col">Pershkrimi</th>
            <th scope="col">Sasia</th>
            <th scope="col">Cmimi</th>
            <th scope="col">Totali</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowTotal = row.sasia * row.cmimi
            return (
              <tr key={row.nr}>
                <td>{row.nr}</td>
                <td>{row.pershkrimi}</td>
                <td>{row.sasia}</td>
                <td>{formatCurrency(row.cmimi)}</td>
                <td>{formatCurrency(rowTotal)}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={4} scope="row">
              Totali i pergjithshem
            </th>
            <td>{formatCurrency(totalValue)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default FaturaTable
