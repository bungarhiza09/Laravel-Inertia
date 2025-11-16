<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TodoController extends Controller
{
    /**
     * Menampilkan semua todo (dengan search & pagination)
     */
    public function index()
{
    $search = request()->input('search');
    $status = request()->input('status');

    // Query utama untuk tabel (paginate)
    $query = Todo::where('user_id', Auth::id());

    if ($search) {
        $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($search) . '%'])
              ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    if ($status && $status !== 'all') {
        $query->where('is_finished', $status === 'finished');
    }

    $todos = $query->paginate(20)->through(function($todo){
        return [
            'id' => $todo->id,
            'title' => $todo->title,
            'description' => $todo->description,
            'cover' => $todo->cover ? asset('storage/'.$todo->cover) : null,
            'is_finished' => $todo->is_finished,
        ];
    });

    // Ambil semua todos user untuk kartu dan chart
    $allTodos = Todo::where('user_id', Auth::id())->get();
    $totalTodos = $allTodos->count();
    $finishedCount = $allTodos->where('is_finished', true)->count();
    $unfinishedCount = $allTodos->where('is_finished', false)->count();

    $chartData = [
        'series' => [$finishedCount, $unfinishedCount],
        'labels' => ['Selesai', 'Belum Selesai']
    ];

    return Inertia::render('app/todos/IndexPage', [
    'todos' => $todos,
    'filters' => request()->only('search','status'),
    'flash' => session()->all(),
    'auth' => Auth::user(),
    'totalTodos' => $totalTodos,
    'finishedCount' => $finishedCount,
    'unfinishedCount' => $unfinishedCount,
    'chartData' => $chartData
]);

}

    /**
     * Halaman tambah data
     */
    public function create()
    {
        return Inertia::render('app/todos/CreatePage');
    }

    /**
     * Simpan data todo
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('cover')) {
            $data['cover'] = $request->file('cover')->store('todos', 'public');
        }

        $data['user_id'] = Auth::id(); // <- ini penting

        $todo = Todo::create($data);

        return redirect()->route('todos.index')->with('success', 'Todo berhasil dibuat!');
    }

    /**
     * Halaman edit
     */
    public function edit($id)
    {
        $todo = Todo::where('user_id', Auth::id())->findOrFail($id);

        return Inertia::render('app/todos/EditPage', [
            'todo' => $todo
        ]);
    }

   /**
     * Update data todo
     */
    public function update(Request $request, $id)
    {
        $todo = Todo::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'title' => 'required|min:3',
            'description' => 'nullable',
            'cover' => 'nullable|image|max:2048',
            'is_finished' => 'nullable|boolean', // <-- tambahkan ini
        ]);

        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('todos', 'public'); // folder sama seperti store
            $todo->cover = $coverPath;
        }

        $todo->title = $request->title;
        $todo->description = $request->description;
        $todo->is_finished = $request->input('is_finished', false); // <-- simpan status
        $todo->save();

        return redirect()->route('todos.index')->with('success', 'Todo berhasil diperbarui');
    }

    /**
     * Mengubah status selesai
     */
    public function toggle($id)
    {
        $todo = Todo::where('user_id', Auth::id())->findOrFail($id);

        $todo->is_finished = !$todo->is_finished;
        $todo->save();

        return redirect()->back()->with('success', 'Status berhasil diubah');
    }

    /**
     * Hapus data todo
     */
    public function destroy($id)
    {
        $todo = Todo::where('user_id', Auth::id())->findOrFail($id);
        $todo->delete();

        return redirect()->back()->with('success', 'Todo berhasil dihapus');
    }
}
