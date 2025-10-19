import { useState } from "react"
import type { ChangeEvent, FC, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import type { ClientStatus } from "../data/sampleData"

type ClientFormState = {
  name: string
  industry: string
  contact: string
  status: ClientStatus
}

const statusOptions: ClientStatus[] = ["Active", "Pending", "Inactive"]

const ClientCreatePage: FC = () => {
  const navigate = useNavigate()
  const [formState, setFormState] = useState<ClientFormState>({
    name: "",
    industry: "",
    contact: "",
    status: "Active",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormState((prev) => ({
      ...prev,
      [name]: name === "status" ? (value as ClientStatus) : value,
    }))
    if (submitted) {
      setSubmitted(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const handleCancel = () => {
    navigate("/clients")
  }

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
        <h2 className="data-card-title">Shto klient</h2>
        <p className="client-card-sub">
          Ploteso fushat me poshte per te regjistruar nje klient te ri. Shembulli aktual nuk ruan te dhenat, por mund te
          perdoresh formen per ushtrime.
        </p>
        {submitted ? (
          <p className="form-success">Forma u dergua. Ne kete prototip, te dhenat nuk ruhen ende automatikisht.</p>
        ) : null}
        <form className="data-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="client-name">Emri i klientit</label>
            <input
              id="client-name"
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              placeholder="p.sh. Alba Trade"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="client-industry">Industria</label>
            <input
              id="client-industry"
              name="industry"
              type="text"
              value={formState.industry}
              onChange={handleChange}
              placeholder="p.sh. Retail"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="client-contact">Kontakti kryesor</label>
            <input
              id="client-contact"
              name="contact"
              type="email"
              value={formState.contact}
              onChange={handleChange}
              placeholder="p.sh. info@kompania.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="client-status">Statusi</label>
            <select id="client-status" name="status" value={formState.status} onChange={handleChange}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "Active" ? "Aktiv" : status === "Pending" ? "Ne pritje" : "Jo aktiv"}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-action">
              Ruaj klientin
            </button>
            <button type="button" className="secondary-action" onClick={handleCancel}>
              Anulo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientCreatePage
