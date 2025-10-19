import type { FC } from "react"
import type { Fatura } from "../data/sampleData"
import { formatDate } from "../data/sampleData"

type HomePageProps = {
  faturas: Fatura[]
  onSelectFatura: (fatura: Fatura) => void
  onGoToClients: () => void
  onGoToFaturas: () => void
}

const HomePage: FC<HomePageProps> = ({ faturas, onSelectFatura, onGoToClients, onGoToFaturas }) => {
  const upcomingInvoices = [...faturas]
    .filter((fatura) => !fatura.paid)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  return (
    <div className="placeholder-card">
      <h2>Mire se erdhe serish!</h2>
      <p>
        Zgjidh "Klientet" per te punuar me klientet, "Faturat" per te pare listen e plote, ose perzgjidh nje fature
        me poshte per te pare detajet shpejt.
      </p>
      <div className="placeholder-actions">
        <button type="button" className="secondary-action" onClick={onGoToClients}>
          Shiko klientet
        </button>
        <button type="button" className="secondary-action" onClick={onGoToFaturas}>
          Hap faturat
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
