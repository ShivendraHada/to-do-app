"use client";

import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TaskCard";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";

interface TaskColumnProps {
  id: TypedColumn;
  todos: Todo[];
  index: number;
}

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  TODO: "To Do",
  INPROGRESS: "In Progress",
  DONE: "Done",
};

function TaskColumn({ id, todos, index }: TaskColumnProps) {
  const [searchString, setNewTaskType] = useBoardStore((state) => [
    state.searchString,
    state.setNewTaskType,
  ]);
  const openModal = useModalStore((state) => state.openModal);

  const handleAddTodo = () => {
    setNewTaskType(id);
    openModal();
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`px-3 pt-1 pb-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-black/10"
                }`}
              >
                <h2 className="flex justify-between font-bold text-xl p-2">
                  {idToColumnText[id]}
                  <span className="text-gray-500 bg-gray-200 rounded-full px-2.5 py-1 text-sm font-normal">
                    {!searchString
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ).length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (
                      searchString &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    )
                      return null;

                    return (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}
                      >
                        {(provided) => (
                          <TodoCard
                            key={todo.$id}
                            id={id}
                            todo={todo}
                            index={index}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}

                  <div className="flex items-end justify-center">
                    <button
                      aria-label="Add"
                      onClick={handleAddTodo}
                      className="text-green-500 hover:text-green-600"
                    >
                      <PlusCircleIcon className="h-10 w-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default TaskColumn;
