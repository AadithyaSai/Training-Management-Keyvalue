import type { SessionData } from "./sessionTypes";

interface SessionContentProps {
	isAdmin?: boolean;
	sessionData: SessionData;
}

export const SessionContent: React.FC<SessionContentProps> = ({
	isAdmin = false,
	sessionData,
}) => {
	return (
		<>
			{/* Trainer Section */}
			<div className="border-b border-gray-600 pb-4">
				<h3 className="text-gray-400 text-sm mb-2">Trainer</h3>
				<h2 className="text-xl font-medium">
					{sessionData.trainer?.name}
				</h2>
			</div>

			{/* Moderators Section */}
			<div className="border-b border-gray-600 pb-4">
				<h3 className="text-gray-400 text-sm mb-2">Moderators</h3>
				<div className="space-y-1">
					{sessionData.moderators?.map((moderator, index) => (
						<p key={index} className="text-lg">
							{moderator.name}
						</p>
					))}
				</div>
			</div>

			{/* Session Description */}
			<div className="border-b border-gray-600 pb-4">
				<h3 className="text-gray-400 text-sm mb-2">
					Session Description
				</h3>
				<p className="text-gray-300 leading-relaxed">
					{sessionData.description || "Desc"}
				</p>
			</div>

			{isAdmin && (
				<>
					{sessionData.materialQualityFeedback && (
						<div className="border-b border-gray-600 pb-4">
							<h3 className="text-gray-400 text-sm mb-2">
								Material Quality
							</h3>
							<p className="text-gray-300 leading-relaxed">
								{sessionData.materialQualityFeedback}
							</p>
						</div>
					)}
					{sessionData.sessionFeedback && (
						<div className="border-b border-gray-600 pb-4">
							<h3 className="text-gray-400 text-sm mb-2">
								Summary of feedbacks
							</h3>
							<p className="text-gray-300 leading-relaxed">
								{sessionData.sessionFeedback}
							</p>
						</div>
					)}
				</>
			)}
			{sessionData.assignments && sessionData.assignments.length > 0 && (
				<details className="border-b border-gray-600 pb-4">
					<summary className="cursor-pointer text-gray-400 text-sm mb-2 outline-none focus:ring-2 focus:ring-blue-400">
						Assignments
					</summary>
					<div className="space-y-3 mt-2">
						{sessionData.assignments.map((assignment, idx) => (
							<div
								key={idx}
								className="bg-gray-800 rounded-md p-4 shadow border border-gray-700"
							>
								<h4 className="text-lg font-semibold text-white mb-1">
									{assignment.title}
								</h4>
								<p className="text-gray-300 mb-2">
									{assignment.description}
								</p>
								<p className="text-gray-400 text-sm">
									<span className="font-medium">
										Due Date:
									</span>{" "}
									{assignment.dueDate
										? new Date(
												assignment.dueDate
										  ).toLocaleDateString()
										: "N/A"}
								</p>
							</div>
						))}
					</div>
				</details>
			)}

			{/* Uploaded Materials (for all roles) */}
			{/* {sessionData.materials && (
                <div className="border-b border-gray-600 pb-4">
                    <h3 className="text-gray-400 text-sm mb-2">
                        Uploaded Materials
                    </h3>
                    <div className="space-y-1">
                        {sessionData.materials.map((material, index) => (
                            <p>
                                <a
                                    key={index}
                                    target="_blank"
                                    className="text-md"
                                    href={`//${material?.link}`}
                                >
                                    {`Material ${index+1}`}
                                </a>
                            </p>
                        ))}
                    </div>
                </div>
            )} */}
		</>
	);
};
