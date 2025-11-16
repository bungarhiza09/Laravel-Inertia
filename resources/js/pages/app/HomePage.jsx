import React from "react";
import AppLayout from "@/layouts/AppLayout";
import { usePage, Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function HomePage() {
    const { auth, todos } = usePage().props;

    // Toggle status selesai/belum
    const toggleStatus = (id) => {
        router.put(`/todos/${id}/toggle`);
    };

    // Hapus todo dengan konfirmasi
    const deleteTodo = (id) => {
        Swal.fire({
            title: "Hapus?",
            text: "Apakah Anda yakin ingin menghapus todo ini?",
            icon: "warning",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/todos/${id}`);
            }
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">
                            <span dangerouslySetInnerHTML={{ __html: "&#128075;" }} />
                            Hai, {auth.name}!
                        </h1>
                        <p className="text-lg text-gray-600">
                            Berikut adalah aktivitas todo kamu:
                        </p>
                        <Link
                            href="/todos/create"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-4"
                        >
                            Tambah Todo
                        </Link>
                    </div>

                    {/* Daftar Todo */}
                    <div>
                        {todos && todos.length > 0 ? (
                            <ul className="space-y-4">
                                {todos.map((todo) => (
                                    <li
                                        key={todo.id}
                                        className="p-4 border rounded flex justify-between items-center"
                                    >
                                        <div>
                                            <h3
                                                className={`font-medium ${
                                                    todo.is_finished
                                                        ? "line-through text-gray-400"
                                                        : ""
                                                }`}
                                            >
                                                {todo.title}
                                            </h3>
                                            {todo.description && (
                                                <p className="text-gray-500 text-sm">
                                                    {todo.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {/* Toggle Status */}
                                            <button
                                                className={`px-2 py-1 rounded text-white ${
                                                    todo.is_finished
                                                        ? "bg-green-500"
                                                        : "bg-yellow-500"
                                                }`}
                                                onClick={() => toggleStatus(todo.id)}
                                            >
                                                {todo.is_finished ? "Selesai" : "Belum"}
                                            </button>

                                            {/* Edit Todo */}
                                            <Link
                                                href={`/todos/${todo.id}/edit`}
                                                className="px-2 py-1 bg-blue-500 text-white rounded"
                                            >
                                                Edit
                                            </Link>

                                            {/* Hapus Todo */}
                                            <button
                                                className="px-2 py-1 bg-red-500 text-white rounded"
                                                onClick={() => deleteTodo(todo.id)}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Belum ada todo dibuat.</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
