export interface ExpenseRecord {
  id: number;
  title: string;
  category: string;
  amount: number;
  sellingPrice:number;
  description: string;
  spentOn: string; // "YYYY-MM-DD"
}

export const ExpenseCategory = {
  Food: "Food",
  Travel: "Travel",
  Furniture: "Furniture",
  Utilities: "Utilities",
  Apparel:"Apparels",
  Other: "Other",
} as const;

export type ExpenseCategory = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];