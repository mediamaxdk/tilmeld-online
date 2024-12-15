import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Velkommen til Tilmeld.Online!</h1>
        <p className="text-xl mb-8">Nem tilmelding til arrangementer og events</p>
        <p className="text-xl mb-8">Nem booking af tider hos fx. frisører, fysioterapeuter, etc.</p>
        <Button size="lg">Kom igang!</Button>
      </div>
    </section>
  )
}

