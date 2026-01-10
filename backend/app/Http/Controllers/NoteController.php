<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    /**
     * Get all notes for the authenticated user.
     */
    public function index()
    {
        $notes = Note::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($note) {
                // Ensure comments is always an object, not null
                if ($note->comments === null) {
                    $note->comments = [];
                }
                return $note;
            });

        return response()->json($notes);
    }

    /**
     * Store a newly created note.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'blocks' => 'required|array',
        ]);

        $content = $request->content;
        if (!$content && !empty($request->blocks) && !empty($request->blocks[0]) && !empty($request->blocks[0][0])) {
            $content = $request->blocks[0][0]['content'] ?? '';
        }

        $note = Note::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'content' => $content ?? '',
            'blocks' => $request->blocks,
            'comments' => $request->comments ?? [],
            'date' => $request->date ?? now()->toDateString(),
        ]);

        // Ensure comments is always an object
        if ($note->comments === null) {
            $note->comments = [];
        }

        return response()->json($note, 201);
    }

    /**
     * Update the specified note.
     */
    public function update(Request $request, $id)
    {
        $note = Note::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'blocks' => 'sometimes|required|array',
            'comments' => 'sometimes|array',
        ]);

        $note->update([
            'title' => $request->input('title', $note->title),
            'content' => $request->input('content', $note->content),
            'blocks' => $request->input('blocks', $note->blocks),
            'comments' => $request->input('comments', $note->comments ?? []),
        ]);

        // Ensure comments is always an object
        if ($note->comments === null) {
            $note->comments = [];
        }

        return response()->json($note);
    }

    /**
     * Remove the specified note.
     */
    public function destroy($id)
    {
        $note = Note::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully']);
    }
}
