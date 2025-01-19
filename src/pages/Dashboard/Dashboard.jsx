import { Bell } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { useState, useEffect } from 'react';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="flex">
            <main className="flex-1 min-h-screen">
                <div className="p-4 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-2">Dashboard Overview</h1>
                            <p className="text-indigo-500 font-bold">
                                Welcome back{user?.displayName ? `, ${user.displayName}!` : '!' }
                            </p>
                        </div>
                        <button className="p-3 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors">
                            <Bell className="h-5 w-5 text-indigo-300" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
