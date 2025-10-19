import { useMemo, useState } from "react"
import type { ChangeEvent, FC, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import type { Client } from "../data/sampleData"
import { formatCurrency, formatDate } from "../data/sampleData"

type FaturaLineUnit = "m" | "m2" | "cope"

type FaturaLine = {
  id: string
  description: string
  colorType: string
  amount: string
  unit: FaturaLineUnit
  price: string
}

type FaturaFormState = {
  nr: string
  clientId: string
  date: string
  paid: boolean
  items: FaturaLine[]
}

type FaturaCreatePageProps = {
  clients: Client[]
  onBackToList: () => void
}

const todayISO = new Date().toISOString().slice(0, 10)
const colorTypeOptions = ["CMYK", "Pantone", "RGB", "RAL", "Metallic"]

const createLineId = () => `line-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`

const createEmptyLine = (): FaturaLine => ({
  id: createLineId(),
  description: "Plastifikim",
  colorType: "",
  amount: "1",
  unit: "m",
  price: "0",
})

const FaturaCreatePage: FC<FaturaCreatePageProps> = ({ clients, onBackToList }) => {
  const navigate = useNavigate()
  const defaultClientId = useMemo(() => (clients.length > 0 ? clients[0].id : ""), [clients])
  const [formState, setFormState] = useState<FaturaFormState>({
    nr: "",
    clientId: defaultClientId,
    date: todayISO,
    paid: false,
    items: [createEmptyLine()],
  })
  const [submitted, setSubmitted] = useState(false)

  const totalGeneral = useMemo(
    () =>
      formState.items.reduce((sum, item) => {
        const amount = Number(item.amount) || 0
        const price = Number(item.price) || 0
        return sum + amount * price
      }, 0),
    [formState.items],
  )

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target
    const { name, value } = target

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (submitted) {
      setSubmitted(false)
    }
  }

  const handlePaidChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setFormState((prev) => ({
      ...prev,
      paid: checked,
    }))

    if (submitted) {
      setSubmitted(false)
    }
  }

  const handleLineChange = (
    index: number,
    field: keyof Omit<FaturaLine, "id">,
    value: string,
  ) => {
    setFormState((prev) => {
      const nextItems = prev.items.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      )
      return {
        ...prev,
        items: nextItems,
      }
    })

    if (submitted) {
      setSubmitted(false)
    }
  }

  const handleAddLine = () => {
    setFormState((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyLine()],
    }))
  }

  const handleRemoveLine = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  if (clients.length === 0) {
    return (
      <div className="dashboard-section-stack">
        <div className="data-card">
          <h2 className="data-card-title">Shtimi i fatures</h2>
          <p>Qe te krijosh nje fature, se pari shto nje klient.</p>
          <div className="form-actions">
            <button type="button" className="secondary-action" onClick={() => navigate("/clients/new")}>
              Shto klientin e pare
            </button>
          </div>
        </div>
      </div>
    )
  }

  const selectedClient = clients.find((client) => client.id === formState.clientId)
  const isSingleLine = formState.items.length === 1

  return (
    <div className="dashboard-section-stack">
      <div className="data-card">
        <button type="button" className="back-button" onClick={() => navigate(-1)}>
          <span aria-hidden="true" className="back-button-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18L9 12L15 6" />
              <path d="M10 12H20" />
            </svg>
          </span>
          <span>Kthehu</span>
        </button>
      </div>
      <div className="data-card">
        <h2 className="data-card-title">Shto fature</h2>
        <p className="client-card-sub">
          Ploteso detajet e meposhtme per te regjistruar nje fature per klientin e zgjedhur. Kjo forme eshte per demonstruar
          rrjedhen dhe nuk ruan ende te dhenat ne server.
        </p>
        {submitted ? (
          <p className="form-success">Forma u dergua. Sheno te dhenat sipas nevojes suaj.</p>
        ) : null}
        <form className="data-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fatura-nr">Numri i fatures</label>
            <input
              id="fatura-nr"
              name="nr"
              type="text"
              value={formState.nr}
              onChange={handleFieldChange}
              placeholder="p.sh. 005/2025"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fatura-client">Klienti</label>
            <select id="fatura-client" name="clientId" value={formState.clientId} onChange={handleFieldChange}>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {selectedClient ? (
              <small className="form-helper">Kontakt: {selectedClient.contact}</small>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="fatura-date">Data</label>
            <input
              id="fatura-date"
              name="date"
              type="date"
              value={formState.date}
              onChange={handleFieldChange}
              required
            />
            <small className="form-helper">Formati aktual: {formatDate(formState.date)}</small>
          </div>
          <div className="form-group form-group-table">
            <label htmlFor="fatura-description">Detajet e fatures</label>
            <div className="table-scroll form-table-scroll">
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
                  {formState.items.map((item, index) => {
                    const lineTotal = (Number(item.amount) || 0) * (Number(item.price) || 0)

                    return (
                      <tr key={item.id}>
                        <td data-label="Pershkrimi">
                          <input
                            id={`fatura-description-${item.id}`}
                            name="description"
                            type="text"
                            value={item.description}
                            onChange={(event) =>
                              handleLineChange(index, "description", event.target.value)
                            }
                            placeholder="p.sh. Plastifikim"
                            required
                          />
                        </td>
                        <td data-label="Lloji i ngjyres">
                          <input
                            id={`fatura-colorType-${item.id}`}
                            name="colorType"
                            type="text"
                            value={item.colorType}
                            onChange={(event) => handleLineChange(index, "colorType", event.target.value)}
                            placeholder="Zgjidh ose shkruaj"
                            list="color-type-options"
                          />
                        </td>
                        <td data-label="Sasia">
                          <input
                            id={`fatura-amount-${item.id}`}
                            name="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.amount}
                            onChange={(event) => handleLineChange(index, "amount", event.target.value)}
                            required
                          />
                        </td>
                        <td data-label="Njesia">
                          <select
                            id={`fatura-unit-${item.id}`}
                            name="unit"
                            value={item.unit}
                            onChange={(event) =>
                              handleLineChange(index, "unit", event.target.value as FaturaLineUnit)
                            }
                          >
                            <option value="m">m</option>
                            <option value="m2">m2</option>
                            <option value="cope">cope</option>
                          </select>
                        </td>
                        <td data-label="Cmimi">
                          <input
                            id={`fatura-price-${item.id}`}
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(event) => handleLineChange(index, "price", event.target.value)}
                            required
                          />
                        </td>
                        <td data-label="Totali">
                          <span className="table-total-value">{formatCurrency(lineTotal)}</span>
                        </td>
                        <td data-label="Veprime" className="table-cell-actions">
                          <button
                            type="button"
                            className="table-action-button"
                            onClick={() => handleRemoveLine(index)}
                            disabled={isSingleLine}
                          >
                            Fshij
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" colSpan={5}>
                      Totali pergjithshem
                    </th>
                    <td>
                      <span className="table-total-value">{formatCurrency(totalGeneral)}</span>
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
            <div className="table-inline-actions">
              <button type="button" className="secondary-action" onClick={handleAddLine}>
                Shto rresht
              </button>
            </div>
          </div>
          <div className="form-group form-group-checkbox">
            <label htmlFor="fatura-paid">Paguar?</label>
            <input
              id="fatura-paid"
              name="paid"
              type="checkbox"
              checked={formState.paid}
              onChange={handlePaidChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-action">
              Ruaj faturen
            </button>
            <button type="button" className="secondary-action" onClick={onBackToList}>
              Kthehu te faturat
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FaturaCreatePage

