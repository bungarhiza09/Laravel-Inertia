import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";

export default function CreatePage() {
    const { auth } = usePage().props; // opsional, jika ingin menampilkan info user
    const [form, setForm] = useState({
        title: "",
        description: "",
        cover: null,
    });

    const [errors, setErrors] = useState({});

    const submit = (e) => {
        e.preventDefault();

        // Kirim form ke Laravel
        router.post("/todos/store", form, {
            forceFormData: true, // agar file bisa terkirim
            onError: (err) => setErrors(err),
            onSuccess: () => {
                setForm({ title: "", description: "", cover: null });
            },
        });
    };

    return (
        <AppLayout title="Tambah Todo">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Tambah Todo</h2>

                <form onSubmit={submit} className="space-y-6">

                    {/* Title */}
                    <div>
                        <label className="font-semibold block mb-1">Judul</label>
                        <input
                            type="text"
                            placeholder="Masukkan judul todo..."
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="font-semibold block mb-1">Deskripsi</label>
                        <textarea
                            placeholder="Masukkan deskripsi..."
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Cover */}
                    <div>
                        <label className="font-semibold block mb-1">Cover (opsional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onChange={(e) =>
                                setForm({ ...form, cover: e.target.files[0] })
                            }
                        />
                        {errors.cover && (
                            <p className="text-red-500 text-sm mt-1">{errors.cover}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition"
                    >
                        Simpan
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
