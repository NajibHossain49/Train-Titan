import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const BalanceDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [userError, setUserError] = useState(null);

    useEffect(() => {
        // Fetch payments
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/all-payments`);
                const data = Array.isArray(response.data) ? response.data : [];
                setPayments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Fetch users
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
                const data = response.data.success ? response.data.users : [];
                setUsers(data);
            } catch (err) {
                setUserError(err.message);
            }
        };

        fetchPayments();
        fetchUsers();
    }, []);

    // Calculate total balance
    const totalBalance = payments.reduce((sum, payment) => sum + (payment.price || 0), 0);

    // Get last 6 transactions
    const recentTransactions = payments.slice(0, 6);

    // Calculate total newsletter subscribers and total paid members
    const totalSubscribers = users.length;
    const totalPaidMembers = payments.length;

    // Chart data for subscribers vs paid members
    const chartData = {
        labels: ["Newsletter Subscribers", "Paid Members"],
        datasets: [
            {
                label: "Users",
                data: [totalSubscribers, totalPaidMembers],
                backgroundColor: ["#4caf50", "#2196f3"],
                hoverBackgroundColor: ["#388e3c", "#1976d2"],
            },
        ],
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (error || userError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg text-red-500">Error: {error || userError}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Total Balance Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Total Balance</h2>
                </div>
                <div>
                    <p className="text-4xl font-bold text-blue-600">
                        ${totalBalance.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Recent Transactions Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                                    Date
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                                    Trainer
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                                    Package
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                                    User
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                                    User Email
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                                    Paid At
                                </th>
                                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((transaction) => (
                                <tr
                                    key={transaction._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {format(new Date(transaction.paidAt), "MMM dd, yyyy")}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {transaction.trainerName}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                            {transaction.packageName}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {transaction.userName}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {transaction.userEmail}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {format(new Date(transaction.paidAt), "hh:mm a, MMM dd, yyyy")}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700 text-right font-medium">
                                        ${transaction.price}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Chart for Subscribers vs Paid Members */}

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Subscribers vs Paid Members
                </h2>
                <div className="flex justify-center items-center">
                    <Pie
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: "bottom",
                                    labels: {
                                        boxWidth: 15,
                                        font: {
                                            size: 12,
                                        },
                                    },
                                },
                            },
                        }}
                        width={250}
                        height={250}
                    />
                </div>
            </div>

        </div>
    );
};

export default BalanceDashboard;
