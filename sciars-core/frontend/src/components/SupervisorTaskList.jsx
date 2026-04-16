import IssueCard from "./IssueCard";

const SupervisorTaskList = () => {
  const tasks = [
    { id: 1, category: "Infrastructure", description: "Large pothole causing traffic hazards near the intersection of Main St and Oak Ave. Multiple complaints from residents.", status: "Open", location: "123 Main St, Downtown" },
    { id: 2, category: "Utilities", description: "Street light not working for the past week. Area becomes very dark at night causing safety concerns.", status: "In Progress", location: "456 Oak Avenue" },
    { id: 3, category: "Sanitation", description: "Garbage bins overflowing and waste scattered around the public park entrance.", status: "Open", location: "Central Park, Block 5" },
    { id: 4, category: "Safety", description: "Broken playground equipment needs immediate attention. Sharp edges exposed.", status: "In Progress", location: "789 Community Center" },
    { id: 5, category: "Transportation", description: "Traffic signal malfunction causing confusion at the busy intersection.", status: "Resolved", location: "12th Ave & Market St" },
    { id: 6, category: "Environment", description: "Illegal dumping of construction waste in the vacant lot.", status: "Open", location: "Industrial Zone, Lot 4" },
  ];

  const handleStartWork = (taskId) => {
    console.log(`Starting work on task ${taskId}`);
  };

  const handleMarkResolved = (taskId) => {
    console.log(`Marking task ${taskId} as resolved`);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <IssueCard
            category={task.category}
            description={task.description}
            status={task.status}
            location={task.location}
          />
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
            {task.status === "Open" && (
              <button
                onClick={() => handleStartWork(task.id)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Work
              </button>
            )}
            {task.status === "In Progress" && (
              <button
                onClick={() => handleMarkResolved(task.id)}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark Resolved
              </button>
            )}
            {task.status === "Resolved" && (
              <span className="flex-1 text-center text-sm text-green-600 font-medium py-2">
                Completed
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupervisorTaskList;
