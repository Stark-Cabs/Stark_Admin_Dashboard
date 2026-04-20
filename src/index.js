import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext/AuthContext';
import { UserContextProvider } from './context/userContext/UserContext';
import { DriverContextProvider } from './context/driverContext/DriverContext';
import { AdminContextProvider } from './context/adminContext/AdminContext';
import { ToastContainer } from 'react-toastify';
import { TransactionContextProvider } from './context/transactionContext/TransactionContext';
import { RidesContextProvider } from './context/rideContext/RideContext';
import { FaresContextProvider } from './context/fareContext/FareContext';
import { ComplaintContextProvider } from './context/complaintContext/ComplaintContext';
import { PackagesContextProvider } from './context/packagesContext/PackagesContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer position="top-right" autoClose={3000} />
    <PackagesContextProvider>
      <ComplaintContextProvider>
        <FaresContextProvider>
          <RidesContextProvider>
            <TransactionContextProvider>
              <AdminContextProvider>
                <DriverContextProvider>
                  <UserContextProvider>
                    <AuthContextProvider>
                      <App />
                    </AuthContextProvider>
                  </UserContextProvider>
                </DriverContextProvider>
              </AdminContextProvider>
            </TransactionContextProvider>
          </RidesContextProvider>
        </FaresContextProvider>
      </ComplaintContextProvider>
    </PackagesContextProvider>

  </React.StrictMode>
);
