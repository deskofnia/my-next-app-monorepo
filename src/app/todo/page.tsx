
import { getTodos } from "@/lib/todo-db";
import TodoForm from "./todo-form";
import TodoItem from "./todo-item";

export default async function TodoPage() {
    const { todos, results } = await getTodos();

    const data = JSON.parse(JSON.stringify(todos))

    return (
        <div className="container mx-auto max-w-md p-4">
            <TodoForm />
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>
            {results === 0 ? (
                <p className="text-center">No Todos Found</p>
            ) : (
                    data?.map((todo: any) => (
                    <TodoItem key={todo._id} todo={todo} />
                ))
            )}
        </div>
    );
}
