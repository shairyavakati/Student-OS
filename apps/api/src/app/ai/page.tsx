'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import LayoutShell from '@/components/layout-shell';
import { useSearchParams } from 'next/navigation';
import { aiService } from '@/services/api-service';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  Brain,
  MessageSquare,
  Sparkles,
  FileText,
  Search,
  UploadCloud,
  Loader2,
  Calendar,
  Send,
  User,
  Compass,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Inner component that uses useSearchParams — must be wrapped in Suspense
function AiPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [activeTab, setActiveTab] = useState<'chat' | 'planner' | 'ocr' | 'search'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am your Nexora AI Companion. I can help summarize notes, plan study hours, index documents, or answer study questions. How can I help you today?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Study Planner State
  const [learningSpeed, setLearningSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [planLoading, setPlanLoading] = useState(false);

  // OCR State
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Semantic Search State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Run initial search if query parameter exists
  useEffect(() => {
    if (initialQuery) {
      setActiveTab('search');
      handleSemanticSearch(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Chat Submission
  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      setTimeout(() => {
        let answer = "I've searched your workspace. You have active material on this subject. Let me know if you'd like me to formulate a study block or quiz for you.";
        if (userMsg.toLowerCase().includes('quantum')) {
          answer = "Based on your 'Quantum Mechanics' notes: Wave-particle duality relates momentum (p) to wavelength (λ) via the relation λ = h/p. Louis de Broglie proposed this in 1924, and the Davisson-Germer experiment later verified it using electron diffraction.";
        } else if (userMsg.toLowerCase().includes('summary') || userMsg.toLowerCase().includes('summarize')) {
          answer = "To summarize a note, please open the 'Notes' workspace, select your note, and click 'AI Summary' in the editor panel for detailed breakdowns.";
        }
        setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
        setChatLoading(false);
      }, 1200);
    } catch (err) {
      toast.error('Failed to get AI response');
      setChatLoading(false);
    }
  };

  // Generate Study Plan
  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    try {
      const res = await aiService.generateStudyPlan(learningSpeed);
      setStudyPlan(res.daily_study_plan);
      toast.success('Study plan generated for current semester schedule!');
    } catch (err) {
      toast.error('Failed to generate study plan');
    } finally {
      setPlanLoading(false);
    }
  };

  // OCR Upload Handlers
  const handleOcrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOcrFile(e.target.files[0]);
      setOcrText('');
    }
  };

  const handleOcrSubmit = async () => {
    if (!ocrFile) return;
    setOcrLoading(true);
    try {
      const res = await aiService.runOCR(ocrFile);
      setOcrText(res.extracted_text);
      toast.success('Text extracted successfully!');
    } catch (err) {
      toast.error('OCR processing failed');
    } finally {
      setOcrLoading(false);
    }
  };

  // Semantic PGVector Search
  const handleSemanticSearch = async (queryVal: string) => {
    const term = queryVal || searchQuery;
    if (!term.trim()) return;
    setSearchLoading(true);
    try {
      const res = await aiService.semanticSearch(term);
      setSearchResults(res);
    } catch (err) {
      toast.error('Semantic search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <LayoutShell>
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            AI Study Workspace
          </h1>
          <p className="text-slate-400 text-sm">
            Leverage academic models, document OCR scanning, smart scheduling, and similarity searches.
          </p>
        </div>

        {/* Workspace Tab Filters */}
        <div className="flex border-b border-white/5 pb-px gap-4 overflow-x-auto">
          {[
            { id: 'chat', label: 'Chat Assistant', icon: MessageSquare },
            { id: 'planner', label: 'Study Planner', icon: Calendar },
            { id: 'ocr', label: 'Document OCR', icon: UploadCloud },
            { id: 'search', label: 'Semantic Search', icon: Search },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? 'border-primary text-white bg-gradient-to-t from-primary/5 to-transparent'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[50vh]">
          {/* 1. CHAT ASSISTANT */}
          {activeTab === 'chat' && (
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl flex flex-col h-[60vh] overflow-hidden">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 max-w-2xl text-xs leading-normal ${
                        msg.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'text-left'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border ${
                        msg.role === 'user' ? 'bg-primary/20 border-primary/30 text-white' : 'bg-slate-950/50 border-white/10 text-primary'
                      }`}>
                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                      </div>
                      <div className={`p-3.5 rounded-2xl max-w-lg ${
                        msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-950/50 border border-white/5 text-slate-300'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex gap-3 text-xs text-left">
                      <div className="h-8 w-8 rounded-lg bg-slate-950/50 border border-white/10 text-primary flex items-center justify-center">
                        <Brain className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-white/5 text-slate-400 flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        AI is digesting note links...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <form onSubmit={handleChatSend} className="p-4 border-t border-white/5 bg-slate-950/20 flex gap-2 shrink-0">
                <Input
                  placeholder="Ask a question about physics or summarize homework..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                  className="bg-slate-950/50 border-white/10 text-white rounded-xl placeholder:text-slate-500 text-xs focus-visible:ring-primary focus-visible:ring-1"
                />
                <Button type="submit" disabled={chatLoading} className="bg-primary hover:bg-primary/95 text-white rounded-xl px-4 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          )}

          {/* 2. STUDY PLANNER */}
          {activeTab === 'planner' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 h-fit space-y-5">
                <div>
                  <CardTitle className="text-base font-bold text-white">Generate Study Plan</CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-1">
                    Calculate dynamic study times mapped around your current classes and assignment deadlines.
                  </CardDescription>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-slate-300 text-xs font-semibold">Learning Velocity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['slow', 'medium', 'fast'] as const).map((speed) => (
                      <Button
                        key={speed}
                        type="button"
                        variant={learningSpeed === speed ? 'default' : 'outline'}
                        onClick={() => setLearningSpeed(speed)}
                        className={`rounded-xl capitalize text-xs h-9 ${
                          learningSpeed === speed ? 'bg-primary text-white' : 'border-white/10 text-slate-400'
                        }`}
                      >
                        {speed}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGeneratePlan}
                  disabled={planLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-semibold rounded-xl text-xs gap-1.5"
                >
                  {planLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Generate Study Schedule
                </Button>
              </Card>

              <div className="lg:col-span-2">
                {studyPlan ? (
                  <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <Compass className="h-4 w-4 text-primary" />
                        Daily Study Schedule
                      </h3>
                      <Badge className="bg-primary/20 text-primary border border-primary/10 capitalize text-[9px] px-2 py-0.5">
                        {learningSpeed} Speed
                      </Badge>
                    </div>

                    <div className="space-y-4 text-left">
                      {Object.entries(studyPlan).map(([day, blocks]: any) => (
                        <div key={day} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                          <p className="font-bold text-xs text-white border-b border-white/5 pb-1">{day}</p>
                          <div className="space-y-2">
                            {blocks.map((block: any, idx: number) => (
                              <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                  <span className="font-semibold text-slate-200">{block.activity}</span>
                                  {block.subject && (
                                    <Badge variant="outline" className="text-[9px] border-white/10 text-slate-400 h-4 px-1.5">
                                      {block.subject}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                                  <Zap className="h-3 w-3 text-accent" />
                                  {block.time}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ) : (
                  <div className="border border-white/5 bg-slate-900/10 rounded-2xl p-16 text-center text-slate-500 text-sm">
                    Select learning speed and click &quot;Generate&quot; to construct your study blocks.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. DOCUMENT OCR */}
          {activeTab === 'ocr' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center justify-center text-center border-dashed">
                <input
                  type="file"
                  onChange={handleOcrFileChange}
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,image/*,text/*"
                />

                <UploadCloud className="h-12 w-12 text-slate-500 mb-4 animate-bounce" />
                <div className="space-y-1 mb-6">
                  <p className="text-white font-semibold text-sm">
                    {ocrFile ? ocrFile.name : 'Select Study Document'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Upload image notes or lecture PDFs to run optical character recognition (OCR) and feed AI summaries.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 rounded-xl text-xs px-4"
                  >
                    Choose File
                  </Button>
                  {ocrFile && (
                    <Button
                      onClick={handleOcrSubmit}
                      disabled={ocrLoading}
                      className="bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-xs px-4 gap-1.5"
                    >
                      {ocrLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                      Scan Text
                    </Button>
                  )}
                </div>
              </Card>

              <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 flex flex-col">
                <CardTitle className="text-sm font-bold text-white mb-2">Extracted Text Content</CardTitle>
                <div className="flex-1 bg-slate-950/40 border border-white/5 rounded-xl p-4 min-h-[250px] max-h-[350px] overflow-y-auto text-left text-xs font-mono text-slate-300 whitespace-pre-wrap">
                  {ocrText || 'No text extracted. Select an image or PDF note to run OCR parser.'}
                </div>
              </Card>
            </div>
          )}

          {/* 4. SEMANTIC SEARCH */}
          {activeTab === 'search' && (
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSemanticSearch('');
                }}
                className="flex gap-2 text-left"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Enter semantic topic (e.g. 'dual nature of particles')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-950/40 border-white/10 text-white rounded-xl placeholder:text-slate-500 text-xs"
                  />
                </div>
                <Button type="submit" disabled={searchLoading} className="bg-primary hover:bg-primary/95 text-white rounded-xl text-xs px-6">
                  {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Semantic Search'}
                </Button>
              </form>

              <div className="space-y-4">
                {searchLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-3">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    <p className="text-xs text-slate-400">Performing pgvector cosine similarity search...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-all text-left flex justify-between items-center gap-4"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-white truncate max-w-[200px]">{res.title}</span>
                          <Badge variant="secondary" className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            {res.folder}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-[500px]">{res.preview}</p>
                      </div>
                      <Badge className="bg-success/20 text-success border border-success/10 shrink-0 font-mono text-[10px] px-2 py-0.5">
                        {(res.relevance_score * 100).toFixed(0)}% Match
      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    No results. Perform a similarity search over note vectors.
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </LayoutShell>
  );
}

// Exported page wraps the inner component in Suspense (required for useSearchParams in Next.js 15)
export default function AiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    }>
      <AiPageInner />
    </Suspense>
  );
}
