import DashboardCard, {
    type DashboardCardProps,
} from "../dashboardCard/DashboardCard";

type DashboardCardListProps = {
    data: Array<DashboardCardProps>;
};

const DashboardCardList: React.FC<DashboardCardListProps> = ({ data }) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            {data.map((cardData, index) => (
                <DashboardCard
                    key={index}
                    label={cardData.label}
                    value={cardData.value || 0}
                    type={cardData.type}
                />
            ))}
        </div>
    );
};

export default DashboardCardList;
