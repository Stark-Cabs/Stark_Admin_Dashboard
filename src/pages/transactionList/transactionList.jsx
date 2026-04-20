import React, { useContext, useEffect, useMemo } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";
import { TransactionContext } from "../../context/transactionContext/TransactionContext";
import { getTransactions } from "../../context/transactionContext/apiCalls";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import './transactionList.css'
export default function TransactionList() {
    const { transactions, dispatch } = useContext(TransactionContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        getTransactions(dispatch, toast);
        console.log('transactions', transactions)
    }, [dispatch]);

    const columns = useMemo(
        () => [
            { Header: "Payment ID", accessor: "paymentId", },
            { Header: "Status", accessor: "status" },
            { Header: "Gross Amount", accessor: "grossAmount" },
            { Header: "Net Amount", accessor: "netAmount" },
            {
                Header: "Action On",
                accessor: "actionOn",
                Cell: ({ value }) => {
                    if (!value) return "N/A";
                    const date = new Date(value);
                    return date.toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                },
            },
            { Header: "Driver Name", accessor: "driverId.name" },
            { Header: "Email", accessor: "driverId.email" },
            { Header: "Phone", accessor: "driverId.phone_number" },
        ],
        []
    );

    const handleEditClick = (transaction) => {
        navigate(`/driver/${transaction.driverId._id}`, { state: { driverId: transaction.driverId._id } });
    };

    return (
        <div className="container">

            <div style={{flex:4}}>

                <FeaturedInfo number={6} />
                <DataTable
                    title="Transactions"
                    data={transactions || []}
                    columns={columns}
                    buttonName={'View'}
                    onButtonClick={handleEditClick}
                    searchPlaceholder="Search by name, email, or phone..."
                    showFilter={true}
                    filterOptions={["success", "pending", "failed"]}
                    filterKey="status"
                />
            </div>
        </div>
    );
}
