import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const Column = ({ columnId, title, tasks,refetchTasks }) => {
  console.log(`🧱 Rendering column ${columnId} with ${tasks.length} tasks`);

  return (
    <div className="column">
      <h2>{title} ({tasks.length})</h2>
      <Droppable
        droppableId={columnId}
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided) => (
          <div
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                if (!task || !task._id) {
                  console.warn("❌ Skipping invalid task:", task);
                  return null;
                }
                console.log("🔍 Task being passed to TaskCard:", task);

                return  <TaskCard key={task._id} task={task} index={index} 
                status={columnId} refetchTasks={refetchTasks} />
              })
            ) : (
              <p className="empty-message">No tasks</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
