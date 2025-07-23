import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlaidLink } from 'react-plaid-link'
import { useSupabase } from '../contexts/SupabaseContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BankLink() {
  const { supabase, user } = useSupabase()
  const navigate = useNavigate()
  const [linkToken, setLinkToken] = useState<string | null>(null)

  useEffect(() => {
    async function createLinkToken() {
      const response = await fetch('/api/create-link-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      })
      const { link_token } = await response.json()
      setLinkToken(link_token)
    }
    if (user) createLinkToken()
  }, [user])

  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess: async (public_token, metadata) => {
      const response = await fetch('/api/exchange-public-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token, account_id: metadata.accounts[0].id }),
      })
      const { access_token } = await response.json()

      await supabase.from('banks').insert({
        customer_id: user.id,
        plaid_access_token: access_token,
        account_id: metadata.accounts[0].id,
        account_name: metadata.accounts[0].name,
        balance: { amount: 0 },
      })

      navigate('/dashboard')
    },
  })

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Link Your Bank Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => open()} disabled={!ready}>
            Connect Bank Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}