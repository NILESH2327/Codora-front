import { useState, useEffect } from 'react';
import { Calendar, Sprout, MapPin, Clock, PlusCircle, X } from 'lucide-react';
import { getJSON, postJSON } from '../api';   // ensure postJSON exists
import { Link } from 'react-router-dom';

const CropCalendar = () => {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    dueDate: '',
    plotName: '',
    advice: '',
    isCompleted: false,
  });
  const [saving, setSaving] = useState(false);

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

  // Toggle event completion (optimistic update)
  const toggleEvent = async (eventId, current) => {
    try {
      const updated = !current;
      setCalendar(prev =>
        prev.map(event =>
          event.eventId === eventId ? { ...event, isCompleted: updated } : event
        )
      );
      await postJSON('/tasks/update', {
        eventId,
        isCompleted: updated,
      });
    } catch (err) {
      console.error("Toggle error", err);
      alert("Could not update task.");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Add new event to calendar
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.dueDate) {
      alert("Please fill the required fields: Title and Due Date.");
      return;
    }
    setSaving(true);
    try {
      // Assume backend creates event and returns it with eventId
      const savedEvent = await postJSON('/tasks/add', newEvent);
      // Optimistic UI update
      setCalendar(prev => [...prev, savedEvent]);
      setModalOpen(false);
      setNewEvent({
        title: '',
        dueDate: '',
        plotName: '',
        advice: '',
        isCompleted: false,
      });
    } catch (err) {
      console.error("Add event error:", err);
      alert("Failed to add event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-emerald-100 p-8 text-sm relative">

      {/* Header with Add Button */}
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
        <Link
            to={'/add-crop-event'}                
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl px-4 py-2 shadow-md transition"
          aria-label="Add New Event"
        >
          <PlusCircle className="w-5 h-5" />
          Add Event
        </Link>
      </div>

      {/* Loading State */}
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
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
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
                          <p className="text-xs text-gray-600 mt-1">{event.advice}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={event.isCompleted}
                          onChange={() =>
                            toggleEvent(event.eventId, event.isCompleted)
                          }
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

      {/* Modal Overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <form
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative"
            onSubmit={handleAddEvent}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close Add Event Modal"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 id="modal-title" className="text-xl font-semibold mb-6 text-emerald-700">
              Add New Crop Event
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g. Sow Tomato Seeds"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={newEvent.dueDate}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plot Name
                </label>
                <input
                  type="text"
                  name="plotName"
                  value={newEvent.plotName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Farm plot or field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Advice / Notes
                </label>
                <textarea
                  name="advice"
                  value={newEvent.advice}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  placeholder="Additional instructions or comments"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isCompleted"
                  id="isCompleted"
                  checked={newEvent.isCompleted}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-emerald-500 border-2 border-emerald-300 rounded"
                />
                <label htmlFor="isCompleted" className="text-sm text-gray-700">
                  Mark as completed
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 focus:outline-none disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add Event'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CropCalendar;
