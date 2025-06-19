import { useEffect, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import dayjs from "dayjs";
import { useGetSessionListQuery, useUpdateSessionsMutation } from "../../api-service/session/session.api";

interface Session {
  id: string;
  title: string;
  duration: string;
  color: string;
  program_id: number;
  description?: string;
  preReq?: string;
  status: string;
  startTime?: Date;
  endTime?: Date;
}

interface CalendarSession extends Session {
  fromCalendar?: boolean;
  calendarIndex?: number;
  dateKey?: string;
}

const parseDuration = (durationStr: string): number => {
  const match = durationStr.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

const DraggableSession = ({
  session,
  fromCalendar,
  onRemove,
  dateKey,
  index,
  className,
}: {
  session: CalendarSession;
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

  return (
    <div
      ref={drag}
      className={`${session.color} text-white px-2 py-1 rounded mb-2 cursor-move shadow overflow-hidden ${className}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {session.title} <br />
      <span className="text-sm">{session.duration} hours</span>
    </div>
  );
};

const DroppableDate = ({ date, onDrop, items, onItemRemove }: any) => {
  const [, drop] = useDrop(() => ({
    accept: "SESSION",
    drop: (item: CalendarSession) => {
      onDrop(date, item);
    },
  }));

  const isToday = date.isSame(dayjs(), "day");
  const isCurrentMonth = date.month() === dayjs().month();
  
  return (
    <div
      ref={drop}
      className={`border border-borderColor ${
        isToday ? "bg-itemColor" : "bg-cardColor"
      } h-40 p-2 rounded overflow-auto`}
    >
      <div
        className={`text-md mb-1 ${
          isCurrentMonth ? "text-white" : "text-green-500"
        }`}
      >
        {date.date()}
      </div>
      {items.map((item: CalendarSession, idx: number) => (
        <DraggableSession
          key={`${item.id}-${idx}`}
          session={item}
          fromCalendar={true}
          dateKey={date.format("YYYY-MM-DD")}
          index={idx}
          onRemove={() => onItemRemove(date.format("YYYY-MM-DD"), idx)}
          className="max-h-8"
        />
      ))}
    </div>
  );
};

const DroppablePool = ({
  onDrop,
  children,
  className = "",
}: {
  onDrop: (item: CalendarSession) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const [, drop] = useDrop(() => ({
    accept: "SESSION",
    drop: (item: CalendarSession) => {
      if (item.fromCalendar) onDrop(item);
    },
  }));

  return (
    <div
      ref={drop}
      className={`p-2 bg-cardColor rounded overflow-auto border border-borderColor ${className}`}
    >
      {children}
    </div>
  );
};

const calculateSessionTimings = (sessions: Session[], date: dayjs.Dayjs): Session[] => {
  let currentTime = date.set('hour', 9).set('minute', 0).set('second', 0);
  
  return sessions.map(session => {
    const durationHours = parseDuration(session.duration);
    const startTime = currentTime.toDate();
    const endTime = currentTime.add(durationHours, 'hour').toDate();
    
    currentTime = currentTime.add(durationHours, 'hour');
    
    return {
      ...session,
      startTime,
      endTime
    };
  });
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [calendarItems, setCalendarItems] = useState<{
    [key: string]: CalendarSession[];
  }>(() => {
    const saved = localStorage.getItem("calendarItems");
    return saved ? JSON.parse(saved) : {};
  });
  
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);
  const { data: sessionData, isLoading, isError } = useGetSessionListQuery(undefined);
  const [updateSessions] = useUpdateSessionsMutation();

  useEffect(() => {
    if (sessionData) {
      setAvailableSessions(sessionData.filter((s: Session) => !s.startTime));
      
      // Initialize calendar with sessions that already have timings
      const scheduledSessions: { [key: string]: CalendarSession[] } = {};
      sessionData.forEach((session: Session) => {
        if (session.startTime) {
          const dateKey = dayjs(session.startTime).format("YYYY-MM-DD");
          if (!scheduledSessions[dateKey]) {
            scheduledSessions[dateKey] = [];
          }
          scheduledSessions[dateKey].push(session);
        }
      });
      
      setCalendarItems(prev => ({
        ...scheduledSessions,
        ...prev
      }));
    }
  }, [sessionData]);

  useEffect(() => {
    localStorage.setItem("calendarItems", JSON.stringify(calendarItems));
  }, [calendarItems]);

  const handleDropToCalendar = (date: dayjs.Dayjs, session: CalendarSession) => {
    const key = date.format("YYYY-MM-DD");
    const newDuration = parseDuration(session.duration);
    const currentDuration = (calendarItems[key] || []).reduce(
      (sum, s) => sum + parseDuration(s.duration),
      0
    );

    if (currentDuration + newDuration > 8) {
      alert("Cannot exceed 8 hours per day.");
      return;
    }

    setCalendarItems((prev) => {
      const existing = prev[key] || [];
      return { ...prev, [key]: [...existing, { ...session }] };
    });

    if (!session.fromCalendar) {
      setAvailableSessions((prev) =>
        prev.filter((s) => s.id !== session.id)
      );
    }
  };

  const handleRemoveFromCalendar = (dateKey: string, index: number) => {
    const session = calendarItems[dateKey][index];
    setCalendarItems((prev) => {
      const updated = { ...prev };
      updated[dateKey].splice(index, 1);
      if (updated[dateKey].length === 0) {
        delete updated[dateKey];
      }
      return updated;
    });
    setAvailableSessions((prev) => [...prev, session]);
  };

  const handleDropToPool = (sessionToRemove: CalendarSession) => {
    handleRemoveFromCalendar(sessionToRemove.dateKey!, sessionToRemove.calendarIndex!);
  };

  const handleSaveCalendar = async () => {
    try {
      const allSessions: Session[] = [];
      
      Object.entries(calendarItems).forEach(([dateKey, sessions]) => {
        const date = dayjs(dateKey);
        const sessionsWithTiming = calculateSessionTimings(sessions, date);
        allSessions.push(...sessionsWithTiming);
      });

      // Add unscheduled sessions (without timings)
      const unscheduledSessions = availableSessions.map(session => ({
        ...session,
        startTime: undefined,
        endTime: undefined
      }));
      allSessions.push(...unscheduledSessions);

      await updateSessions(allSessions).unwrap();
      alert("Calendar saved successfully!");
    } catch (error) {
      console.error("Failed to save calendar:", error);
      alert("Failed to save calendar. Please try again.");
    }
  };

  const renderCalendarDays = () => {
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
    
    return calendar;
  };

  if (isLoading) {
    return <div className="text-white p-4">Loading sessions...</div>;
  }

  if (isError) {
    return <div className="text-red-500 p-4">Failed to load sessions.</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen p-4 bg-bgColor font-sans">
        {/* Calendar Section */}
        <div className="w-3/4">
          <div className="flex items-center justify-between mb-6">
            <button
              className="bg-itemColor text-white px-3 py-1 rounded"
              onClick={() => setCurrentMonth(prev => prev.subtract(1, "month"))}
            >
              ◀
            </button>
            <div className="text-3xl text-white font-semibold">
              {currentMonth.format("MMMM YYYY")}
            </div>
            <button
              className="bg-itemColor text-white px-3 py-1 rounded"
              onClick={() => setCurrentMonth(prev => prev.add(1, "month"))}
            >
              ▶
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-semibold mb-2 text-white">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="space-y-1">{renderCalendarDays()}</div>
        </div>

        {/* Available Sessions Section */}
        <div className="w-1/4 pl-4 flex flex-col">
          <div className="text-xl text-white font-semibold mb-4">
            Available Sessions
          </div>
          <DroppablePool onDrop={handleDropToPool} className="flex-grow">
            {availableSessions.length > 0 ? (
              availableSessions.map((session) => (
                <DraggableSession key={session.id} session={session} />
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">
                No available sessions
              </div>
            )}
          </DroppablePool>
          
          <button
            onClick={handleSaveCalendar}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Calendar
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default Calendar;