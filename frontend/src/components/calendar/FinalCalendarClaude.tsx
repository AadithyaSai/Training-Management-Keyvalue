import { useEffect, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import dayjs from "dayjs";
import { useGetSessionListQuery, useUpdateSessionMutation } from "../../api-service/session/session.api";

const parseDuration = (durationStr) => {
    const match = durationStr.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
};

const calculateSessionTimes = (sessions, date) => {
    const startTime = dayjs(date).hour(9).minute(0).second(0); // Start at 9 AM
    let currentTime = startTime;
    
    return sessions.map((session) => {
        const duration = parseDuration(session.duration);
        const sessionStartTime = currentTime;
        const sessionEndTime = currentTime.add(duration, 'hour');
        
        currentTime = sessionEndTime; // Next session starts where this one ends
        
        return {
            ...session,
            calculatedStartTime: sessionStartTime,
            calculatedEndTime: sessionEndTime,
        };
    });
};

const DraggableSession = ({
    session,
    fromCalendar,
    onRemove,
    dateKey,
    index,
    className,
}: {
    session: any;
    fromCalendar?: boolean;
    onRemove?: () => void;
    dateKey?: string;
    index?: number;
    className?: string;
}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "SESSION",
        item: { ...session, fromCalendar, calendarIndex: index, dateKey },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const displayTime = fromCalendar && session.calculatedStartTime && session.calculatedEndTime 
        ? `${session.calculatedStartTime.format('HH:mm')} - ${session.calculatedEndTime.format('HH:mm')}`
        : session.duration;

    return (
        <div
            ref={drag}
            className={`${session.color || 'bg-blue-500'} text-white px-2 py-1 rounded mb-2 cursor-move shadow overflow-hidden ${className}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="font-medium text-sm">{session.title}</div>
            <div className="text-xs opacity-90">{displayTime}</div>
        </div>
    );
};

const DroppableDate = ({ date, onDrop, items, onItemRemove, onItemReorder }: any) => {
    const [, drop] = useDrop(() => ({
        accept: "SESSION",
        drop: (item: any) => {
            onDrop(date, item);
        },
    }));

    const isToday = date.isSame(dayjs(), "day");
    const isCurrentMonth = date.month() === date.startOf("month").month();
    
    // Calculate sessions with times for display
    const sessionsWithTimes = calculateSessionTimes(items, date);
    const totalDuration = items.reduce((sum, s) => sum + parseDuration(s.duration), 0);

    return (
        <div
            ref={drop}
            className={`border border-borderColor ${
                isToday ? "bg-itemColor" : "bg-cardColor"
            } h-40 p-2 rounded overflow-auto`}
        >
            <div className="flex justify-between items-center mb-1">
                <div
                    className={`text-md ${
                        isCurrentMonth ? "text-white" : "text-green-500"
                    }`}
                >
                    {date.date()}
                </div>
                <div className="text-xs text-gray-400">
                    {totalDuration.toFixed(1)}h/8h
                </div>
            </div>
            
            {sessionsWithTimes.map((item: any, idx: number) => (
                <DraggableSession
                    key={`${item.id}-${idx}`}
                    session={item}
                    fromCalendar={true}
                    dateKey={date.format("YYYY-MM-DD")}
                    index={idx}
                    onRemove={() => {
                        onItemRemove(date.format("YYYY-MM-DD"), idx);
                    }}
                    className="max-h-12 text-xs"
                />
            ))}
        </div>
    );
};

const DroppablePool = ({
    onDrop,
    children,
}: {
    onDrop: (item: any) => void;
    children: React.ReactNode;
}) => {
    const [, drop] = useDrop(() => ({
        accept: "SESSION",
        drop: (item: any) => {
            if (item.fromCalendar) onDrop(item);
        },
    }));

    return (
        <div
            ref={drop}
            className="p-2 bg-cardColor rounded flex-1 overflow-auto border border-borderColor"
        >
            {children}
        </div>
    );
};

const FinalCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(dayjs("2025-06-01"));
    const [calendarItems, setCalendarItems] = useState<{
        [key: string]: any[];
    }>(() => {
        const saved = localStorage.getItem("calendarItems");
        return saved ? JSON.parse(saved) : {};
    });
    const [availableSessions, setAvailableSessions] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const { data: sessionData, isLoading, isError } = useGetSessionListQuery(undefined);
    const [updateSession] = useUpdateSessionMutation();

    useEffect(() => {
        if (sessionData) setAvailableSessions(sessionData);
    }, [sessionData]);

    useEffect(() => {
        localStorage.setItem("calendarItems", JSON.stringify(calendarItems));
    }, [calendarItems]);

    const handleDropToCalendar = (date: any, session: any) => {
        const key = date.format("YYYY-MM-DD");
        const newDuration = parseDuration(session.duration);
        const currentDuration = (calendarItems[key] || []).reduce(
            (sum, s) => sum + parseDuration(s.duration),
            0
        );

        // Check if adding this session would exceed 8 hours
        if (currentDuration + newDuration > 8) {
            alert(`Cannot exceed 8 hours per day. Current: ${currentDuration}h, Adding: ${newDuration}h`);
            return;
        }

        setCalendarItems((prev) => {
            const existing = prev[key] || [];
            
            // If session is being moved from calendar to calendar (reordering/swapping)
            if (session.fromCalendar) {
                // Remove from original position
                const originalDateItems = [...(prev[session.dateKey] || [])];
                originalDateItems.splice(session.calendarIndex, 1);
                
                // Add to new position
                const newItems = [...existing, { ...session }];
                
                return {
                    ...prev,
                    [session.dateKey]: originalDateItems,
                    [key]: newItems
                };
            } else {
                // Adding from available sessions pool
                return { ...prev, [key]: [...existing, { ...session }] };
            }
        });

        // Remove from available sessions if it's from the pool
        if (!session.fromCalendar) {
            setAvailableSessions((prev) =>
                prev.filter((s) => s.id !== session.id)
            );
        }
    };

    const handleRemoveFromCalendar = (dateKey: string, index: number) => {
        const session = calendarItems[dateKey][index];
        setCalendarItems((prev) => {
            const updated = [...(prev[dateKey] || [])];
            updated.splice(index, 1);
            return { ...prev, [dateKey]: updated };
        });
        setAvailableSessions((prev) => [...prev, session]);
    };

    const handleDropToPool = (sessionToRemove: any) => {
        setCalendarItems((prev) => {
            const updated = { ...prev };
            const dateKey = sessionToRemove.dateKey;
            const index = sessionToRemove.calendarIndex;
            if (updated[dateKey]) {
                const [removed] = updated[dateKey].splice(index, 1);
                setAvailableSessions((prevSessions) => [...prevSessions, removed]);
            }
            return updated;
        });
    };

    const handleSaveSchedule = async () => {
        setIsSaving(true);
        try {
            const updatePromises = [];
            
            // Iterate through all calendar dates
            Object.entries(calendarItems).forEach(([dateKey, sessions]) => {
                if (sessions.length > 0) {
                    // Calculate times for sessions on this date
                    const sessionsWithTimes = calculateSessionTimes(sessions, dateKey);
                    
                    // Create update promises for each session
                    sessionsWithTimes.forEach((session) => {
                        const updateData = {
                            id: session.id,
                            startTime: session.calculatedStartTime.toISOString(),
                            endTime: session.calculatedEndTime.toISOString(),
                            title: session.title,
                            description: session.description,
                            preReq: session.preReq,
                            status: session.status,
                            duration: session.duration,
                            program_id: session.program_id
                        };
                        
                        // Use RTK Query mutation
                        const updatePromise = updateSession(updateData).unwrap();
                        updatePromises.push(updatePromise);
                    });
                }
            });
            
            // Wait for all updates to complete
            await Promise.all(updatePromises);
            
            alert('Schedule saved successfully!');
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('Error saving schedule. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-white p-4">Loading sessions...</div>;
    }

    if (isError) {
        return <div className="text-red-500 p-4">Failed to load sessions.</div>;
    }

    const startDay = currentMonth.startOf("month").startOf("week");
    const endDay = currentMonth.endOf("month").endOf("week");

    const calendar = [];
    let day = startDay.clone();
    while (day.isBefore(endDay, "day")) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            const dateKey = day.format("YYYY-MM-DD");
            week.push(
                <DroppableDate
                    key={dateKey}
                    date={day.clone()}
                    items={calendarItems[dateKey] || []}
                    onDrop={handleDropToCalendar}
                    onItemRemove={handleRemoveFromCalendar}
                />
            );
            day = day.add(1, "day");
        }
        calendar.push(
            <div key={day.toString()} className="grid grid-cols-7 gap-1">
                {week}
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen p-4 bg-bgColor font-sans">
                {/* FinalCalendar Section */}
                <div className="w-3/4">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            className="bg-itemColor text-white px-3 py-1 rounded hover:bg-opacity-80"
                            onClick={() =>
                                setCurrentMonth((prev) =>
                                    prev.subtract(1, "month")
                                )
                            }
                        >
                            ◀
                        </button>
                        <div className="text-3xl text-white font-semibold">
                            {currentMonth.format("MMMM YYYY")}
                        </div>
                        <button
                            className="bg-itemColor text-white px-3 py-1 rounded hover:bg-opacity-80"
                            onClick={() =>
                                setCurrentMonth((prev) => prev.add(1, "month"))
                            }
                        >
                            ▶
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center font-semibold mb-2 text-white">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (d) => (
                                <div key={d}>{d}</div>
                            )
                        )}
                    </div>
                    <div className="space-y-1">{calendar}</div>
                </div>

                {/* Available Sessions Section */}
                <div className="w-1/4 pl-4 flex flex-col">
                    <div className="text-xl text-white font-semibold mb-4">
                        Available Sessions
                    </div>
                    <DroppablePool onDrop={handleDropToPool}>
                        {availableSessions.map((session: any) => (
                            <DraggableSession key={session.id} session={session} />
                        ))}
                        {availableSessions.length === 0 && (
                            <div className="text-gray-400 text-center py-8">
                                All sessions scheduled
                            </div>
                        )}
                    </DroppablePool>
                    
                    {/* Save Button */}
                    <button
                        onClick={handleSaveSchedule}
                        disabled={isSaving || Object.keys(calendarItems).length === 0}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Schedule'}
                    </button>
                </div>
            </div>
        </DndProvider>
    );
};

export default FinalCalendar;