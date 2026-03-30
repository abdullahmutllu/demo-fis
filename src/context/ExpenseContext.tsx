import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Expense } from '../types/expense';
import {
  initStoreIfEmpty,
  loadExpenses,
  resetToSeed,
  saveExpenses,
} from '../lib/expenseStore';

type ExpenseContextValue = {
  expenses: Expense[];
  setExpenses: (next: Expense[]) => void;
  addExpense: (e: Expense) => void;
  updateExpense: (id: string, patch: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  reloadFromStorage: () => void;
  resetDemoData: () => void;
};

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpensesState] = useState<Expense[]>(() =>
    initStoreIfEmpty(),
  );

  const setExpenses = useCallback((next: Expense[]) => {
    saveExpenses(next);
    setExpensesState(next);
  }, []);

  const addExpense = useCallback((e: Expense) => {
    setExpensesState((prev) => {
      const next = [e, ...prev];
      saveExpenses(next);
      return next;
    });
  }, []);

  const updateExpense = useCallback((id: string, patch: Partial<Expense>) => {
    setExpensesState((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, ...patch } : x));
      saveExpenses(next);
      return next;
    });
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpensesState((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveExpenses(next);
      return next;
    });
  }, []);

  const reloadFromStorage = useCallback(() => {
    setExpensesState(loadExpenses());
  }, []);

  const resetDemoData = useCallback(() => {
    const list = resetToSeed();
    setExpensesState(list);
  }, []);

  const value = useMemo(
    () => ({
      expenses,
      setExpenses,
      addExpense,
      updateExpense,
      removeExpense,
      reloadFromStorage,
      resetDemoData,
    }),
    [
      expenses,
      setExpenses,
      addExpense,
      updateExpense,
      removeExpense,
      reloadFromStorage,
      resetDemoData,
    ],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) {
    throw new Error('useExpenses ExpenseProvider içinde kullanılmalıdır.');
  }
  return ctx;
}
