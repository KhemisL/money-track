"use client";
import React, { useEffect } from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { createUser } from "@/app/actions";
const Navbarr = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      createUser(user?.primaryEmailAddress?.emailAddress);
    }
  }, [user]);
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href={"/budget"}>Mes budgets</Link>
            </li>
            <li>
              <Link href={"/dashboard"}>Tableaux de bord</Link>
            </li>
            <li>
              <Link href={"/transaction"}>Mes transactions</Link>
            </li>
          </ul>
        </div>
        <Link href={"/"} className=" text-xl font-bold">
          money<span className="text-accent">.Track</span>
        </Link>
      </div>
      <SignedIn>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href={"/budget"} className="btn btn-ghost">
                Mes budgets
              </Link>
            </li>
            <li>
              <Link href={"/dashboard"} className="btn btn-ghost">
                Tableaux de bord
              </Link>
            </li>
            <li>
              <Link href={"/transaction"} className="btn btn-ghost">
                Mes transactions
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="navbar-end">
          <Link href={"/sign-up"}>
            <button className="btn btn-accent">Découvrir</button>
          </Link>
        </div>
      </SignedOut>
    </div>
  );
};

export default Navbarr;
