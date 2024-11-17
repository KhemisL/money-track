"use client";
import React, { useEffect, useState } from "react";
import {
  addTransaction,
  deleteBudget,
  getAllTransaction,
  getBudget,
} from "@/app/actions"; // Assurez-vous que cette fonction est bien définie
import BudgetPageUpdateClient from "@/app/components/BudgetPageUpdateClient";
import { useRouter } from "next/navigation";
import Wrapper from "@/app/components/Wrapper";
import Image from "next/image";
import badgeIcon from "@/app/images/badge-icon.png";
import Country from "@/app/components/UserCountry";
import TableTransaction from "@/app/components/TableTransaction";
interface IParams {
  params: { id: string };
}
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
  // transactions: ITransaction[]
}



const Page = ({ params }: IParams) => {
  const [budget, setBudget] = useState<IBudget | null>(null);
  const router = useRouter();

  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [transactionDescription, settransactionDescription] = useState<
    string | undefined
  >("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionAmount, settransactionAmount] = useState<
    string | undefined
  >("");
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const unwrappedParams = await params;
        const budgetData = await getBudget(unwrappedParams.id);

        if (budgetData) {
          setBudget(budgetData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du budget:", error);
      }
    };

    const fetchAllTransaction = async () => {
      const unwrappedParams = await params;
      const updatedTransaction = await getAllTransaction(unwrappedParams.id);
      setTransactions(updatedTransaction);
    };

    fetchBudget();
    fetchAllTransaction();
  }, [params]);

  // Si aucun budget n'est trouvé
  if (!budget) {
    return <div>Budget introuvable</div>;
  }

  const hadleDeleteBudget = async () => {
    try {
      const unwrappedParams = await params;
      await deleteBudget(unwrappedParams.id);

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;

      if (modal) {
        modal.close();
      }
      router.push("/budget");
      // SetToast("Nouveaux budget créer avec succé");
    } catch (error) {
      console.log(error);
      // SetToast("Erreur lors de la création du budget");
    }
  };

  const handleAddTransaction = async () => {
    setIsLoading(true);
    try {
      const unwrappedParams = await params;

      // Vérifiez que transactionAmount est défini et convertissez-le en nombre
      const amount = transactionAmount ? parseFloat(transactionAmount) : NaN;

      if (amount <= 0 || isNaN(amount)) {
        throw new Error("Le montant doit être supérieur à 0");
      }

      // Vérifiez que transactionDescription est défini
      if (!transactionDescription) {
        throw new Error(
          "La description de la transaction ne peut pas être vide"
        );
      }

      await addTransaction(unwrappedParams.id, transactionDescription, amount);

      const updatedTransaction = await getAllTransaction(unwrappedParams.id);
      setTransactions(updatedTransaction);
    } catch (error) {
      console.log("Erreur lors de l'ajout de la transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const totalSpent = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  return (
    <Wrapper>
      <div className="flex w-full justify-center h-screen gap-20 mt-10">
        <dialog id="my_modal_3" className="modal sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Etes vous sur de vouloir supprimer le budget ?
            </h3>
            <p className="pb-8 pt-2">
              La suppéssion du budget sera irréversible
            </p>
            <div className="w-full flex justify-between gap-4">
              <form method="dialog">
                <button className="btn">
                  Annuler
                </button>
              </form>

              <button onClick={hadleDeleteBudget} className="btn bg-red-500 text-white hover:bg-red-600">
              {isLoading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Supprimer le budget"
              )}
              </button>
            </div>
          </div>
        </dialog>
        <div className="flex flex-col items-start gap-5">
          <BudgetPageUpdateClient
            budget={budget}
            totalSpent={totalSpent}
            transactions={transactions}
          />
          <button
            className="btn mb-10"
            onClick={() =>
              (
                document.getElementById("my_modal_3") as HTMLDialogElement
              ).showModal()
            }
          >
            Supprimer le budget
          </button>
          <div>
            <h3 className="font-bold text-2xl mb-2">Ajouté une transaction !</h3>
            <p className="">Permet de controler vos dépenses</p>
          </div>
          <div className="w-full flex flex-col gap-4 items-start">
            <input
              type="text"
              placeholder="Décrivez votre transaction"
              value={transactionDescription}
              onChange={(e) => settransactionDescription(e.target.value)}
              required
              className="input input-bordered w-full max-w-md"
            />
            <input
              type="number"
              placeholder="Définir un montant"
              value={transactionAmount}
              onChange={(e) => settransactionAmount(e.target.value)}
              required
              className="input input-bordered w-full max-w-md"
            />
            <button onClick={handleAddTransaction} className="btn">
              {isLoading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Ajouter une transaction"
              )}
            </button>
          </div>
        </div>
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
                <TableTransaction key={item.id} transaction={item} />
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
  );
};

export default Page;
