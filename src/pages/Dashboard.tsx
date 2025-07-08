import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import type { RootState } from '@/store';
import { gql } from 'graphql-request';
import { gqlClient } from '@/lib/graphql';

type Transaction = {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  reference: string;
  description: string;
  created_at: string;
};

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.user.user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const GET_TRANSACTIONS = gql`
    query GetMyTransactions {
      transactions(order_by: { created_at: desc }) {
        id
        type
        amount
        reference
        description
        created_at
      }
    }
  `;

  useEffect(() => {
    const fetchTx = async () => {
      const { transactions } = await gqlClient.request<{ transactions: Transaction[] }>(GET_TRANSACTIONS);
      setTransactions(transactions);
    };
    fetchTx();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.full_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold text-green-600">
            ₦{user?.balance?.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Current Account Balance</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <Card key={tx.id}>
              <CardContent className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Ref: {tx.reference} • {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </p>
                  <Badge variant="outline">{tx.type}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
