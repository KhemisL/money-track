"use server"
import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma"
export const createUser = async (email:string | undefined) => {
    
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (!existingUser) {
            // const newUser = await prisma.user.create({
            //     data: {
            //         email: email as string,
            //         externalId: externalId as string
            //     }
            // })
            const newUser = await prisma.user.create({
                data: {
                    email: email as string,
                }
            })
            console.log("Nouvel utilisateur créer dans la base de données");
            return newUser;
        // } else if (!existingUser.externalId) {
        //     // Met à jour l'ID externe s'il n'est pas déjà défini
        //     const updatedUser = await prisma.user.update({
        //         where: { email },
        //         data: { externalId }
        //     });
        //     console.log("Utilisateur mis à jour avec externalId");
        //     return updatedUser;
        // } else {
            console.log("Utilisateur déjà présent dans la base de données");
            return existingUser;
        }

        
        
    } catch (error) {
        console.log("L'ERREUR TROUVÉE =>>>>>>>>>>>>>", error);
        
    }
}


export const addBudget = async (email:string, name: string, amount: number, selectedEmoji: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if (!user) {
            throw new Error("L'utilisateur n'a pas été trouvé")
        }

        await prisma.budget.create({
            data: {
                name: name,
                amount: amount,
                emoji: selectedEmoji,
                userId: user?.id
            }
        })
        console.log("Le budget à bien été ajouté à la base de données !");
        
    } catch (error) {
        console.log("L'ERREUR TROUVÉE LORS DE L'AJOUT DU BUDGET =>>>>>>>>>>>>>", error);
        
    }
}

export const getAllBudget = async (email: string | undefined) => {
    try {
        console.log("Appel de la fonction getAllBudget() pour l'utilisateur :", email);
        
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
              budgets: { // Inclut les budgets
                include: { // Inclut aussi les transactions de chaque budget
                  transactions: true,
                },
              },
            },
          });

        if (user) {
            console.log("Budgets récupérés :", user.budgets);
            // const transactionsInside = user.budgets.map((item) => (
            //     item.transactions.map((item) => (
            //         console.log("ICI ICI JE SUIS LA =============+>", item)
                    
            //     ))
            // ))
            return user.budgets
        } else {
            console.log("Aucun utilisateur trouvé avec cet externalId.");
            return [];
        }
    } catch (error) {
        console.log("Erreur lors de la récupération des budgets :", error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
};

export const getBudget = async (id : string) => {
    const budget = await prisma.budget.findUnique({
        where: {id}
    })

    return budget
}

export const deleteBudget = async (id: string) => {

    await prisma.budget.delete({
        where: { id }
    })
    revalidatePath("/")
}

export const updateBudget = async (id:string, name: string, amount: number, selectedEmoji: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {id}
        })

        if (!user) {
            throw new Error("L'utilisateur n'a pas été trouvé")
        }

        if (name !== null || amount !== null ) {
            await prisma.budget.update({
                where: {id},
                data: {
                    name: name,
                    amount: amount,
                    emoji: selectedEmoji,
                    userId: user?.id
                }
            })
            console.log("Le budget à bien été mis à jour dans la base de données !");
        }
        
        
        
    } catch (error) {
        console.log("L'ERREUR TROUVÉE LORS DE LA MISE A JOUR DU BUDGET =>>>>>>>>>>>>>", error);
        
    }
}




export const addTransaction = async (budgetId:string | undefined, description: string, amount: number) => {
    try {
        const budget = await prisma.budget.findUnique({
            where: {id: budgetId},
            include: { transactions: true }
        })

        if (!budget) {
            throw new Error("Le budget n'a pas été trouvé")
        }

        await prisma.transaction.create({
            data: {
                description,
                amount: amount,
                budgetId: budget?.id
            }
        })
        console.log("La transaction à bien été ajouté à la base de données !");
        
    } catch (error) {
        console.log("L'ERREUR TROUVÉE LORS DE L'AJOUT DE LA TRANSACTION =>>>>>>>>>>>>>", error);
        
    }
}

export const getAllTransaction = async (budgetId: string | undefined) => {
    try {
        console.log("Appel de la fonction getAllBudget() pour l'utilisateur :", budgetId);
        
        const budget = await prisma.budget.findUnique({
            where: { id: budgetId },
            include: { transactions: true } // Inclut les budgets de cet utilisateur
        });

        if (budget) {
            console.log("Transaction récupérés :", budget.transactions);
            return budget.transactions;
        } else {
            console.log("Aucune transaction trouvé avec cet Id.");
            return [];
        }
    } catch (error) {
        console.log("Erreur lors de la récupération des transactions :", error);
        return []; // Retourne un tableau vide en cas d'erreur
    }
};

export const getAllTransactionUser = async (email: string | undefined) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { budgets: true }, // Inclut les budgets de cet utilisateur
        });

        if (!user) {
            console.log("Aucun utilisateur trouvé avec cet email.");
            return { budgets: [], transactions: []};
        }

        const budgets = user.budgets;
        const allTransactions = [];

        for (const budget of budgets) {
            // Récupérer les transactions pour chaque budget avec les détails du budget
            const transactions = await prisma.transaction.findMany({
              where: { budgetId: budget.id },
              include: {
                budget: { // Récupère aussi les informations du budget pour chaque transaction
                  select: { name: true, id: true },
                },
              },
            });
      
            // Ajouter les transactions au tableau global
            for (const transaction of transactions) {
                allTransactions.push({
                  ...transaction,
                  budgetName: transaction.budget?.name || null, // Ajoute budgetName directement dans la transaction
                });
              }
          }

        console.log("Transactions récupérées =======> getAllTransactionUser() :", allTransactions);

        return {
            transactions: allTransactions,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return { budgets: [], transactions: [], totalBudget: 0, totalSpent: 0 };
    }
};

export const deleteTransaction = async (id: string) => {

    await prisma.transaction.delete({
        where: { id }
    })
    revalidatePath("/")
}