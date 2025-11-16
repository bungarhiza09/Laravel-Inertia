import React, { useEffect } from "react";
import ApexCharts from "apexcharts";
import { Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import AppLayout from "@/layouts/AppLayout";

export default function IndexPage() {
    const { todos, filters, flash, auth, totalTodos, finishedCount, unfinishedCount, chartData } = usePage().props;
    const [search, setSearch] = React.useState(filters.search || "");
    const [statusFilter, setStatusFilter] = React.useState(filters.status || "all");

    if (flash?.success) {
        Swal.fire("Berhasil", flash.success, "success");
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Hapus?",
            text: "Anda yakin ingin menghapus todo ini?",
            icon: "warning",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/todos/${id}`);
            }
        });
    };

    // Chart Pie
    useEffect(() => {
        const options = {
            chart: { type: 'pie', height: 300 },
            series: chartData.series,
            labels: chartData.labels,
            colors: ['#a8e6cf', '#ffb3b3'],
            legend: { position: 'bottom' },
            responsive: [{ breakpoint: 480, options: { chart: { height: 250 }, legend: { position: 'bottom' } } }]
        };

        const chart = new ApexCharts(document.querySelector("#todo-status-chart"), options);
        chart.render();

        return () => chart.destroy();
    }, [chartData]);

    return (
        <AppLayout title="Todos">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
                
                {/* Header Selamat Datang */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Hai, {auth?.name || "User"} 👋</h2>

                    {/* Summary Card */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-100 p-4 rounded text-center">
                            <h6>Total Task</h6>
                            <p className="text-xl font-bold">{totalTodos}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded text-center">
                            <h6>Selesai</h6>
                            <p className="text-xl font-bold">{finishedCount}</p>
                        </div>
                        <div className="bg-red-100 p-4 rounded text-center">
                            <h6>Belum Selesai</h6>
                            <p className="text-xl font-bold">{unfinishedCount}</p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h5 className="mb-3 text-center font-semibold">Statistik Todo Berdasarkan Status</h5>
                        <div id="todo-status-chart"></div>
                    </div>
                </div>

                {/* Filter & Search */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        router.get("/todos", { search, status: statusFilter }, { preserveState: true });
                    }}
                    className="flex flex-wrap gap-2"
                >
                    <input
                        type="text"
                        placeholder="Cari todo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 flex-1 rounded"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="all">Semua</option>
                        <option value="finished">Selesai</option>
                        <option value="unfinished">Belum Selesai</option>
                    </select>
                    <button type="submit" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">Cari / Filter</button>
                    <Link
                        href="/todos/create"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
                    >
                        Tambah Todo
                    </Link>
                </form>

                {/* Table */}
                <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg shadow-inner">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-indigo-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-gray-700 w-1/6">Judul</th>
                                <th className="py-3 px-4 text-left text-gray-700 w-1/4">Deskripsi</th>
                                <th className="py-3 px-4 text-center text-gray-700 w-1/6">Cover</th>
                                <th className="py-3 px-4 text-center text-gray-700 w-1/5">Status</th>
                                <th className="py-3 px-4 text-center text-gray-700 w-1/6">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todos.data.length > 0 ? (
                                todos.data.map((todo) => (
                                    <tr key={todo.id} className="hover:bg-indigo-50 transition text-center">
                                        <td className="py-2 px-4 w-1/6">{todo.title}</td>
                                        <td className="py-2 px-4 w-1/4">{todo.description}</td>
                                        <td className="py-2 px-4 w-1/6">
                                            {todo.cover ? (
                                                <img src={todo.cover} alt={todo.title} className="w-24 h-24 object-cover mx-auto rounded-md" />
                                            ) : (
                                                <span className="text-gray-400">Tidak ada</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 w-1/5">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${todo.is_finished ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                                                {todo.is_finished ? "Selesai" : "Belum Selesai"}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 flex gap-2 justify-center">
                                          <Link
                                              className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 transition text-sm"
                                              href={`/todos/${todo.id}/edit`}
                                          >
                                              Edit
                                          </Link>
                                          <button
                                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                                              onClick={() => handleDelete(todo.id)}
                                          >
                                              Hapus
                                          </button>
                                      </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-gray-500">
                                        Belum ada todo dibuat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex gap-2 justify-center flex-wrap">
                    {todos.links.map((link, idx) => {
                        let label = link.label;
                        if (link.label === 'pagination.previous') label = '<<';
                        if (link.label === 'pagination.next') label = '>>';
                        return (
                            <Link
                                key={idx}
                                className={`px-3 py-1 border rounded ${link.active ? "bg-gray-800 text-white" : "hover:bg-gray-200"}`}
                                href={link.url || ""}
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
