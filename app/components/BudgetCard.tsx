import Link from "next/link";
import React from "react";
interface ITransaction {
  id: string;
  description: string;
  amount: number;
  budgetId: string | null;
  emoji: string | null;
  createdAt: Date;
}
interface IBudget {
  id: string;
  name: string;
  amount: number;
  userId: string;
  emoji: string | null;
  createdAt: Date;
  transactions?: ITransaction[];
}

interface BudgetCardProps {
  budget: IBudget;
  detail: boolean;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, detail }) => {
  const totalSpent =
    budget.transactions?.reduce((acc, t) => acc + t.amount, 0) || 0;
  const remainingAmount = budget.amount - totalSpent;
  const progressBarWidth = Math.min((totalSpent / budget.amount) * 100, 100);
  return (
    <>
      {detail ? (
        <Link
          href={`budget/info/${budget.id}`}
          key={budget.id}
          className="card bg-base-100 w-96 shadow-xl hover:scale-105 transition duration-150 ease-out cursor-pointer p-5"
        >
          <div className="flex justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gray-100 flex items-center justify-center w-9 h-9">
                {budget.emoji ? budget.emoji : "💸"}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-xl capitalize">{budget.name}</h3>
                <p>{budget.transactions?.length || "0"} transaction(s)</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-accent">{budget.amount}€</h4>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p>{totalSpent}€ dépensés</p>
            {remainingAmount <= 0 ? (
              <p className="font-bold text-red-500">
                {remainingAmount}€ restants
              </p>
            ) : (
              <p>{remainingAmount}€ restants</p>
            )}
          </div>
          <div className="bg-gray-100 rounded-md h-2 w-full relative">
            <div
              className="relative left-0 bg-accent rounded-md h-2"
              style={{ width: `${progressBarWidth}%` }}
            ></div>
          </div>
        </Link>
      ) : (
        <div key={budget.id} className="card bg-base-100 w-96 shadow-xl p-5">
          <div className="flex justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gray-100 flex items-center justify-center w-9 h-9">
                {budget.emoji ? budget.emoji : "💸"}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-xl capitalize">{budget.name}</h3>
                <p>2 transaction(s)</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-accent">{budget.amount}€</h4>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p>80€ dépensés</p>
            <p>420€ restants</p>
          </div>
          <div className="bg-gray-100 rounded-md h-2 w-full relative">
            <div
              className="relative left-0 bg-accent rounded-md h-2"
            ></div>
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetCard;
