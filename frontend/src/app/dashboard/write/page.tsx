'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryTagService } from '@/services/categoryTagService';
import { blogService } from '@/services/blogService';
import { aiService } from '@/services/aiService';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Sparkles, Eye, Save, Loader2, Sparkle, Code, Heading1, Heading2, Heading3, Quote, List, Image as ImageIcon, X, Text, ListOrdered, Minus, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export default function WriteStoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Blog Post State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  
  // Editor mode: 'slash' (Normal with slash commands) or 'raw' (Markdown code)
  const [editorMode, setEditorMode] = useState<'slash' | 'raw'>('slash');
  
  // AI assistant drawer state
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  
  // Slash Commands Overlay State
  const [showCommands, setShowCommands] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const [cursorCoords, setCursorCoords] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // AI Panel State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Queries
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryTagService.getCategories(),
  });

  const categories = categoriesResponse?.data || [];

  // Mutations
  const publishMutation = useMutation({
    mutationFn: (blogData: any) => blogService.create(blogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      router.push('/dashboard');
    },
  });

  const handlePublish = () => {
    if (!title.trim() || !content.trim() || !category) {
      alert('Title, content, and category are required.');
      return;
    }
    publishMutation.mutate({
      title,
      content,
      excerpt: excerpt || content.substring(0, 160).replace(/[#*`]/g, ''),
      coverImage,
      category,
      status: 'published',
    });
  };

  // Slash commands catalog
  const commands = [
    { label: 'Text', value: '', icon: Text, desc: 'Normal paragraph text' },
    { label: 'Heading 1', value: '# ', icon: Heading1, desc: 'Large title header' },
    { label: 'Heading 2', value: '## ', icon: Heading2, desc: 'Medium section header' },
    { label: 'Heading 3', value: '### ', icon: Heading3, desc: 'Small subsection header' },
    { label: 'Bulleted List', value: '* ', icon: List, desc: 'Simple bullet list' },
    { label: 'Numbered List', value: '1. ', icon: ListOrdered, desc: 'Sequential numbered list' },
    { label: 'Divider', value: '\n---\n', icon: Minus, desc: 'Horizontal rule line separator' },
    { label: 'Link', value: '[Text](URL)', icon: LinkIcon, desc: 'Insert hyperlink' },
    { label: 'Code Block', value: '\n```typescript\n// code here\n```\n', icon: Code, desc: 'Code syntax highlighting' },
    { label: 'Blockquote', value: '> ', icon: Quote, desc: 'Editorial pull quote block' },
    { label: 'Insert Image', value: '![Alt Text](URL)', icon: ImageIcon, desc: 'Markdown image block' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(commandFilter.toLowerCase())
  );

  // Handle slash typing
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    
    // Check if user typed '/' at current cursor position
    const selectionEnd = e.target.selectionEnd;
    const textBeforeCursor = val.substring(0, selectionEnd);
    const words = textBeforeCursor.split(/[\s\n]/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith('/')) {
      setShowCommands(true);
      setCommandFilter(lastWord.substring(1));
      
      // Calculate cursor position for overlay
      const { selectionStart } = e.target;
      const textToSelection = val.substring(0, selectionStart);
      const lines = textToSelection.split('\n');
      const currentLineIndex = lines.length - 1;
      const currentCharIndex = lines[currentLineIndex].length;

      // Estimate coordinates (rough text caret calculation helper)
      setCursorCoords({
        top: Math.min(currentLineIndex * 24 + 45, 450),
        left: Math.min(currentCharIndex * 8 + 10, 250),
      });
    } else {
      setShowCommands(false);
    }
  };

  // Insert slash command action template
  const insertCommand = (value: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // Find start of slash token to replace
    const beforeText = text.substring(0, start);
    const slashIndex = beforeText.lastIndexOf('/');

    if (slashIndex !== -1) {
      const updatedText = text.substring(0, slashIndex) + value + text.substring(end);
      setContent(updatedText);
      
      // Reset cursor focus
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = slashIndex + value.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 50);
    }
    
    setShowCommands(false);
  };

  // AI Assistant integration calls
  const handleAIAction = async (action: 'continue' | 'grammar' | 'seo' | 'summary' | 'intro') => {
    setIsAiLoading(true);
    setAiOutput('');
    try {
      let res;
      if (action === 'continue') {
        res = await aiService.continue(content, aiPrompt);
      } else if (action === 'grammar') {
        res = await aiService.grammarFix(content);
      } else if (action === 'seo') {
        res = await aiService.generateSEO(content);
      } else if (action === 'summary') {
        res = await aiService.summarize(content);
      } else if (action === 'intro') {
        res = await aiService.generateIntro(title || 'AI & Creative Writing');
      }

      if (res?.data?.result) {
        setAiOutput(res.data.result);
      }
    } catch (err: any) {
      alert(`AI assist failed: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 relative">
      {/* Top Header bar with clean actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border-custom/30">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-heading">New Story</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* AI Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            icon={<Sparkle className="w-4 h-4 text-primary" />}
            onClick={() => setShowAIDrawer(!showAIDrawer)}
          >
            AI Assist
          </Button>

          {/* Mode Selector */}
          <div className="bg-surface-secondary p-1 rounded-lg border border-border-custom flex items-center gap-1">
            <button
              onClick={() => setEditorMode('slash')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                editorMode === 'slash'
                  ? 'bg-surface shadow text-primary'
                  : 'text-body hover:text-heading'
              }`}
            >
              Normal (/ Editor)
            </button>
            <button
              onClick={() => setEditorMode('raw')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                editorMode === 'raw'
                  ? 'bg-surface shadow text-primary'
                  : 'text-body hover:text-heading'
              }`}
            >
              Raw Source
            </button>
          </div>

          <Button variant="outline" size="sm" icon={<Save className="w-4 h-4" />}>
            Draft
          </Button>
          <Button size="sm" onClick={handlePublish} isLoading={publishMutation.isPending}>
            Publish
          </Button>
        </div>
      </div>

      {/* Editor Body - full-width, clean, flat (no card borders) */}
      <div className="space-y-8 min-h-[600px]">
        {/* Category & Cover URL block */}
        <div className="flex flex-col sm:flex-row gap-6 items-center pb-4">
          <div className="w-full sm:w-1/2">
            <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Topic</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-surface-secondary border border-border-custom/60 rounded-[var(--radius-md)] text-xs font-semibold text-heading outline-none focus:border-primary/50"
            >
              <option value="">Select Topic...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-1/2">
            <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Cover Image (URL)</label>
            <input
              type="text"
              placeholder="Paste Unsplash image URL..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full p-2 bg-surface-secondary border border-border-custom/60 rounded-[var(--radius-md)] text-xs text-heading placeholder:text-muted outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Title input - flat, case sensitive, no-ring */}
        <input
          type="text"
          placeholder="Title of your story..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-heading font-extrabold text-heading bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted/40 no-ring"
        />

        {/* Story editor text area - completely flat, whole page, no borders, no rings */}
        <div className="relative">
          {editorMode === 'slash' ? (
            <div className="space-y-4">
              <textarea
                ref={textareaRef}
                placeholder="Tell your story. Type '/' to insert headings, lists, code blocks, or quotes..."
                value={content}
                onChange={handleTextareaChange}
                className="w-full min-h-[500px] bg-transparent border-none outline-none focus:ring-0 text-base text-body font-body leading-relaxed resize-none placeholder:text-muted/40 no-ring"
              />

              {/* Floating slash command menu */}
              {showCommands && filteredCommands.length > 0 && (
                <div
                  className="absolute bg-surface border border-border-custom shadow-lg rounded-[var(--radius-md)] w-64 max-h-60 overflow-y-auto z-50 p-1.5 space-y-0.5"
                  style={{
                    top: `${cursorCoords.top}px`,
                    left: `${cursorCoords.left}px`,
                  }}
                >
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider px-2 py-1 select-none">
                    Block commands
                  </p>
                  {filteredCommands.map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.label}
                        onClick={() => insertCommand(cmd.value)}
                        className="w-full flex items-center gap-3 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-surface-secondary text-left transition-colors duration-150"
                      >
                        <span className="p-1 bg-surface-secondary rounded border border-border-custom text-primary">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-heading">{cmd.label}</p>
                          <p className="text-[10px] text-muted">{cmd.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Raw markdown source preview split */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full bg-surface-secondary p-4 border border-border-custom/50 rounded-[var(--radius-md)] text-xs font-code text-heading focus:outline-none focus:border-primary/50 resize-y no-ring"
                placeholder="Raw markdown edits..."
              />
              
              {/* Formatted markdown HTML preview */}
              <div className="prose prose-writesphere max-w-none p-4 bg-surface-secondary border border-border-custom/50 rounded-[var(--radius-md)] overflow-y-auto max-h-[600px]">
                {content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-xs text-muted italic">Live markdown formatting preview appears here...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out floating AI drawer from right */}
      {showAIDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" onClick={() => setShowAIDrawer(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-96 bg-surface border-l border-border-custom p-6 shadow-2xl flex flex-col h-full justify-between">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border-custom pb-4">
                  <h3 className="text-sm font-heading font-extrabold text-heading flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    WriteSphere AI Assist
                  </h3>
                  <button onClick={() => setShowAIDrawer(false)} className="text-muted hover:text-heading">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Prompt Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-heading">AI Action Prompt</label>
                  <Input
                    type="text"
                    placeholder="e.g. rewrite this to sound professional"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleAIAction('continue')} disabled={isAiLoading}>
                    Continue
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAIAction('grammar')} disabled={isAiLoading}>
                    Fix Grammar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAIAction('summary')} disabled={isAiLoading}>
                    Summarize
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAIAction('intro')} disabled={isAiLoading}>
                    Intro
                  </Button>
                </div>

                {/* Processing state */}
                {isAiLoading && (
                  <div className="flex items-center justify-center py-4 text-xs text-primary gap-2 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI is brainstorming...</span>
                  </div>
                )}

                {/* Output recommendations */}
                {aiOutput && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-heading">Suggestion Output</label>
                    <div className="p-3 bg-surface-secondary border border-border-custom rounded-[var(--radius-md)] text-xs text-body leading-relaxed max-h-[220px] overflow-y-auto font-body">
                      {aiOutput}
                    </div>
                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => {
                        setContent((prev) => `${prev}\n\n${aiOutput}`);
                        setAiOutput('');
                        setShowAIDrawer(false);
                      }}
                    >
                      Insert into Story
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="text-[10px] text-muted text-center border-t border-border-custom pt-4">
                Powered by Llama-3.3 on Groq Cloud
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
