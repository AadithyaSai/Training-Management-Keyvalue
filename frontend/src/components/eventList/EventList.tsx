import dayjs from "dayjs";
import { useState } from "react";
import { CiPlay1 } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EventStatusType = {
    DEFAULT: "All",
    IN_PROGRESS: "InProgress",
    SCHEDULED: "Scheduled",
    DRAFT: "Draft",
    COMPLETED: "Completed",
} as const;

export const EventListType = {
    TRAINING: "Training",
    SESSION: "Session",
} as const;

export type EventProps = {
    id: number;
    title: string;
    description: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    duration?: number;
    status?: (typeof EventStatusType)[keyof typeof EventStatusType];
    trainer?: string;
    totalSessions?: number;
    progress?: number;
};

type EventItem = {
    item: EventProps;
    eventType: (typeof EventListType)[keyof typeof EventListType];
    isAdmin: boolean;
};

type EventListProps = {
    eventType: (typeof EventListType)[keyof typeof EventListType];
    isAdmin: boolean;
    showCreateButton?: boolean;
    onCreateClick?: () => void;
    data?: EventProps[];
};

export const formatTrainingList = (trainingDetailsList: Array<EventProps>) => {
    if (!trainingDetailsList) return;
    const formattedTrainingList = trainingDetailsList.map(
        (trainingDetails: EventProps) => {
            return {
                id: trainingDetails.id,
                title: trainingDetails.title,
                description: trainingDetails.description,
                date: trainingDetails.date,
                status: trainingDetails?.status,
            };
        }
    );
    return formattedTrainingList;
};

const EventListItem: React.FC<EventItem> = ({ item, eventType }) => {
    const navigate = useNavigate();
    return (
        <div
            className="border border-gray-700 p-4 rounded-lg bg-cardColor cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-[1.015] hover:shadow-lg hover:bg-[#2c2c2c]"
            onClick={() =>
                eventType == EventListType.SESSION
                    ? navigate(`session/${item.id}`)
                    : navigate(`/training/${item.id}`)
            }
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                    {item.title}
                </h3>
                {item.status && (
                    <span className="text-sm text-green-400 flex items-center gap-1">
                        <CiPlay1 />
                        <p>{item.status}</p>
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-1 mt-2">
                <p className="text-sm mt-1 text-gray-400">{item.description}</p>
                {eventType == EventListType.SESSION ? (
                    <p className="text-sm mt-1 text-white">
                        Date : {dayjs(item.date).format("DD/MM/YYYY")}
                    </p>
                ) : (
                    <>
                        <p className="text-sm mt-1 text-white">
                            Start date :{" "}
                            {dayjs(item.startDate).format("DD/MM/YYYY")}
                        </p>
                        <p className="text-sm mt-1 text-white">
                            End date :{" "}
                            {dayjs(item.endDate).format("DD/MM/YYYY")}
                        </p>
                    </>
                )}
                {item.trainer && (
                    <p className="text-sm mt-1 text-white">
                        Trainer : {item.trainer}
                    </p>
                )}
                {item.totalSessions !== undefined && (
                    <p className="text-sm mt-1 text-white">
                        Total sessions : {item.totalSessions}
                    </p>
                )}
                {item.progress !== undefined && (
                    <div className="mt-2">
                        <p className="text-sm text-white">
                            Progress : {item.progress}%
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div
                                className="bg-white h-2 rounded-full"
                                style={{ width: `${item.progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const EventList: React.FC<EventListProps> = ({
    eventType,
    isAdmin,
    showCreateButton = false,
    onCreateClick,
    data,
}) => {
    const [statusFilter, setStatusFilter] = useState(
        String(EventStatusType.DEFAULT)
    );
    const [searchTerm, setSearchTerm] = useState("");
    const filteredData = (data || []).filter(
        (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (eventType === EventListType.SESSION ||
                statusFilter.toLowerCase() == "all" ||
                item.status === statusFilter)
    );
    return (
        <div className="text-white w-full">
            <div className="flex flex-col items-center border border-borderColor px-2 py-4 rounded-lg bg-cardColor">
                <div className="flex justify-between items-center mb-4 p-4 rounded-lg bg-cardColor w-full">
                    <h2 className="text-3xl font-bold">{eventType}s</h2>
                    <div className="flex items-center space-x-3">
                        {isAdmin && showCreateButton && (
                            <button
                                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
                                onClick={onCreateClick}
                            >
                                Create {eventType} +
                            </button>
                        )}

                        {eventType === EventListType.SESSION && (
                            <select
                                className="bg-itemColor border border-borderColor px-3 py-2 rounded"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option
                                    className="bg-itemColor"
                                    value={EventStatusType.IN_PROGRESS}
                                >
                                    InProgress
                                </option>
                                <option
                                    className="bg-itemColor"
                                    value={EventStatusType.SCHEDULED}
                                >
                                    Scheduled
                                </option>
                                <option
                                    className="bg-itemColor"
                                    value={EventStatusType.DRAFT}
                                >
                                    Draft
                                </option>
                                <option
                                    className="bg-itemColor"
                                    value={EventStatusType.COMPLETED}
                                >
                                    Completed
                                </option>
                                <option
                                    className="bg-itemColor"
                                    value={EventStatusType.DEFAULT}
                                >
                                    All
                                </option>
                            </select>
                        )}

                        <div className="flex items-center border border-borderColor rounded px-2 bg-itemColor shadow-2xl">
                            <input
                                type="text"
                                placeholder="Search"
                                className="px-2 py-2 outline-none text-white bg-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="text-gray-500" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 w-full px-2">
                    {filteredData.length === 0 ? (
                        <p className="text-center text-gray-500 w-full border-2 border-borderColor py-10 rounded-sm">
                            No {eventType.toLowerCase()}s found
                        </p>
                    ) : (
                        filteredData.map((item, index) => (
                            <EventListItem
                                isAdmin={isAdmin}
                                key={index}
                                item={item}
                                eventType={eventType}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventList;
