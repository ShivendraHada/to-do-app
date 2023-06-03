interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "TODO" | "INPROGRESS" | "DONE";

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  status: string;
  image?: Image;
}

interface Image {
  bucketId: string;
  fileId: string;
}

interface TaskType {
  id: string;
  name: string;
  description: string;
  color: string;
}
