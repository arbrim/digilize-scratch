import type { FC } from "react"
import type { Client, Fatura } from "../data/sampleData"
import { calculateFaturaTotal, formatCurrency, formatDate } from "../data/sampleData"

const colorTypeOptions = ["CMYK", "Pantone", "RGB", "RAL", "Metallic"]
const priceOptions = Array.from({ length: 16 }, (_, index) => (15 + index).toString())

type FaturaDetailCardProps = {
  fatura: Fatura
  client?: Client
  onBackToClient?: (clientId: string) => void
}

const FaturaDetailCard: FC<FaturaDetailCardProps> = ({ fatura, client, onBackToClient }) => {
  const clientName = client?.name ?? "Klient i panjohur"
  const total = calculateFaturaTotal(fatura)
  const unitPriceDisplay = String(fatura.unitPrice)
  const amountDisplay = String(fatura.quantity)
  const colorTypeDisplay = "-"
  const unitDisplay = "cope"

  return (
    <div className="data-card">
      <div className="fatura-detail-header">
        <div>
          <h2 className="data-card-title">Detajet e fatures</h2>
          <p className="client-card-sub">
            {`Fatura ${fatura.nr} - Data: ${formatDate(fatura.date)} - ${client ? `Klienti: ${client.name}` : "Klient i panjohur"}`}
          </p>
        </div>
        <span className={`badge badge-${fatura.paid ? "success" : "warning"}`}>
          {fatura.paid ? "Paguar" : "Pa paguar"}
        </span>
      </div>

      <form className="data-form" aria-label="Detajet e fatures">
        <div className="form-group">
          <label htmlFor="fatura-detail-nr">Numri i fatures</label>
          <input id="fatura-detail-nr" name="nr" type="text" value={fatura.nr} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="fatura-detail-client">Klienti</label>
          <input id="fatura-detail-client" name="client" type="text" value={clientName} disabled />
          {client?.contact ? <small className="form-helper">Kontakt: {client.contact}</small> : null}
        </div>
        <div className="form-group">
          <label htmlFor="fatura-detail-date">Data</label>
          <input id="fatura-detail-date" name="date" type="date" value={fatura.date} disabled />
          <small className="form-helper">Formati i lexuar: {formatDate(fatura.date)}</small>
        </div>

        <div className="form-group form-group-table">
          <label htmlFor="fatura-detail-table">Detajet e fatures</label>
          <div className="table-scroll form-table-scroll" id="fatura-detail-table">
            <table className="form-input-table">
              <thead>
                <tr>
                  <th scope="col">Pershkrimi</th>
                  <th scope="col">Lloji i ngjyres</th>
                  <th scope="col">Sasia</th>
                  <th scope="col">Njesia</th>
                  <th scope="col">Cmimi</th>
                  <th scope="col">Totali</th>
                  <th scope="col">Veprime</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Pershkrimi">
                    <input id="fatura-detail-description" type="text" value={fatura.description} disabled />
                  </td>
                  <td data-label="Lloji i ngjyres">
                    <input id="fatura-detail-color" type="text" value={colorTypeDisplay} disabled list="color-type-options" />
                  </td>
                  <td data-label="Sasia">
                    <input id="fatura-detail-amount" type="text" value={amountDisplay} disabled />
                  </td>
                  <td data-label="Njesia">
                    <select id="fatura-detail-unit" value={unitDisplay} disabled>
                      <option value="m">m</option>
                      <option value="m2">m2</option>
                      <option value="cope">cope</option>
                    </select>
                  </td>
                  <td data-label="Cmimi">
                    <input
                      id="fatura-detail-price"
                      type="text"
                      inputMode="decimal"
                      value={unitPriceDisplay}
                      disabled
                      list="price-options"
                    />
                  </td>
                  <td data-label="Totali">
                    <span className="table-total-value">{formatCurrency(total)}</span>
                  </td>
                  <td data-label="Veprime" className="table-cell-actions">
                    <button type="button" className="table-action-button" disabled>
                      Pamje vetem leximi
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={5}>
                    Totali pergjithshem
                  </th>
                  <td>
                    <span className="table-total-value">{formatCurrency(total)}</span>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <datalist id="color-type-options">
            {colorTypeOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
          <datalist id="price-options">
            {priceOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>

        <div className="form-group form-group-checkbox">
          <label htmlFor="fatura-detail-paid">Paguar?</label>
          <input id="fatura-detail-paid" name="paid" type="checkbox" checked={fatura.paid} readOnly disabled />
        </div>

        {client && onBackToClient ? (
          <div className="form-actions">
            <button type="button" className="secondary-action" onClick={() => onBackToClient(client.id)}>
              Hape klientin
            </button>
          </div>
        ) : null}
      </form>
    </div>
  )
}

export default FaturaDetailCard
