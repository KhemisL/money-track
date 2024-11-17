"use client";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import { addBudget, getAllBudget, getAllTransactionUser } from "../actions";
import Toast from "../components/Toast";
import BudgetCard from "../components/BudgetCard";


interface IBudget {
  id: string;
  name: string;
  amount: number;
  userId: string;
  emoji: string | null;
  createdAt: Date;          // Total dépensé (optionnel)
}
const page = () => {
  const { user } = useUser();
  const [budgetName, setBudgetName] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [budgetEmoji, setBudgetEmoji] = useState<string>("");
  const [toast, SetToast] = useState<string>("");
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);


  const closeNotification = () => {
    SetToast("");
  };
  const [budgets, setBudgets] = useState<IBudget[]>([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        const userBudgets = await getAllBudget(
          user?.primaryEmailAddress?.emailAddress
        );

      
        const { totalBudget, totalSpent } = await getAllTransactionUser(
          user.primaryEmailAddress.emailAddress
        );
        if (userBudgets) {
          setBudgets(userBudgets);
        } else {
          console.log("Aucun budget trouvé pour cet utilisateur.");
        }
      }
    };

    fetchBudgets();
  }, [user?.primaryEmailAddress?.emailAddress]);

  const handleEmojiSelect = (emojiObject: { emoji: string }) => {
    setBudgetEmoji(emojiObject.emoji);
    setShowEmoji(false);
  };

  const handleAddBudget = async () => {
    try {
      const amount = parseFloat(budgetAmount);

      if (amount <= 0 || isNaN(amount)) {
        throw new Error("Le montant doit être supérieur à 0");
      }

      await addBudget(
        user?.primaryEmailAddress?.emailAddress as string,
        budgetName,
        amount,
        budgetEmoji
      );

      const updatedBudgets = await getAllBudget(
        user?.primaryEmailAddress?.emailAddress
      );
      setBudgets(updatedBudgets);
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;

      if (modal) {
        modal.close();
      }
      
      SetToast("Nouveaux budget créer avec succé");
    } catch (error) {
      console.log(error);
      SetToast("Erreur lors de la création du budget");
    }
  };

  return (
    <Wrapper>
      {toast && <Toast message={toast} onClose={closeNotification} />}
      <dialog id="my_modal_3" className="modal sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Creéation d'un budget!</h3>
          <p className="py-4">Permet de controler vos dépenses</p>
          <div className="w-full flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nom de votre budget"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              required
              className="input input-bordered w-full max-w-md"
            />
            <input
              type="number"
              placeholder="Définir un montant"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              required
              className="input input-bordered w-full max-w-md"
            />
            <button onClick={() => setShowEmoji(true)} className="btn">
              {budgetEmoji || "Ajouter un emoji"}
            </button>
            {showEmoji && (
              <EmojiPicker width="100%" onEmojiClick={handleEmojiSelect} />
            )}

            <button onClick={handleAddBudget} className="btn">
              Ajouter le budget
            </button>
          </div>
        </div>
      </dialog>
      <div className="flex items-center justify-center mt-20">
        <div className="flex flex-col w-8/12">
          <div className="flex flex-col items-start">
            <h2 className="text-4xl font-bold">Gérer votre budget</h2>
            <p className="text-muted-foreground mb-5">Lorem ipsum, dolor sit amet consectetur adipisicing.</p>
            <button
              className="btn mb-20"
              onClick={() =>
                (
                  document.getElementById("my_modal_3") as HTMLDialogElement
                ).showModal()
              }
            >
              Ajouter un budget
            </button>
          </div>

          <div className="w-full flex justify-between gap-5 flex-wrap">
            {budgets?.map((item) => (
              <BudgetCard key={item.id} budget={item} detail={true}/>
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
