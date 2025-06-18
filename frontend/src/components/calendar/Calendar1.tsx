import { useEffect, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import dayjs from "dayjs";

// Sample session pool
const sessionData = [
  { id: 1, title: "Product team meeting", duration: "1.5 hours", color: "bg-red-500" },
  { id: 2, title: "General orientation", duration: "2 hours", color: "bg-orange-400" },
  { id: 3, title: "Client Training", duration: "4 hours", color: "bg-purple-600" },
  { id: 4, title: "CEO Conference", duration: "6 hours", color: "bg-green-600" },
];

// Draggable session
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

  return (
    <div
      ref={drag}
      className={`${session.color} text-white px-2 py-1 rounded mb-2 cursor-move shadow overflow-hidden flex justify-between items-center ${className}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div>
        {session.title}
        <br />
        <span className="text-sm">{session.duration}</span>
      </div>
      {fromCalendar && (
        <button
          onClick={onRemove}
          className="ml-2 bg-white text-black rounded-full w-6 h-6 text-xs flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  );
};

// Session drop wrapper inside a cell
const DroppableSessionWrapper = ({
  session,
  index,
  date,
  onDrop,
  onItemRemove,
}: any) => {
  const [, drop] = useDrop({
    accept: "SESSION",
    drop: (dragged: any) => {
      if (
        dragged.fromCalendar &&
        dragged.dateKey === date.format("YYYY-MM-DD") &&
        dragged.calendarIndex !== index
      ) {
        onDrop(date, { ...dragged, reorderToIndex: index });
      }
    },
  });

  return (
    <div ref={drop}>
      <DraggableSession
        session={session}
        fromCalendar={true}
        dateKey={date.format("YYYY-MM-DD")}
        index={index}
        onRemove={() => onItemRemove(date.format("YYYY-MM-DD"), index)}
        className="max-h-8"
      />
    </div>
  );
};

// Date cell component
const DroppableDate = ({ date, onDrop, items, onItemRemove }: any) => {
  const [, drop] = useDrop(() => ({
    accept: "SESSION",
    drop: (item: any) => {
      onDrop(date, item);
    },
  }));

  const isToday = date.isSame(dayjs(), "day");
  const isCurrentMonth = date.month() === date.startOf("month").month();

  return (
    <div
      ref={drop}
      className={`border border-borderColor ${isToday ? "bg-itemColor" : "bg-cardColor"} h-40 p-2 rounded overflow-auto`}
    >
      <div className={`text-md mb-1 ${isCurrentMonth ? "text-white" : "text-green-500"}`}>
        {date.date()}
      </div>
      {items.map((item: any, idx: number) => (
        <DroppableSessionWrapper
          key={idx}
          session={item}
          index={idx}
          date={date}
          onDrop={onDrop}
          onItemRemove={onItemRemove}
        />
      ))}
    </div>
  );
};

// Session pool
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
      className="p-2 bg-cardColor rounded h-full overflow-auto border border-borderColor"
    >
      {children}
    </div>
  );
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs("2025-06-01"));
  const [calendarItems, setCalendarItems] = useState<{ [key: string]: any[] }>(() => {
    const saved = localStorage.getItem("calendarItems");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("calendarItems", JSON.stringify(calendarItems));
  }, [calendarItems]);

  const handleDropToCalendar = (date: any, session: any) => {
    const key = date.format("YYYY-MM-DD");

    setCalendarItems((prev) => {
      const existing = prev[key] || [];

      // Reordering within same cell
      if (
        session.fromCalendar &&
        session.dateKey === key &&
        session.reorderToIndex !== undefined
      ) {
        const reordered = [...existing];
        const [moved] = reordered.splice(session.calendarIndex, 1);
        reordered.splice(session.reorderToIndex, 0, moved);
        return { ...prev, [key]: reordered };
      }

      // Rescheduling to different date
      if (session.fromCalendar && session.dateKey !== key) {
        const updated = { ...prev };
        const fromList = updated[session.dateKey] || [];
        fromList.splice(session.calendarIndex, 1); // remove from old date
        updated[session.dateKey] = fromList;
        updated[key] = [...(updated[key] || []), { ...session }];
        return updated;
      }

      // From pool to calendar
      if (!session.fromCalendar) {
        return { ...prev, [key]: [...existing, { ...session }] };
      }

      return prev;
    });
  };

  const handleRemoveFromCalendar = (dateKey: string, index: number) => {
    setCalendarItems((prev) => {
      const updated = [...(prev[dateKey] || [])];
      updated.splice(index, 1);
      return { ...prev, [dateKey]: updated };
    });
  };

  const handleDropToPool = (sessionToRemove: any) => {
    setCalendarItems((prev) => {
      const updated = { ...prev };
      const dateKey = sessionToRemove.dateKey;
      const index = sessionToRemove.calendarIndex;
      if (updated[dateKey]) {
        updated[dateKey] = updated[dateKey].filter((_, i) => i !== index);
      }
      return updated;
    });
  };

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
        {/* Calendar */}
        <div className="w-3/4">
          <div className="flex items-center justify-between mb-6">
            <button
              className="bg-itemColor text-white px-3 py-1 rounded"
              onClick={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}
            >
              ◀
            </button>
            <div className="text-3xl text-white font-semibold">
              {currentMonth.format("MMMM YYYY")}
            </div>
            <button
              className="bg-itemColor text-white px-3 py-1 rounded"
              onClick={() => setCurrentMonth((prev) => prev.add(1, "month"))}
            >
              ▶
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-semibold mb-2 text-white">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="space-y-1">{calendar}</div>
        </div>

        {/* Session Pool */}
        <div className="w-1/4 pl-4">
          <div className="text-xl text-white font-semibold mb-4">Available Sessions</div>
          <DroppablePool onDrop={handleDropToPool}>
            {sessionData.map((session) => (
              <DraggableSession key={session.id} session={session} />
            ))}
          </DroppablePool>
        </div>
      </div>
    </DndProvider>
  );
};

export default Calendar;
