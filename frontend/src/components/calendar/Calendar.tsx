import { useEffect, useMemo, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import dayjs from "dayjs";
import { useGetTrainingByIdQuery } from "../../api-service/training/training.api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import Button, { ButtonType } from "../button/Button";
import { useUpdateMultipleSessionsMutation } from "../../api-service/session/session.api";

// 🎨 Color classes for random session colors
const colorClasses = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-600",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-400",
  "bg-teal-500",
  "bg-cyan-500",
];

// 🧲 Draggable session block
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
    canDrag: session.status.toLowerCase() === "draft" || !fromCalendar,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  if (!fromCalendar) {
    return (
      <div
        ref={drag}
        className={`bg-blue-400 text-white text-lg px-2 py-1 rounded mb-2 cursor-move shadow overflow-hidden ${className} hover:scale-101 transition-transform`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {session.title}
        <div>
          {session.description && (
            <span className="text-sm">{session.description}</span>
          )}
        </div>
        <span className="text-sm text-gray-200">{session.duration} Hrs</span>
      </div>
    );
  }

  return (
    <div
      ref={drag}
      className={`${
        session.status === "Draft" ? "bg-white/60" : "bg-green-500"
      } text-white px-2 py-1 rounded mb-2 cursor-move shadow overflow-hidden flex justify-between items-center ${className}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="text-nowrap overflow-hidden overflow-ellipsis w-4/5">
        {session.title}
      </div>
      {fromCalendar && (
        <button
          onClick={onRemove}
          className="ml-2 bg-white text-black rounded-full w-5 h-5 text-sm flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          ×
        </button>
      )}
    </div>
  );
};

// 🧲 Each draggable session inside a date box
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

// 📅 Calendar cell for each day
const DroppableDate = ({ date, onDrop, items, onItemRemove }: any) => {
  const [, drop] = useDrop(() => ({
    accept: "SESSION",
    drop: (item: any) => {
      onDrop(date, item);
    },
  }));

  const isCurrentMonth = date.month() === date.startOf("month").month();

  return (
    <div
      ref={drop}
      className={`border border-borderColor bg-cardColor hover:bg-itemColor h-32 p-2 rounded overflow-hidden flex flex-col`}
    >
      <div
        className={`text-md mb-1 h-fit ${
          isCurrentMonth ? "text-white" : "text-green-500"
        }`}
      >
        {date.date()}
      </div>
      <div className="overflow-y-auto">
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
    </div>
  );
};

// 🎯 Drop zone for session pool
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
    <div ref={drop} className="p-2 h-full">
      {children}
    </div>
  );
};

// 📆 Main Calendar Component
const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs("2025-06-01"));
  const [calendarItems, setCalendarItems] = useState<{
    [key: string]: any[];
  }>({});
  const { trainingId } = useParams();
  const {
    data: trainingDetails,
    isLoading: isGetTrainingLoading,
    isFetching: isGetTrainingFetching,
  } = useGetTrainingByIdQuery({
    id: parseInt(trainingId || "0", 10),
  });

  const [updateMultipleSessions, { isLoading: updateIsLoading }] =
    useUpdateMultipleSessionsMutation();

  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("Updated calendar items:", calendarItems);
  // }, [calendarItems]);

  const coloredSessions = useMemo(() => {
    if (!trainingDetails?.sessions) return [];
    return trainingDetails.sessions.map((session: any, index: number) => ({
      ...session,
    }));
  }, [trainingDetails?.sessions]);

  useEffect(() => {
    // Initialize calendar items from GET
    if (!coloredSessions) return;
    const initialItems: { [key: string]: any[] } = {};
    coloredSessions.forEach((session: any) => {
      const dateKey = session.date
        ? dayjs(session.date).format("YYYY-MM-DD")
        : "";
      if (!dateKey || session.status === "Draft") return;

      if (!initialItems[dateKey]) {
        initialItems[dateKey] = [];
      }
      initialItems[dateKey].push({
        ...session,
        fromCalendar: false, // Initially not from calendar
        dateKey,
      });
    });
    setCalendarItems(initialItems);
    console.log("Initialized calendar items:", initialItems);
  }, [coloredSessions]);

  const sessionsRemaining = useMemo(() => {
    if (!coloredSessions) return [];
    const scheduledIds = new Set<number>();

    Object.values(calendarItems).forEach((sessions: any[]) => {
      sessions.forEach((session) => {
        scheduledIds.add(session.id);
      });
    });
    console.log("Scheduled IDs:", scheduledIds);

    return coloredSessions.filter(
      (session: any) => !scheduledIds.has(session.id)
    );
  }, [calendarItems, coloredSessions]);

  // 🧩 Handle drop on calendar date
  const handleDropToCalendar = (date: any, session: any) => {
    const key = date.format("YYYY-MM-DD");
    setCalendarItems((prev) => {
      const existing = prev[key] ? [...prev[key]] : [];

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
        const fromList = updated[session.dateKey]
          ? [...updated[session.dateKey]]
          : [];
        const removed = fromList.splice(session.calendarIndex, 1); // remove from old date
        updated[session.dateKey] = fromList;
        updated[key] = [...existing, removed[0]];
        return updated;
      }

      // From pool to calendar
      if (!session.fromCalendar) {
        return {
          ...prev,
          [key]: [...existing, { ...session, status: "Draft" }],
        };
      }

      return prev;
    });
  };

  // ❌ Remove session from calendar date
  const handleRemoveFromCalendar = (dateKey: string, index: number) => {
    setCalendarItems((prev) => {
      const updated = [...(prev[dateKey] || [])];
      updated.splice(index, 1);
      return { ...prev, [dateKey]: updated };
    });
  };

  // 🔄 Drop back to pool
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

  // 📅 Build calendar matrix
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

  const handleConfirmSchedule = () => {
    const payload = [
      ...Object.entries(calendarItems)
        .filter(([, sessions]) => sessions.length !== 0)
        .map(([dateKey, sessions]) =>
          sessions.map((session: any, idx) => ({
            id: session.id,
            programId: parseInt(trainingId!, 10),
            date: dateKey,
            slot: idx + 1,
            status: "Scheduled",
          }))
        )
        .flat(),
    ];
    //add sessions not in calendarItems to payload as scheduled
    payload.push(
      ...sessionsRemaining.map((session: any) => ({
        id: session.id,
        programId: parseInt(trainingId!, 10),
        slot: 1,
        status: "Draft",
      }))
    );
    updateMultipleSessions({
      sessions: payload.map((s) => ({ ...s })),
    })
      .unwrap()
      .then((x) => {
        console.log("Schedule updated successfully", x);
      })
      .catch((error) => {
        console.error("Error updating schedule:", error);
      });
  };

  return (
    <Layout
      title={`Training Calendar`}
      isLoading={
        isGetTrainingLoading || isGetTrainingFetching || updateIsLoading
      }
    >
      <DndProvider backend={HTML5Backend}>
        <div className="flex p-4 bg-bgColor font-sans">
          {/* 📅 Calendar Section */}
          <div className="w-3/4">
            <div className="flex items-center justify-between mb-6">
              <button
                className="bg-itemColor text-white px-3 py-1 rounded"
                onClick={() =>
                  setCurrentMonth((prev) => prev.subtract(1, "month"))
                }
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
          {/* 📦 Session Pool */}
          <div className="w-1/4 pl-4">
            <div className="text-xl text-white font-semibold mb-4">
              Available Sessions
            </div>
            <div className="flex flex-col bg-cardColor rounded h-full border border-borderColor">
              <div className="grow overflow-y-auto">
                <DroppablePool onDrop={handleDropToPool}>
                  {sessionsRemaining.map((session: any) => (
                    <DraggableSession key={session.id} session={session} />
                  ))}
                </DroppablePool>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant={ButtonType.PRIMARY}
                  onClick={handleConfirmSchedule}
                >
                  Confirm Schedule
                </Button>
                <Button
                  variant={ButtonType.SECONDARY}
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </Layout>
  );
};

export default Calendar;