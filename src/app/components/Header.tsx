import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Logo</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="#" className="hover:text-gray-600">Home</Link></li>
            <li><Link href="#" className="hover:text-gray-600">About</Link></li>
            <li><Link href="#" className="hover:text-gray-600">Contact</Link></li>
          </ul>
        </nav>
        <Button>Sign Up</Button>
      </div>
    </header>
  )
}

