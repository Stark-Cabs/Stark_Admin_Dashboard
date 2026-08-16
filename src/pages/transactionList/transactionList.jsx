import React, { useContext, useEffect, useMemo } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";
import { TransactionContext } from "../../context/transactionContext/TransactionContext";
import { getTransactions } from "../../context/transactionContext/apiCalls";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import './transactionList.css'
import useTransactionStats from "../../hooks/stats/transaction/getTransactionStats";
import Chart from "../../components/chart/Chart";

export default function TransactionList() {
    const { transactions, dispatch } = useContext(TransactionContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const { transactionStats } = useTransactionStats();


    useEffect(() => {
        getTransactions(dispatch, toast);
    }, [dispatch]);

    const columns = useMemo(
        () => [
            { Header: "Payment ID", accessor: "paymentId" },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => (
                    <span className={`txnStatus txnStatus--${value?.toLowerCase()}`}>
                        {value}
                    </span>
                ),
            },
            {
                Header: "Gross Amount",
                accessor: "grossAmount",
                Cell: ({ value }) => <span className="amountCell">₹{value}</span>,
            },
            {
                Header: "Net Amount",
                accessor: "netAmount",
                Cell: ({ value }) => <span className="amountCell amountCell--net">₹{value}</span>,
            },
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
            {
                Header: "Driver",
                accessor: "driverId.name",
                Cell: ({ row }) => (
                    <div className="driverCell">
                        <span className="driverCellName">{row.original.driverId?.name || "N/A"}</span>
                        <span className="driverCellSub">{row.original.driverId?.email || "N/A"}</span>
                    </div>
                ),
            },
            { Header: "Phone", accessor: "driverId.phone_number" },
        ],
        []
    );

    const handleEditClick = (transaction) => {
        navigate(`/driver/${transaction.driverId._id}`, { state: { driverId: transaction.driverId._id } });
    };

    return (
        <div className="transactionList">
            <Chart data={transactionStats} title="Transaction Analytics" grid dataKey="New Transactions" accent="green" />

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
    );
}