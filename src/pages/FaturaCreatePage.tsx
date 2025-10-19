import { useMemo, useState } from "react"
import type { ChangeEvent, FC, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import type { Client } from "../data/sampleData"
import { formatDate } from "../data/sampleData"

type FaturaFormState = {
  nr: string
  clientId: string
  date: string
  description: string
  quantity: string
  unitPrice: string
  paid: boolean
}

type FaturaCreatePageProps = {
  clients: Client[]
  onBackToList: () => void
}

const todayISO = new Date().toISOString().slice(0, 10)

const FaturaCreatePage: FC<FaturaCreatePageProps> = ({ clients, onBackToList }) => {
  const navigate = useNavigate()
  const defaultClientId = useMemo(() => (clients.length > 0 ? clients[0].id : ""), [clients])
  const [formState, setFormState] = useState<FaturaFormState>({
    nr: "",
    clientId: defaultClientId,
    date: todayISO,
    description: "",
    quantity: "1",
    unitPrice: "0",
    paid: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const target = event.target
    const { name, value } = target
    const nextValue =
      target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : value

    setFormState((prev) => ({
      ...prev,
      [name]: nextValue,
    }))

    if (submitted) {
      setSubmitted(false)
    }
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

  return (
    <div className="dashboard-section-stack">
      <div className="data-card">
        <button type="button" className="link-button" onClick={() => navigate(-1)}>
          &lt;- Kthehu
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
              onChange={handleChange}
              placeholder="p.sh. 005/2025"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fatura-client">Klienti</label>
            <select id="fatura-client" name="clientId" value={formState.clientId} onChange={handleChange}>
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
              onChange={handleChange}
              required
            />
            <small className="form-helper">Formati aktual: {formatDate(formState.date)}</small>
          </div>
          <div className="form-group">
            <label htmlFor="fatura-description">Pershkrimi</label>
            <textarea
              id="fatura-description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Pershkrimi i shkurter i sherbimit"
              rows={3}
              required
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fatura-quantity">Sasia</label>
              <input
                id="fatura-quantity"
                name="quantity"
                type="number"
                min="1"
                value={formState.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fatura-unitPrice">Cmimi njesi (EUR)</label>
              <input
                id="fatura-unitPrice"
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formState.unitPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group form-group-checkbox">
              <label htmlFor="fatura-paid">Paguar?</label>
              <input
                id="fatura-paid"
                name="paid"
                type="checkbox"
                checked={formState.paid}
                onChange={handleChange}
              />
            </div>
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
