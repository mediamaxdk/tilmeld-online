import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Landing Page</h1>
        <p className="text-xl mb-8">Discover amazing features and services</p>
        <Button size="lg">Get Started</Button>
      </div>
    </section>
  )
}

