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
import Script from 'next/script';

// Helper: Convert contentEditable HTML to Markdown
function htmlToMarkdown(html: string): string {
  let markdown = html;
  
  // Normalize linebreaks
  markdown = markdown.replace(/<div\s*\/?>/gi, '\n');
  markdown = markdown.replace(/<\/div>/gi, '');
  
  // Headings
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n');
  
  // Quotes
  markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n');
  
  // Lists
  markdown = markdown.replace(/<ul>([\s\S]*?)<\/ul>/gi, (match, p1) => {
    return p1.replace(/<li>(.*?)<\/li>/gi, '* $1\n') + '\n';
  });
  markdown = markdown.replace(/<ol>([\s\S]*?)<\/ol>/gi, (match, p1) => {
    let index = 1;
    return p1.replace(/<li>(.*?)<\/li>/gi, () => `${index++}. $1\n`) + '\n';
  });
  
  // Dividers
  markdown = markdown.replace(/<hr\s*\/?>/gi, '\n---\n');
  
  // Hyperlinks
  markdown = markdown.replace(/<a\s+[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
  
  // Clean up tag remnants
  markdown = markdown.replace(/<[^>]+>/g, '');
  
  return markdown.trim();
}

// Helper: Convert Markdown to contentEditable HTML
function markdownToHtml(markdown: string): string {
  if (!markdown) return '<p><br></p>';
  
  let html = markdown;
  
  // Headings
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  
  // Dividers
  html = html.replace(/^---$/gm, '<hr />');
  
  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  
  // Lists
  html = html.replace(/^\* (.*?)$/gm, '<ul><li>$1</li></ul>');
  html = html.replace(/^\d+\. (.*?)$/gm, '<ol><li>$1</li></ol>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  html = html.replace(/<\/ol>\s*<ol>/g, '');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  // Paragraphs wrapping
  const lines = html.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<u') || trimmed.startsWith('<o') || trimmed.startsWith('<b') || trimmed.startsWith('<h') || trimmed.startsWith('<a')) {
      return line;
    }
    return `<p>${line}</p>`;
  });
  
  return processedLines.join('');
}

export default function WriteStoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Blog Post State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  
  // Editor mode: 'slash' (Normal WYSIWYG) or 'raw' (Markdown code)
  const [editorMode, setEditorMode] = useState<'slash' | 'raw'>('slash');
  
  // AI assistant drawer state
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  
  // Slash Commands Overlay State
  const [showCommands, setShowCommands] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const [cursorCoords, setCursorCoords] = useState({ top: 0, left: 0 });
  
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // AI Panel State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync Markdown content into contentEditable only when loaded/injected externally
  useEffect(() => {
    if (editorMode === 'slash' && editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.innerHTML = markdownToHtml(content);
    }
  }, [content, editorMode]);

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
    const rawContent = editorMode === 'slash' && editorRef.current 
      ? htmlToMarkdown(editorRef.current.innerHTML)
      : content;
      
    if (!title.trim() || !rawContent.trim() || !category) {
      alert('Title, content, and category are required.');
      return;
    }
    publishMutation.mutate({
      title,
      content: rawContent,
      excerpt: excerpt || rawContent.substring(0, 160).replace(/[#*`]/g, ''),
      coverImage,
      category,
      status: 'published',
    });
  };

  // Slash commands catalog matching requested options
  const commands = [
    { label: 'Text', command: 'formatBlock', arg: 'p', icon: Text, desc: 'Normal paragraph text' },
    { label: 'Heading 1', command: 'formatBlock', arg: 'h1', icon: Heading1, desc: 'Large title header' },
    { label: 'Heading 2', command: 'formatBlock', arg: 'h2', icon: Heading2, desc: 'Medium section header' },
    { label: 'Heading 3', command: 'formatBlock', arg: 'h3', icon: Heading3, desc: 'Small subsection header' },
    { label: 'Bullet List', command: 'insertUnorderedList', arg: null, icon: List, desc: 'Simple bullet list' },
    { label: 'Numbered List', command: 'insertOrderedList', arg: null, icon: ListOrdered, desc: 'Sequential numbered list' },
    { label: 'Divider', command: 'insertHorizontalRule', arg: null, icon: Minus, desc: 'Horizontal rule separator' },
    { label: 'Link', command: 'createLink', arg: 'prompt', icon: LinkIcon, desc: 'Insert hyperlink' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(commandFilter.toLowerCase())
  );

  // Monitor typing for slash command initialization
  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const text = target.innerText;
    
    // Check if user is typing a slash command
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    
    if (startNode.nodeType === Node.TEXT_NODE && startNode.nodeValue) {
      const cursorOffset = range.startOffset;
      const textBeforeCursor = startNode.nodeValue.substring(0, cursorOffset);
      const lastSlashIndex = textBeforeCursor.lastIndexOf('/');
      
      if (lastSlashIndex !== -1) {
        setShowCommands(true);
        setCommandFilter(textBeforeCursor.substring(lastSlashIndex + 1));
        
        // Estimate overlay coordinates relative to client range
        const rect = range.getBoundingClientRect();
        const editorRect = target.getBoundingClientRect();
        setCursorCoords({
          top: rect.bottom - editorRect.top + target.scrollTop + 10,
          left: rect.left - editorRect.left + 15,
        });
      } else {
        setShowCommands(false);
      }
    } else {
      setShowCommands(false);
    }
    
    // Update local state in background
    setContent(htmlToMarkdown(target.innerHTML));
  };

  // Apply slash command block styling using document.execCommand
  const applyCommand = (command: string, arg: string | null) => {
    editorRef.current?.focus();
    
    // Delete slash token before applying block styles
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const node = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
        const cursorOffset = range.startOffset;
        const textBeforeCursor = node.nodeValue.substring(0, cursorOffset);
        const lastSlashIndex = textBeforeCursor.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
          range.setStart(node, lastSlashIndex);
          range.setEnd(node, cursorOffset);
          range.deleteContents();
        }
      }
    }
    
    if (command === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else {
      document.execCommand(command, false, arg || undefined);
    }
    
    setShowCommands(false);
    if (editorRef.current) {
      setContent(htmlToMarkdown(editorRef.current.innerHTML));
    }
  };

  // AI assistant integration calls
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
            <div className="space-y-4 relative">
              {/* Rich-Text contentEditable editor */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                data-placeholder="Tell your story. Type '/' to insert headings, lists, code blocks, or quotes..."
                className="w-full min-h-[500px] bg-transparent border-none outline-none focus:ring-0 text-base text-body font-body leading-relaxed resize-none no-ring wysiwyg-editor"
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
                        onClick={() => applyCommand(cmd.command, cmd.arg)}
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
