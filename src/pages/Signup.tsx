import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Signup() {
  const { supabase } = useSupabase()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    nin: '',
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { email, password, ...customerData } = formData

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await supabase.from('customers').insert({
          user_id: data.user.id,
          email,
          ...customerData,
        })
        navigate('/bank-link')
      }
    } catch (error) {
      console.error('Signup error:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="w-full p2 border rounded"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="nin"
              placeholder="National Identification Number"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}