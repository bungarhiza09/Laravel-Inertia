import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";

export default function EditPage() {
    const { todo } = usePage().props;

    const [form, setForm] = useState({
        title: todo.title,
        description: todo.description ?? "",
        cover: null,
        is_finished: todo.is_finished,
    });

    const [errors, setErrors] = useState({});

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("is_finished", form.is_finished ? 1 : 0);
        if (form.cover) formData.append("cover", form.cover);

        // Gunakan POST + _method=PUT untuk Laravel menerima file
        formData.append("_method", "PUT");

        router.post(`/todos/${todo.id}/update`, formData, {
            onSuccess: () => {
                router.get("/todos");
            },
            onError: (err) => setErrors(err),
        });
    };

    return (
        <AppLayout title="Edit Todo">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Edit Todo</h2>

                <form onSubmit={submit} className="space-y-6">

                    {/* Title */}
                    <div>
                        <label className="font-semibold block mb-1">Judul</label>
                        <input
                            type="text"
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="font-semibold block mb-1">Deskripsi</label>
                        <textarea
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.is_finished}
                            onChange={(e) => setForm({ ...form, is_finished: e.target.checked })}
                            className="accent-green-400"
                        />
                        <label>Selesai</label>
                    </div>

                    {/* Cover */}
                    <div>
                        <label className="font-semibold block mb-1">Cover Saat Ini:</label>
                        <div className="my-2">
                            {todo.cover ? (
                                <img
                                    src={`/storage/${todo.cover}`}
                                    alt="cover"
                                    className="w-32 h-32 object-cover rounded border"
                                />
                            ) : (
                                <p className="text-gray-500">Tidak ada cover</p>
                            )}
                        </div>

                        <input
                            type="file"
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onChange={(e) => setForm({ ...form, cover: e.target.files[0] })}
                        />
                        {errors.cover && <p className="text-red-500 text-sm mt-1">{errors.cover}</p>}
                    </div>

                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full transition">
                        Update
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
