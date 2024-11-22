"use client";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { getAllBudget, getAllTransactionUser } from "../actions";
import BudgetCard from "../components/BudgetCard";
import TableTransaction from "../components/TableTransaction";
interface IBudget {
  id: string;
  name: string;
  amount: number;
  userId: string;
  emoji: string | null;
  createdAt: Date;
}
interface ITransaction {
  id: string;
  description: string;
  amount: number;
  budgetName: string | null;
  budgetId: string | null;
  createdAt: Date;
}

const page = () => {
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0); // Total des montants des transactions
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const { user } = useUser();

  useEffect(() => {
    const fetchBudgets = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        const userBudgets = await getAllBudget(
          user?.primaryEmailAddress?.emailAddress
        );

        // const { totalBudget, totalSpent } = await getAllTransactionUser(
        //   user.primaryEmailAddress.emailAddress
        // );
        const response = await getAllTransactionUser(
          user?.primaryEmailAddress?.emailAddress
        );

        // Assurer que l'objet renvoyé par getAllTransactionUser contient une clé 'transactions'
        if (response && Array.isArray(response.transactions)) {
          setTransactions(response.transactions); // Passer uniquement les transactions au state
        }

        if (userBudgets) {
          setBudgets(userBudgets);
        } else {
          console.log("Aucun budget trouvé pour cet utilisateur.");
        }
      }
    };

    fetchBudgets();
  }, [user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    const totalAmount = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    const totalTransactions = transactions.length;

    setTotalAmount(totalAmount); // Total des montants
    setTotalTransactions(totalTransactions); // Nombre total de transactions
  }, [transactions]);
  return (
    <Wrapper>
      <div className="flex flex-col gap-6">
  {/* Conteneur principal centré et limité */}
  <div className="max-w-[1200px] mx-auto w-full px-4">
    {/* Section des cartes principales */}
    <div className="grid grid-cols-6 grid-rows-5 gap-4">
      <div className="col-span-2 row-span-1">
        <div className="card bg-base-100 shadow-xl p-5 flex justify-center h-full">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-lg text-gray-500 mb-2">Total des transactions</h3>
              <p className="text-accent font-bold text-xl">{totalAmount}€</p>
            </div>
            <div>
              <div className="rounded-full bg-accent flex items-center justify-center w-12 h-12">
                <p className="text-3xl">💸</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2 col-start-3 row-span-1">
        <div className="card bg-base-100 shadow-xl p-5 flex justify-center h-full">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-lg text-gray-500 mb-2">Nombre de transactions</h3>
              <p className="text-accent font-bold text-xl">{totalTransactions}</p>
            </div>
            <div>
              <div className="rounded-full bg-accent flex items-center justify-center w-12 h-12">
                <p className="text-3xl">💸</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2 col-start-5 row-span-1">
        <div className="card bg-base-100 shadow-xl p-5 flex justify-center h-full">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-lg text-gray-500 mb-2">Budgets Atteints</h3>
              <p className="text-accent font-bold text-xl">1/6</p>
            </div>
            <div>
              <div className="rounded-full bg-accent flex items-center justify-center w-12 h-12">
                <p className="text-3xl">💸</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section budgets et tableau */}
      <div className="col-span-2 row-span-4 col-start-1 row-start-2">
        {/* Liste des budgets récents */}
        <div className="flex flex-col gap-6">
          {budgets
            ?.slice(-3) // Garde les 3 derniers budgets
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((item) => (
              <BudgetCard key={item.id} budget={item} detail={true} />
            ))}
        </div>
      </div>

      {/* Tableau des transactions */}
      <div className="col-span-4 row-span-4 col-start-3 row-start-2">
        <div className="card bg-base-100 shadow-xl p-5 h-full">
          <div className="overflow-x-auto">
            <table className="table w-full">
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
                {transactions
                  ?.slice(-5) // Garde les 5 dernières transactions
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                  .map((item) => (
                    <TableTransaction
                      key={item.id}
                      transaction={item}
                      activeCol={true}
                    />
                  ))}
              </tbody>
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
      </div>
    </div>
  </div>
</div>

    </Wrapper>
  );
};

export default page;
