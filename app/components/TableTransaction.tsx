import React from "react";
import badgeIcon from "@/app/images/badge-icon.png";
import Country from "@/app/components/UserCountry";
import Image from "next/image";
import { deleteTransaction } from "../actions";
interface ITransaction {
  id: string;
  description: string;
  amount: number;
  budgetId: string | null;
  budgetName?: string | null
  createdAt: Date;
  
}
interface TransationTableProps {
  transaction: ITransaction;
  activeCol?: boolean;
}
const TableTransaction: React.FC<TransationTableProps> = ({ transaction, activeCol = false }) => {
  const handleDeleteTransaction = async () => {
    await deleteTransaction(transaction.id);
  };
  return (
    <tr key={transaction.id}>
      <th>
        <div className="avatar">
          <div className="mask p-1 mask-squirclep-2 h-12 w-12">
            <Image src={badgeIcon} alt="badge" />
          </div>
        </div>
      </th>
      <td>
        <div className="flex items-center gap-3">
          <div>
            <div className="font-bold badge badge-ghost badge-sm">
              -{transaction.amount}€
            </div>
            <div className="text-sm opacity-50">
              <Country />
            </div>
          </div>
        </div>
      </td>
      <td>{transaction.description}</td>
      <td>
        {new Intl.DateTimeFormat("fr-FR").format(
          new Date(transaction.createdAt)
        )}
      </td>
      <td>
        {new Date(transaction.createdAt).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
      <th>
        <button onClick={handleDeleteTransaction} className="btn btn-ghost btn-xs">Supprimer</button>
      </th>
      {activeCol && <th> <p className=" p-3 badge badge-accent text-white badge-sm"> {transaction.budgetName}</p></th> }
    </tr>
  );
};

export default TableTransaction;
