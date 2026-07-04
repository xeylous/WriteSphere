'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryTagService } from '@/services/categoryTagService';
import { blogService } from '@/services/blogService';
import { aiService } from '@/services/aiService';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Sparkles, Eye, Save, HelpCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function WriteStoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  
  // AI State
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
    if (!title || !content || !category) {
      alert('Title, content, and category are required.');
      return;
    }
    publishMutation.mutate({
      title,
      content,
      excerpt,
      coverImage,
      category,
      status: 'published',
    });
  };

  // AI Utilities
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
        res = await aiService.generateIntro(title || 'AI & Engineering');
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
    <div className="space-y-8">
      {/* Top Bar Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-heading">Write New Story</h1>
          <p className="text-sm text-muted font-heading">Draft, edit, and optimize your story for readers.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Save className="w-4 h-4" />}>
            Save Draft
          </Button>
          <Button size="sm" onClick={handlePublish} isLoading={publishMutation.isPending}>
            Publish Story
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-8 space-y-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-heading font-bold text-heading bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-surface border border-border-custom rounded-[var(--radius-md)] text-sm text-heading outline-none focus:border-primary"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-heading mb-1">Cover Image URL</label>
              <Input
                type="text"
                placeholder="https://unsplash.com/..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>
          </div>

          <textarea
            placeholder="Write your story here in Markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] p-4 bg-surface border border-border-custom rounded-[var(--radius-lg)] text-base text-heading font-body outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
          />
        </div>

        {/* AI Panel Area */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding="md" className="border-primary/20 shadow-md">
            <h3 className="text-sm font-heading font-bold text-heading flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              WriteSphere AI Assistant
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-heading mb-1">AI Prompt / Context</label>
                <Input
                  type="text"
                  placeholder="e.g. Continue writing with a technical tone"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>

              {/* AI action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAIAction('continue')} disabled={isAiLoading}>
                  Continue Flow
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAIAction('grammar')} disabled={isAiLoading}>
                  Fix Grammar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAIAction('summary')} disabled={isAiLoading}>
                  Summarize
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAIAction('intro')} disabled={isAiLoading}>
                  Suggest Intro
                </Button>
              </div>

              {/* Loader */}
              {isAiLoading && (
                <div className="flex items-center justify-center py-4 text-sm text-primary gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              )}

              {/* Output Panel */}
              {aiOutput && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-heading">AI Output Recommendation</label>
                  <div className="p-3 bg-surface-secondary border border-border-custom rounded-[var(--radius-md)] text-xs text-body leading-relaxed max-h-[200px] overflow-y-auto">
                    {aiOutput}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setContent((prev) => `${prev}\n\n${aiOutput}`);
                      setAiOutput('');
                    }}
                  >
                    Insert to Draft
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
