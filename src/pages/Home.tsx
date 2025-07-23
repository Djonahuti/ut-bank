import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to UT Bank</h1>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}