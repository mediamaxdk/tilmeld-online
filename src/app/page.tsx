import Header from './components/Header'
import Hero from './components/Hero'
import CardSection from './components/CardSection'
import Footer from './components/Footer' 

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <CardSection />
      </main>
      <Footer />
    </div>
  )
}

