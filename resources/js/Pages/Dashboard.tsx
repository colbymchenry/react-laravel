import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-lg">Welcome, {user?.email}</p>
                </div>
            </div>
        </div>
    );
} 