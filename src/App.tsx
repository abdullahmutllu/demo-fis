import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReceiptAdd from './pages/ReceiptAdd';
import ExpenseList from './pages/ExpenseList';
import ManualExpense from './pages/ManualExpense';
import Analytics from './pages/Analytics';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'fis-ekle', element: <ReceiptAdd /> },
        { path: 'giderler', element: <ExpenseList /> },
        { path: 'manuel-gider', element: <ManualExpense /> },
        { path: 'analiz', element: <Analytics /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export default function App() {
  return (
    <ToastProvider>
      <ExpenseProvider>
        <RouterProvider router={router} />
      </ExpenseProvider>
    </ToastProvider>
  );
}
