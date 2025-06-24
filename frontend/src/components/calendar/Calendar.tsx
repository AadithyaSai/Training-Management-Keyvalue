import { useEffect, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween"
import { useGetTrainingByIdQuery } from "../../api-service/training/training.api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import Button, { ButtonType } from "../button/Button";
import { useUpdateMultipleSessionsMutation } from "../../api-service/session/session.api";
import { jwtDecode } from "jwt-decode";

dayjs.extend(isBetween)

const SessionStatus = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "InProgress",
  COMPLETED: "Completed",
}

const SessionColor = {
  DRAFT: "bg-yellow-400",        
  SCHEDULED: "bg-blue-600",      
  IN_PROGRESS: "bg-orange-500",  
  COMPLETED: "bg-emerald-600",   
};

const assignColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "draft":
      return SessionColor.DRAFT;
    case "scheduled":
      return SessionColor.SCHEDULED;
    case "inprogress":
      return SessionColor.IN_PROGRESS;
    case "completed":
      return SessionColor.COMPLETED;
    default:
      return "";
  }
}

// 🧲 Draggable session block
const DraggableSession = ({
  session,
  fromCalendar,
  dateKey,
  index,
  className,
}: {
  session: any;
  fromCalendar?: boolean;
  dateKey?: string;
  index?: number;
  className?: string;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "SESSION",
    item: { ...session, fromCalendar, calendarIndex: index, dateKey },
    canDrag: session.status === SessionStatus.DRAFT || !fromCalendar,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  if (!fromCalendar) {
    return (
      <div
        ref={drag}
        className={`text-white text-lg px-2 py-1 w-[340px] mx-auto rounded mb-2 cursor-move shadow overflow-hidden ${className} hover:scale-101 transition-transform ${assignColor(session.status)}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div className="flex items-center gap-2">
          <span className="bg-white text-black text-sm size-6 rounded-full flex justify-center items-center">{session.number}</span>
          {session.title}
          </div>
        <div>
          {session.description && (
            <span className="text-sm line-clamp-4 text-wrap break-words w-full">{session.description}</span>
          )}
        </div>
        <span className="text-sm text-gray-200">{session.duration} Hrs</span>
      </div>
    );
  }

  return (
    <div
      ref={drag}
      className={`text-white px-2 py-1 rounded cursor-move shadow overflow-hidden flex justify-center items-center ${className} ${assignColor(session.status)}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div>
        <span className="bg-white text-black text-sm size-6 rounded-full flex justify-center items-center">{session.number}</span>
      </div>

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
  onStatusChange,
}: any) => {
  const [popoverDetails, setPopoverDetails] = useState({
    x: 0,
    y: 0,
    visible: false,
  });
  const onHover = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = rect.left + window.scrollX - 350;  // Adjusted for navbar
    const y = rect.top + window.scrollY - 120;  // Adjusted for header
    setPopoverDetails({
      x: x - 30, // Offset to avoid cursor overlap
      y: y + 28,
      visible: true,
    });
  };
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
    <div ref={drop} onMouseEnter={onHover} onMouseLeave={() => setPopoverDetails((prev) => ({...prev, visible: false}))}>
      <div>
        <DraggableSession
          session={session}
          fromCalendar={true}
          dateKey={date.format("YYYY-MM-DD")}
          index={index}
          className={"max-h-8 "}
        />
      </div>
      <SessionDetailPopover
        x={popoverDetails.x}
        y={popoverDetails.y}
        visible={popoverDetails.visible}
        session={session}
        onRemove={() => onItemRemove(date.format("YYYY-MM-DD"), index)}
        onStatusChange={(status: string) => onStatusChange(date.format("YYYY-MM-DD"), index, status)}
      />
    </div>
  );
};

// 📅 Calendar cell for each day
const DroppableDate = ({ date, onDrop, items, onItemRemove, isDroppable, onStatusChange }: any) => {
  const [, drop] = useDrop(() => ({
    accept: "SESSION",
    canDrop: () => isDroppable,
    drop: (item: any) => {
      onDrop(date, item);
    },
  }));

  return (
    <div
      ref={drop}
      className={`border border-borderColor h-32 p-2 rounded overflow-hidden flex flex-col ${!isDroppable?"bg-cardColor":"bg-white/10 hover:bg-white/15"}`}
    >
      <div
        className={`text-md mb-1 h-fit ${isDroppable ? 'text-white' : 'text-white/30'}`}
      >
        {date.date()}
      </div>
      <div className="overflow-y-auto flex flex-wrap">
        {items.map((item: any, idx: number) => (
          <div className="w-1/2 p-1" key={idx}>
            <DroppableSessionWrapper
              session={item}
              index={idx}
              date={date}
              onDrop={onDrop}
              onItemRemove={onItemRemove}
              onStatusChange={onStatusChange}
            />
          </div>
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

const SessionDetailPopover = ({x, y, visible, session, onRemove, onStatusChange}: {x: number, y: number, visible: boolean, session?: any, onRemove: () => void, onStatusChange: (status: string) => void}) => {
  if (!session) return null;
  // correct y if towards screen bottom
  const screenHeight = window.innerHeight - 100;
  // alert(`Screen height: ${screenHeight}, Popover Y: ${y}`);
  const popoverHeight = 180 + 38; // height of the popover + div
  if (y + popoverHeight > screenHeight) {
    y -= popoverHeight - 10; // 10px padding from bottom
  }
  return (
    <div
      className={"absolute flex flex-col justify-between bg-itemColor h-[180px] w-[500px] text-white border border-gray-300 rounded p-2 shadow-lg transition-opacity duration-300 " + (!visible ? "hidden opacity-0" : "opacity-100")}
      style={{ top: y, left: x }}
    >
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-xl h-fit p-1 flex gap-2">{session.title}<span className="text-gray-400">{session.status.toUpperCase()}</span></p>
        <p className="line-clamp-2">{session.description}</p>
      </div>
      <div className="flex justify-between">
        <p className="h-fit p-1">Duration: {session.duration} Hrs</p>
          <div className="flex gap-1">
            {session.status !== SessionStatus.DRAFT && session.status !== SessionStatus.COMPLETED &&
              <button className="bg-white text-black px-2 py-1 rounded hover:bg-gray-200" onClick={() => onStatusChange(session.status === SessionStatus.SCHEDULED ? SessionStatus.IN_PROGRESS : SessionStatus.COMPLETED)}>
                <span>
                  {session.status === SessionStatus.SCHEDULED ? "Start Session" : "End Session"}
                </span>
              </button>
            }
            {session.status !== SessionStatus.COMPLETED && session.status !== SessionStatus.IN_PROGRESS &&
              <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700" onClick={onRemove}>
                Move to Pool
              </button>
            }
          </div>
      </div>
    </div>
  )
}


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
  const token = localStorage.getItem("token");
  const isAdmin = jwtDecode(token).isAdmin;
  useEffect(() => {
    console.log("Updated calendar items:", calendarItems);
  }, [calendarItems]);

  const [sessionsList, setSessionsList] = useState<any[]>([]);

  useEffect(() => {
    if (!trainingDetails) return;
    if (trainingDetails?.endDate && trainingDetails?.startDate) {
      const start = dayjs(trainingDetails.startDate);
      const end = dayjs(trainingDetails.endDate);
      setCurrentMonth(dayjs().isAfter(end.startOf('month')) ? start.startOf("month") : end.startOf("month"));
    } else {
      setCurrentMonth(dayjs());
    }
    if (trainingDetails?.sessions) {
      const initialSessionsList = [...trainingDetails.sessions]
        .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((session: any, index: number) => ({
          ...session,
          number: index + 1,
    }))
    // Initialize calendar items from GET
    if (!initialSessionsList) return;
    const initialItems: { [key: string]: any[] } = {};
    initialSessionsList.forEach((session: any) => {
      const dateKey = session.date
        ? dayjs(session.date).format("YYYY-MM-DD")
        : "";
      if (!dateKey || session.status === SessionStatus.DRAFT) return;
  
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
    setSessionsList(initialSessionsList);
    }
  }, [trainingDetails]);

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
        setSessionsList((prev) => {
          const updatedSessionIdx =  prev.findIndex(
            (s) => s.id === session.id
          );
          const updatedSessions = [...prev];
          const sessionToAdd = { ...session, date: key, fromCalendar: true };
          sessionToAdd.status = SessionStatus.SCHEDULED;
          updatedSessions.splice(updatedSessionIdx, 1, sessionToAdd);
          return updatedSessions;
        });
        return {
          ...prev,
          [key]: [...existing, { ...session }],
        };
      }

      return prev;
    });
  };

  // ❌ Remove session from calendar date
  const handleRemoveFromCalendar = (dateKey: string, index: number) => {
    setCalendarItems((prev) => {
      const updated = [...(prev[dateKey] || [])];
      const removed = updated.splice(index, 1);
        setSessionsList(prev => {
          const updatedSessions = [...prev];
          const sessionToRemove = updatedSessions.find(
            (s) => s.id === removed[0].id
          );
          if (sessionToRemove) {
            sessionToRemove.status = SessionStatus.DRAFT; // Reset status to Draft
          }
          return updatedSessions;
        }
        );
        console.log(dateKey, updated)
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

  const handleStatusChange = (dateKey: string, index: number, status: string) => {
    console.log("Changing status for", dateKey, index, status);
    setCalendarItems((prev) => {
      const updated = { ...prev };
      if (updated[dateKey] && updated[dateKey][index]) {
        updated[dateKey][index].status = status;
        setSessionsList((prevSessions) => {
          const updatedSessions = [...prevSessions];
          const sessionToUpdate = updatedSessions.find(
            (s) => s.id === updated[dateKey][index].id
          );
          if (sessionToUpdate) {
            sessionToUpdate.status = status; // Update status
          }
          return updatedSessions;
        }
        );
      }
      return updated;
    });
  };

  // 📅 Build calendar matrix
  const startDay = currentMonth.startOf("month").startOf("week");
  const endDay = currentMonth.endOf("month").endOf("week");
  const calendar = [];
  let day = startDay.clone();
  const startDate = trainingDetails?.startDate;
  const endDate = trainingDetails?.endDate;
  while (day.isBefore(endDay, "day")) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const isDroppable = day.isBetween(startDate, endDate+1)
      const dateKey = day.format("YYYY-MM-DD");

      week.push(
        <DroppableDate
          key={dateKey}
          date={day.clone()}
          items={calendarItems[dateKey] || []}
          onDrop={handleDropToCalendar}
          onItemRemove={handleRemoveFromCalendar}
          isDroppable={isDroppable}
          onStatusChange={handleStatusChange}
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
    // Build payload for scheduled sessions
    const payload = Object.entries(calendarItems)
      .flatMap(([dateKey, sessions]) =>
      sessions.map((session: any, idx) => ({
        id: session.id,
        programId: parseInt(trainingId!, 10),
        date: dateKey,
        slot: idx + 1,
        status: session.status === SessionStatus.DRAFT ? SessionStatus.SCHEDULED : session.status,
      }))
      );

    // Add unscheduled (draft) sessions not already in payload
    sessionsList.forEach((session) => {
      if (
      session.status === SessionStatus.DRAFT &&
      !payload.some((p) => p.id === session.id)
      ) {
      payload.push({
        id: session.id,
        programId: parseInt(trainingId!, 10),
        date: "01-01-1970", // Placeholder date for unscheduled sessions
        slot: 0,
        status: SessionStatus.DRAFT,
      });
      }
    });
    console.log("Final payload for update:", payload);
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
          <div className="w-1/4 pl-4 h-[75vh]">
            <div className="text-xl text-white font-semibold mb-4">
              Sessions
            </div>
            <div className="flex flex-col bg-cardColor rounded h-full border border-borderColor">
              <div className="grow overflow-y-auto h-3/4 mb-2">
                <DroppablePool onDrop={handleDropToPool}>
                  {(isAdmin ? sessionsList.filter((s) => s.status === SessionStatus.DRAFT) : sessionsList.filter((s) => s.status !== SessionStatus.DRAFT)).map((session: any) => (
                    <DraggableSession key={session.id} session={session}/>
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