"use client";

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
  budgetId: string | null;
  createdAt: Date;
}

interface IClientProps {
  budget: IBudget | null;
}


interface IClientProps {
  budget: IBudget | null;
  totalSpent: number;
  transactions: ITransaction[];
}

const BudgetPageUpdateClient = ({ budget, totalSpent, transactions }: IClientProps) => {
  if (!budget) {
    return <div>Budget introuvable</div>;
  }

  const remainingAmount = budget.amount - totalSpent;
  const progressBarWidth = totalSpent > budget.amount ? 100 : (totalSpent / budget.amount) * 100;

  return (
    <div className="card bg-base-100 w-96 shadow-xl p-5">
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-gray-100 flex items-center justify-center w-9 h-9">
            {budget.emoji ? budget.emoji : "💸"}
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-xl capitalize">{budget.name}</h3>
            <p>{transactions.length} transaction(s)</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-accent">{budget.amount}€</h4>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <p>{totalSpent}€ dépensés</p>
        {remainingAmount <= 0 ? <p className="font-bold text-red-500">{remainingAmount}€ restants</p> : <p>{remainingAmount}€ restants</p> }
        {/* <p>{remainingAmount}€ restants</p> */}
      </div>
      <div className="bg-gray-100 rounded-md h-2 w-full relative">
        <div
          className="relative left-0 bg-accent rounded-md h-2"
          style={{
            width: `${progressBarWidth}%`, // Limité à 100% si totalSpent dépasse le budget
          }}
        ></div>
      </div> 
    </div>
  );
};

export default BudgetPageUpdateClient;
