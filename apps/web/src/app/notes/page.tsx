'use client';

import React, { useState } from 'react';
import LayoutShell from '@/components/layout-shell';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService, subjectService, aiService } from '@/services/api-service';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  Search,
  Plus,
  Pin,
  Trash2,
  FolderOpen,
  Save,
  Sparkles,
  FileText,
  Brain,
  HelpCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function NotesPage() {
  const queryClient = useQueryClient();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');

  // Editor State (for the active selected note)
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorFolder, setEditorFolder] = useState('General');
  const [editorTags, setEditorTags] = useState('');

  // AI Modal States
  const [aiModalType, setAiModalType] = useState<'summary' | 'flashcards' | 'quiz' | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Queries
  const { data: notes = [], isLoading: loadingNotes } = useQuery({
    queryKey: ['notes'],
    queryFn: noteService.list,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.list,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: noteService.create,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNoteId(newNote.id);
      setEditorTitle(newNote.title);
      setEditorContent(newNote.content);
      setEditorFolder(newNote.folder_name);
      setEditorTags(newNote.tags.join(', '));
      toast.success('Note created!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => noteService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note saved successfully!');
    },
    onError: () => {
      toast.error('Failed to save note');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: noteService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNoteId(null);
      toast.success('Note deleted');
    },
  });

  const handleCreateNote = () => {
    createMutation.mutate({
      title: 'Untitled Note',
      content: '',
      folder_name: selectedFolder === 'All' ? 'General' : selectedFolder,
      tags: [],
    });
  };

  const handleSelectNote = (note: any) => {
    setSelectedNoteId(note.id);
    setEditorTitle(note.title);
    setEditorContent(note.content);
    setEditorFolder(note.folder_name);
    setEditorTags(note.tags.join(', '));
  };

  const handleSaveNote = () => {
    if (!selectedNoteId) return;
    const tagArray = editorTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    updateMutation.mutate({
      id: selectedNoteId,
      data: {
        title: editorTitle,
        content: editorContent,
        folder_name: editorFolder,
        tags: tagArray,
      },
    });
  };

  const handlePinNote = (noteId: string, currentPin: boolean) => {
    updateMutation.mutate({
      id: noteId,
      data: { is_pinned: !currentPin },
    });
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate(noteId);
    }
  };

  // AI Actions
  const triggerAiAction = async (type: 'summary' | 'flashcards' | 'quiz') => {
    if (!selectedNoteId) return;
    setAiModalType(type);
    setAiLoading(true);
    setAiResult(null);

    try {
      if (type === 'summary') {
        const res = await aiService.summarizeNote({ note_id: selectedNoteId });
        setAiResult(res);
      } else if (type === 'flashcards') {
        const res = await aiService.generateFlashcards({ note_id: selectedNoteId });
        setAiResult(res.flashcards);
      } else if (type === 'quiz') {
        const res = await aiService.generateQuiz({ note_id: selectedNoteId, difficulty: 'medium' });
        setAiResult(res.quiz);
      }
    } catch (err) {
      toast.error('AI generation failed. Please check note content.');
      setAiModalType(null);
    } finally {
      setAiLoading(false);
    }
  };

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = selectedFolder === 'All' || note.folder_name === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  // Unique folders list
  const folders = ['All', ...Array.from(new Set(notes.map((n) => n.folder_name)))];

  return (
    <LayoutShell>
      <div className="h-[calc(100vh-8.5rem)] flex gap-6 pb-2">
        {/* Left Side: Folders & Notes List */}
        <div className="w-80 shrink-0 flex flex-col gap-4 h-full">
          {/* Create & Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-550" />
              <Input
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-900/50 border-white/5 text-white rounded-xl placeholder:text-slate-500 text-xs"
              />
            </div>
            <Button
              onClick={handleCreateNote}
              className="bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white rounded-xl h-10 w-10 p-0 shrink-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Folder Filter Scroll */}
          <div className="flex gap-2 pb-1 overflow-x-auto shrink-0">
            {folders.map((folder) => (
              <Button
                key={folder}
                variant={selectedFolder === folder ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFolder(folder)}
                className={`rounded-xl text-xs shrink-0 px-3.5 py-1.5 h-8 ${
                  selectedFolder === folder
                    ? 'bg-primary text-white'
                    : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5 mr-1" />
                {folder}
              </Button>
            ))}
          </div>

          {/* Notes List Scroll Area */}
          <ScrollArea className="flex-1 bg-slate-900/20 border border-white/5 rounded-2xl p-4">
            <div className="space-y-3">
              {loadingNotes ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="p-3 bg-slate-900/40 rounded-xl space-y-2 animate-pulse">
                    <div className="h-4 w-24 bg-slate-800 rounded" />
                    <div className="h-3 w-40 bg-slate-850 rounded" />
                  </div>
                ))
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No notes found. Click the "+" button to create one.
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-1.5 relative group ${
                      selectedNoteId === note.id
                        ? 'bg-primary/10 border-primary text-white shadow-md'
                        : 'bg-slate-900/40 border-white/5 hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-bold text-xs truncate max-w-[150px]">{note.title || 'Untitled Note'}</span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePinNote(note.id, note.is_pinned);
                          }}
                          className={`hover:scale-105 transition-colors p-0.5 rounded ${
                            note.is_pinned ? 'text-primary' : 'text-slate-500 hover:text-white'
                          }`}
                        >
                          <Pin className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                      {note.content || 'Empty note content...'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge variant="secondary" className="text-[8px] bg-slate-800 text-slate-400 py-0 px-1.5 h-4.5 rounded">
                        {note.folder_name}
                      </Badge>
                      {note.tags.slice(0, 2).map((t, idx) => (
                        <Badge key={idx} className="text-[8px] bg-primary/20 text-primary py-0 px-1.5 h-4.5 rounded">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side: Active Note Editor */}
        <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col overflow-hidden relative">
          {selectedNoteId ? (
            <>
              {/* Editor Header / Toolbars */}
              <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/20 shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={() => triggerAiAction('summary')}
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:bg-primary/10 hover:text-primary text-slate-300 rounded-xl text-xs gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    AI Summary
                  </Button>
                  <Button
                    onClick={() => triggerAiAction('flashcards')}
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:bg-accent/10 hover:text-accent text-slate-300 rounded-xl text-xs gap-1.5"
                  >
                    <Brain className="h-3.5 w-3.5 text-accent" />
                    Flashcards
                  </Button>
                  <Button
                    onClick={() => triggerAiAction('quiz')}
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:bg-success/10 hover:text-success text-slate-300 rounded-xl text-xs gap-1.5"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-success" />
                    AI Quiz
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveNote}
                    disabled={updateMutation.isPending}
                    size="sm"
                    className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-xs gap-1.5"
                  >
                    {updateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Save Note
                  </Button>
                  <Button
                    onClick={() => handleDeleteNote(selectedNoteId)}
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:bg-error/15 text-slate-400 hover:text-error rounded-xl h-8 px-3.5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Note Details Inputs */}
              <div className="p-6 space-y-4 border-b border-white/5 bg-slate-950/15 shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5 text-left">
                  <Label htmlFor="noteTitle" className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Note Title</Label>
                  <Input
                    id="noteTitle"
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    className="bg-transparent border-none text-lg font-bold text-white px-0 py-1 focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="noteFolder" className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Folder</Label>
                  <Input
                    id="noteFolder"
                    value={editorFolder}
                    onChange={(e) => setEditorFolder(e.target.value)}
                    className="bg-slate-950/40 border-white/10 text-white rounded-xl h-9 text-xs"
                  />
                </div>
                <div className="sm:col-span-3 space-y-1.5 text-left">
                  <Label htmlFor="noteTags" className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Tags (comma-separated)</Label>
                  <Input
                    id="noteTags"
                    placeholder="e.g. quantum, physics, midterm"
                    value={editorTags}
                    onChange={(e) => setEditorTags(e.target.value)}
                    className="bg-slate-950/40 border-white/10 text-white rounded-xl h-9 text-xs"
                  />
                </div>
              </div>

              {/* Editor Textarea */}
              <div className="flex-1 p-6">
                <Textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  placeholder="Start writing note content..."
                  className="w-full h-full min-h-[250px] bg-transparent border-none resize-none text-sm text-slate-200 focus-visible:ring-0 focus-visible:border-none px-0 py-0 focus-visible:outline-none focus:outline-none focus:ring-0"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 text-slate-500">
              <div className="h-16 w-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400">
                <FileText className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-semibold text-sm">No note selected</p>
                <p className="text-xs text-slate-405 max-w-xs">
                  Create a new document or choose a note from the left sidebar to start editing.
                </p>
              </div>
              <Button onClick={handleCreateNote} className="bg-primary hover:bg-primary/95 text-white rounded-xl text-xs">
                Create First Note
              </Button>
            </div>
          )}
        </div>

        {/* AI Action Results Modal Dialog */}
        <Dialog open={!!aiModalType} onOpenChange={() => setAiModalType(null)}>
          <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
            <div className="p-6 border-b border-white/5 shrink-0 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-bold text-lg text-white">
                {aiModalType === 'summary' && 'AI Note Summary'}
                {aiModalType === 'flashcards' && 'AI Active Flashcards'}
                {aiModalType === 'quiz' && 'AI Quiz Playground'}
              </span>
            </div>

            <ScrollArea className="flex-1 p-6 overflow-y-auto">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-xs text-slate-400">Thinking... Parsing notes content</p>
                </div>
              ) : aiResult ? (
                <div className="space-y-6 text-left">
                  {/* SUMMARY RENDER */}
                  {aiModalType === 'summary' && (
                    <div className="space-y-4 text-xs leading-relaxed text-slate-350">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <h4 className="font-bold text-white text-sm mb-1.5">Overview</h4>
                        <p>{aiResult.short_summary}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <h4 className="font-bold text-white text-sm mb-1.5">Detailed Summary</h4>
                        <p>{aiResult.detailed_summary}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <h4 className="font-bold text-white text-sm mb-1.5">Key Points</h4>
                        <ul className="list-disc pl-4 space-y-1 mt-1">
                          {aiResult.key_points?.map((pt: string, idx: number) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                      {aiResult.important_definitions && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <h4 className="font-bold text-white text-sm mb-1.5">Definitions</h4>
                          <div className="space-y-2 mt-1">
                            {Object.entries(aiResult.important_definitions).map(([k, v]: any) => (
                              <p key={k}>
                                <strong className="text-white">{k}:</strong> {v}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* FLASHCARDS RENDER */}
                  {aiModalType === 'flashcards' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {aiResult.map((card: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-slate-950/40 border border-white/5 space-y-3 min-h-[120px] flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-[9px] font-bold text-primary tracking-wider uppercase">Q. {idx + 1}</span>
                            <p className="text-xs font-semibold text-white mt-1">{card.front}</p>
                          </div>
                          <div className="pt-2.5 border-t border-white/5 mt-auto">
                            <span className="text-[8px] font-bold text-success uppercase">Answer</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{card.back}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* QUIZ RENDER */}
                  {aiModalType === 'quiz' && (
                    <div className="space-y-6">
                      {aiResult.map((q: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-950/40 border border-white/5 space-y-4">
                          <p className="text-xs font-semibold text-white">
                            <span className="text-primary mr-1">Q{idx + 1}:</span> {q.question}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options?.map((opt: string, oIdx: number) => {
                              const isCorrect = opt === q.correct_answer;
                              return (
                                <div
                                  key={oIdx}
                                  className={`p-3 rounded-xl border text-xs font-medium text-left flex justify-between items-center ${
                                    isCorrect
                                      ? 'bg-success/15 border-success/35 text-success'
                                      : 'bg-white/5 border-white/5 text-slate-350'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isCorrect && <CheckCircle className="h-4 w-4 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Failed to fetch AI resources. Check note contents and API configurations.
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </LayoutShell>
  );
}
