"use client";

import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import TaskColumn from "./TaskColumn";
function Board() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // Check if user dragged card outside of board
    if (!destination) return;

    // Handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({ ...board, columns: rearrangedColumns });
    }

    // Handle task drag
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    // Check if start and finish column are empty
    if (!startCol || !finishCol) return;

    // Check if dropped on same column
    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // Same column task drag
      newTodos.splice(destination.index, 0, todoMoved);

      const newCol = { id: startCol.id, todos: newTodos };
      const newColumns = new Map(board.columns);

      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      // dragging to another column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);
      const newCol = { id: startCol.id, todos: newTodos };
      const newColumns = new Map(board.columns);

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      // Update the DB
      updateTodoInDB(todoMoved, finishCol.id);

      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl sm:mx-auto m-2 mb-10"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <TaskColumn key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
