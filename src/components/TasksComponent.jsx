import { useState, useEffect } from 'react';
import { Calendar, Sprout, MapPin, Clock } from 'lucide-react';
import { getJSON, postJSON } from '../api';   // ensure postJSON exists

const CropCalendar = () => {
    const [calendar, setCalendar] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await getJSON('/tasks/today');
            setCalendar(res.tasks);
            setLoading(false);
        } catch (err) {
            console.error("Calendar error:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusColor = (dueDate) => {
        const daysDiff = Math.ceil(
            (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff < 0) return 'text-red-500 bg-red-50';
        if (daysDiff <= 3) return 'text-yellow-500 bg-yellow-50';
        return 'text-green-500 bg-green-50';
    };

    const groupedEvents = calendar.reduce((acc, event) => {
        const dateKey = new Date(event.dueDate).toISOString().split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
    }, {});

    // ---------- 🔥 TOGGLE EVENT STATUS ----------
    const toggleEvent = async (eventId, current) => {
        try {
            const updated = !current;

            // 1️⃣ Update UI instantly (optimistic UI)
            setCalendar(prev =>
                prev.map(event =>
                    event.eventId === eventId
                        ? { ...event, isCompleted: updated }
                        : event
                )
            );

            // 2️⃣ Call backend API
            await postJSON('/tasks/update', {
                eventId,
                isCompleted: updated
            });

        } catch (err) {
            console.error("Toggle error", err);
            alert("Could not update task.");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-xl border border-emerald-100 p-8 text-sm">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500 rounded-2xl shadow">
                        <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-emerald-800">Crop Calendar</h2>
                        <p className="text-emerald-600 text-sm">Complete farm schedule</p>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
                </div>
            ) : calendar.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <Sprout className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No events scheduled</p>
                </div>
            ) : (
                <div className="space-y-5 max-h-96 overflow-y-auto">
                    {Object.entries(groupedEvents).map(([date, events]) => {
                        const eventDate = new Date(date);
                        const daysDiff = Math.ceil((eventDate - new Date()) / 86400000);

                        return (
                            <div key={date}>
                                
                                {/* Date Header */}
                                <div
                                    className={`flex items-center gap-3 mb-3 p-3 rounded-xl border-l-4 ${getStatusColor(events[0].dueDate)}`}
                                >
                                    <MapPin className="w-5 h-5" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">
                                            {eventDate.toLocaleDateString('en-IN', {
                                                weekday: 'short', day: 'numeric', month: 'short'
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {daysDiff === 0
                                                ? "Today"
                                                : daysDiff === 1
                                                ? "Tomorrow"
                                                : daysDiff > 0
                                                ? `in ${daysDiff} days`
                                                : `${Math.abs(daysDiff)} days ago`}
                                        </p>
                                    </div>
                                    <Clock className="w-4 h-4 text-gray-400" />
                                </div>

                                {/* Events */}
                                <div className="space-y-3 pl-4 border-l-4 border-emerald-200 border-dashed">
                                    {events.map((event) => (
                                        <div
                                            key={event.eventId}
                                            className={`p-3 rounded-xl border ${
                                                event.isCompleted
                                                    ? 'border-green-200 bg-green-50'
                                                    : 'border-gray-200 bg-white'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm">{event.title}</h4>

                                                    {event.plotName && (
                                                        <p className="text-xs text-emerald-700 font-medium mt-1">
                                                            Plot: {event.plotName}
                                                        </p>
                                                    )}

                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {event.advice}
                                                    </p>
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    checked={event.isCompleted}
                                                    onChange={() => toggleEvent(event.eventId, event.isCompleted)}
                                                    className="h-5 w-5 text-emerald-500 border-2 border-emerald-300 rounded"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CropCalendar;
