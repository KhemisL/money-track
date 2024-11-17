import Image from "next/image";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import Navbarr from "./components/Navbarr";
import { dataBudgets } from "@/lib/dataBudget";
import BudgetCard from "./components/BudgetCard";

interface ITransaction {
  id: string;
  description: string;
  amount: number;
  budgetId: string | null;
  createdAt: Date;
}

export default function Home() {
  return (
    <>
      <Navbarr />
      <div className="flex items-center justyfy-center flex-col py-10 w-full">
        <div>
          <div className="flex flex-col mt-10">
            <h1 className="font-bold text-center text-5xl">
              Prenez le contrôle <br /> de vos finances
            </h1>
            <p className="py-5 text-center max-w-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
              ipsa tempora tenetur commodi architecto veniam.
            </p>
            <div className="flex justify-center gap-5">
              <Link href={"/sign-in"}>
                <button className="btn btn-sm md:btn-md btn-outline btn-accent">
                  Se connecter
                </button>
              </Link>
              <Link href={"/budget"}>
                <button className="btn btn-sm md:btn-md btn-accent text-white">
                  Découvrir
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-8/12 mt-20">
        <div className="w-full flex justify-center gap-5 flex-wrap">
          {dataBudgets?.map((item) => (
            <BudgetCard key={item.id} budget={item} detail={false} />
          ))}
        </div>
        </div>
        
      </div>
    </>
  );
}
