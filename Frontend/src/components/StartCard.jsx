const StatCard = ({ icon, title, value, color = 'indigo' }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        indigo: 'bg-indigo-50 text-indigo-600',
    };

    return (
        <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className="text-3xl opacity-80">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;