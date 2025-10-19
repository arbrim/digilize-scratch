import type { FC } from "react"

type HomePageProps = {
  onAddClient: () => void
  onAddFatura: () => void
}

const HomePage: FC<HomePageProps> = ({ onAddClient, onAddFatura }) => {
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
    </div>
  )
}

export default HomePage
