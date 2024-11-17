"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs';
import { getAllTransactionUser } from '../actions';
import TableTransaction from '../components/TableTransaction';


interface ITransaction {
  id: string;
  description: string;
  amount: number;
  budgetName: string | null;
  budgetId: string | null;
  createdAt: Date;
}
const page = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  useEffect(() => {
    const fetchTransaction = async () => {
      const response = await getAllTransactionUser(user?.primaryEmailAddress?.emailAddress);
      
      // Assurer que l'objet renvoyé par getAllTransactionUser contient une clé 'transactions'
      if (response && Array.isArray(response.transactions)) {
        setTransactions(response.transactions); // Passer uniquement les transactions au state
      }
    }

    fetchTransaction()
  },[user?.primaryEmailAddress?.emailAddress])
  return (
    <Wrapper>
      <div className='flex justify-center mt-10'>
      <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Montant</th>
                <th>Description</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((item) => (
                <TableTransaction key={item.id} transaction={item} activeCol={true} />
              ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>#</th>
                <th>Montant</th>
                <th>Description</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Actions</th>
              </tr>
            </tfoot>
          </table>
      </div>
      </div>
    </Wrapper>
  )
}

export default page