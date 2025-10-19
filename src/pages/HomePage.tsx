import type { FC } from "react"
import type { Fatura } from "../data/sampleData"
import { formatDate } from "../data/sampleData"

type HomePageProps = {
  faturas: Fatura[]
  onSelectFatura: (fatura: Fatura) => void
  onAddClient: () => void
  onAddFatura: () => void
}

const HomePage: FC<HomePageProps> = ({ faturas, onSelectFatura, onAddClient, onAddFatura }) => {
  const upcomingInvoices = [...faturas]
    .filter((fatura) => !fatura.paid)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  return (
    <div className="placeholder-card">
      <h2>Mire se erdhe serish!</h2>
      <p>
        Perdorni butonat me poshte per te shtuar nje klient te ri ose nje fature te re. Me poshte keni faturat qe
        kane nevoje per vemendje te shpejte.
      </p>
      <div className="placeholder-actions">
        <button type="button" className="secondary-action" onClick={onAddClient}>
          Shto klient
        </button>
        <button type="button" className="secondary-action" onClick={onAddFatura}>
          Shto fature
        </button>
      </div>
      {upcomingInvoices.length > 0 ? (
        <div className="home-invoices">
          <h3>Fatura per tu ndjekur</h3>
          <ul>
            {upcomingInvoices.map((fatura) => (
              <li key={fatura.id}>
                <button type="button" className="link-button" onClick={() => onSelectFatura(fatura)}>
                  {fatura.nr} - {fatura.description} - {formatDate(fatura.date)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default HomePage
