import { useState, useEffect } from 'react'
import { useSupabase } from '../contexts/SupabaseContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const { supabase, user } = useSupabase()
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (customer) {
        const { data: banks } = await supabase
          .from('banks')
          .select('*')
          .eq('customer_id', customer.id)
        setAccounts(banks || [])

        const { data: txns } = await supabase
          .from('transactions')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false })
        setTransactions(txns || [])
      }
    }
    fetchData()
  }, [user, supabase])

  const chartData = {
    labels: transactions.map(t => new Date(t.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Transaction Amount',
        data: transactions.map(t => t.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {accounts.map(account => (
              <div key={account.id} className="mb-2">
                <p>{account.account_name}</p>
                <p>Balance: ${account.balance.amount}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={chartData} />
            <ul>
              {transactions.map(txn => (
                <li key={txn.id}>
                  {txn.description} - ${txn.amount} ({txn.status})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}