<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\SharedNote;
use Illuminate\Http\Request;

class ShareController extends Controller
{
    /**
     * Create a share link for a note
     */
    public function createShare(Request $request, $noteId)
    {
        $user = $request->user();
        $note = Note::where('id', $noteId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        // Check if share already exists
        $existingShare = SharedNote::where('note_id', $note->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingShare) {
            return response()->json([
                'share_token' => $existingShare->share_token,
                'message' => 'تم استرجاع رابط المشاركة الموجود',
            ]);
        }

        // Create new share
        $sharedNote = SharedNote::create([
            'note_id' => $note->id,
            'user_id' => $user->id,
            'share_token' => SharedNote::generateToken(),
        ]);

        return response()->json([
            'share_token' => $sharedNote->share_token,
            'message' => 'تم إنشاء رابط المشاركة بنجاح',
        ], 201);
    }

    /**
     * Get a shared note by token (public - no auth required)
     */
    public function getSharedNote($token)
    {
        $sharedNote = SharedNote::where('share_token', $token)
            ->with(['note', 'user:id,username'])
            ->firstOrFail();

        return response()->json([
            'note' => [
                'id' => $sharedNote->note->id,
                'title' => $sharedNote->note->title,
                'content' => $sharedNote->note->content,
                'blocks' => $sharedNote->note->blocks,
                'date' => $sharedNote->note->date,
                'comments' => $sharedNote->note->comments,
            ],
            'shared_by' => $sharedNote->user->username,
            'shared_at' => $sharedNote->created_at->format('Y/m/d'),
        ]);
    }

    /**
     * Import a shared note to user's account
     */
    public function importSharedNote(Request $request, $token)
    {
        $user = $request->user();
        
        $sharedNote = SharedNote::where('share_token', $token)
            ->with('note')
            ->firstOrFail();

        // Don't allow importing own note
        if ($sharedNote->user_id === $user->id) {
            return response()->json([
                'message' => 'هذه الملاحظة ملكك بالفعل',
                'error' => 'Cannot import own note'
            ], 400);
        }

        // Create a copy of the note for the user (including comments)
        $newNote = Note::create([
            'user_id' => $user->id,
            'title' => $sharedNote->note->title,
            'content' => $sharedNote->note->content,
            'blocks' => $sharedNote->note->blocks,
            'date' => now()->toDateString(),
            'comments' => $sharedNote->note->comments ?? [],
        ]);

        return response()->json([
            'message' => 'تم إضافة الملاحظة إلى حسابك بنجاح',
            'note' => [
                'id' => $newNote->id,
                'title' => $newNote->title,
                'content' => $newNote->content,
                'blocks' => $newNote->blocks,
                'date' => $newNote->date,
                'comments' => $newNote->comments,
            ],
        ], 201);
    }

    /**
     * Delete a share link
     */
    public function deleteShare(Request $request, $noteId)
    {
        $user = $request->user();
        
        $deleted = SharedNote::where('note_id', $noteId)
            ->where('user_id', $user->id)
            ->delete();

        if ($deleted) {
            return response()->json([
                'message' => 'تم حذف رابط المشاركة بنجاح',
            ]);
        }

        return response()->json([
            'message' => 'لا يوجد رابط مشاركة لهذه الملاحظة',
        ], 404);
    }
}
