import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/utils/getTodosGroupedByColumn";
import uploadImage from "@/utils/uploadImage";
import { create } from "zustand";

interface BoardStore {
  // Default state
  board: Board;
  newTaskInput: string;
  searchString: string;
  newTaskType: TypedColumn;
  image: File | null;

  // Add Data
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;

  // Get Data
  getBoard: () => void;

  // Set Data
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setSearchString: (searchString: string) => void;
  setImage: (image: File | null) => void;

  // Delete Data
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  // Default state
  searchString: "",
  newTaskInput: "",
  newTaskType: "TODO",
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  image: null,

  // Add Data
  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });
    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  // Get Data
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  // Set Data
  setBoardState: (board: Board) => {
    set({ board });
  },
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  updateTodoInDB: async (todo: Todo, columnId: TypedColumn) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      { title: todo.title, status: columnId }
    );
  },
  setImage: (image: File | null) => set({ image }),
  setSearchString: (searchString: string) => set({ searchString }),

  // Delete Data
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    // delete todoId from new COlumns
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
}));
