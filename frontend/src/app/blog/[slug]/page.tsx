'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { blogService } from '@/services/blogService';
import { interactionService } from '@/services/interactionService';
import { commentService } from '@/services/commentService';
import { use } from 'react';
import { Container } from '@/components/layout/Container';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { Clock, Heart, Bookmark, Share2, CornerDownRight, Play, Pause, Square } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogReaderPage({ params }: PageProps) {
  const { slug } = use(params);
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  
  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Queries
  const { data: blogResponse, isLoading: blogLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogService.getBySlug(slug),
  });

  const blog = blogResponse?.data;

  const { data: interactionResponse } = useQuery({
    queryKey: ['blog-interactions', blog?._id],
    queryFn: () => interactionService.getStatus(blog!._id),
    enabled: !!blog && isAuthenticated,
  });

  const { data: commentsResponse } = useQuery({
    queryKey: ['comments', blog?._id],
    queryFn: () => commentService.getByBlog(blog!._id),
    enabled: !!blog,
  });

  const isLiked = interactionResponse?.data?.liked || false;
  const isBookmarked = interactionResponse?.data?.bookmarked || false;
  const comments = commentsResponse?.data || [];

  // Mutations
  const likeMutation = useMutation({
    mutationFn: () => interactionService.toggleLike(blog!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-interactions', blog?._id] });
      queryClient.invalidateQueries({ queryKey: ['blog', slug] });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => interactionService.toggleBookmark(blog!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-interactions', blog?._id] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => commentService.create(blog!._id, content),
    onSuccess: () => {
      setCommentContent('');
      queryClient.invalidateQueries({ queryKey: ['comments', blog?._id] });
      queryClient.invalidateQueries({ queryKey: ['blog', slug] });
    },
  });

  // TTS Actions
  const handlePlayTTS = () => {
    if (!synthRef.current || !blog) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    synthRef.current.cancel();

    // Read summary or introduction
    const textToRead = blog.aiSummary || blog.excerpt || blog.content.substring(0, 300);
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'en-US';
    utteranceRef.current = utterance;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    setIsPlaying(true);
    setIsPaused(false);
    synthRef.current.speak(utterance);
  };

  const handlePauseTTS = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStopTTS = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (blogLoading) {
    return (
      <>
        <Navbar />
        <Container className="py-24 max-w-4xl space-y-6">
          <Skeleton variant="text" width="60%" height="40px" />
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" width="40px" height="40px" />
            <Skeleton variant="text" width="120px" />
          </div>
          <Skeleton variant="rect" height="400px" className="w-full" />
          <Skeleton variant="text" lines={10} />
        </Container>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <Container className="py-24 text-center">
          <h1 className="text-2xl font-bold">Article not found</h1>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ReadingProgress />
      <Navbar />
      <article className="pt-24 pb-20">
        <Container size="sm" className="max-w-3xl">
          {/* Category Badge & Meta */}
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="primary" size="md">
              {blog.category.icon} {blog.category.name}
            </Badge>
            <span className="text-sm text-muted flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {blog.readingTime} min read
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-heading leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Author Block */}
          <div className="flex items-center justify-between border-b border-border-custom pb-8 mb-8">
            <div className="flex items-center gap-4">
              <Avatar src={blog.author.avatar} alt={blog.author.name} size="lg" />
              <div>
                <p className="font-semibold text-heading text-base">{blog.author.name}</p>
                <p className="text-sm text-muted">
                  Published on{' '}
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Draft'}
                </p>
              </div>
            </div>

            {/* Interaction Stats */}
            <div className="flex items-center gap-2">
              <Button
                variant={isLiked ? 'primary' : 'outline'}
                size="sm"
                icon={<Heart className="w-4 h-4" />}
                onClick={() => isAuthenticated ? likeMutation.mutate() : alert('Please login to like')}
              >
                {blog.likesCount}
              </Button>
              <Button
                variant={isBookmarked ? 'primary' : 'outline'}
                size="sm"
                icon={<Bookmark className="w-4 h-4" />}
                onClick={() => isAuthenticated ? bookmarkMutation.mutate() : alert('Please login to bookmark')}
              />
              <Button
                variant="outline"
                size="sm"
                icon={<Share2 className="w-4 h-4" />}
                onClick={handleShare}
              />
            </div>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="aspect-[16/9] w-full rounded-[var(--radius-lg)] overflow-hidden mb-10 border border-border-custom">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* AI Summary Banner with TTS */}
          <div className="p-6 bg-surface-secondary border border-border-custom rounded-[var(--radius-lg)] mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-sm font-heading font-semibold text-heading flex items-center gap-2">
                ✨ AI Assistant Summary
              </h3>
              
              {/* TTS Controls */}
              <div className="flex items-center gap-1">
                {!isPlaying ? (
                  <Button size="sm" variant="outline" icon={<Play className="w-3.5 h-3.5" />} onClick={handlePlayTTS}>
                    {isPaused ? 'Resume' : 'Listen'}
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" icon={<Pause className="w-3.5 h-3.5" />} onClick={handlePauseTTS}>
                    Pause
                  </Button>
                )}
                {(isPlaying || isPaused) && (
                  <Button size="sm" variant="ghost" icon={<Square className="w-3.5 h-3.5" />} onClick={handleStopTTS} />
                )}
              </div>
            </div>
            <p className="text-sm text-body leading-relaxed italic">
              {blog.aiSummary || blog.excerpt || 'Use the AI panel in the dashboard to generate a formal summary for readers.'}
            </p>
          </div>

          {/* Core Content */}
          <div className="prose prose-writesphere max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Engagement Block */}
          <div className="border-t border-b border-border-custom py-6 my-12 flex items-center justify-between">
            <span className="text-sm text-muted">{blog.views} views</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => isAuthenticated ? likeMutation.mutate() : alert('Login to like')}
                className="flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors duration-200"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-primary text-primary' : 'text-muted'}`} />
                <span>Like ({blog.likesCount})</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-8">
            <h3 className="text-xl font-heading font-bold text-heading">
              Responses ({comments.length})
            </h3>

            {isAuthenticated ? (
              <div className="flex gap-4">
                <Avatar src={user?.avatar} alt={user?.name || 'User'} size="md" />
                <div className="flex-1 space-y-3">
                  <textarea
                    placeholder="What are your thoughts?"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full min-h-[100px] p-3 bg-surface border border-border-custom rounded-[var(--radius-md)] text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => commentContent.trim() && commentMutation.mutate(commentContent)}
                      isLoading={commentMutation.isPending}
                    >
                      Respond
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">
                Please{' '}
                <Link href="/login" className="text-primary hover:underline">
                  sign in
                </Link>{' '}
                to leave a response.
              </p>
            )}

            {/* List of responses */}
            <div className="space-y-6 pt-4">
              {comments.length === 0 ? (
                <p className="text-sm text-muted italic">No responses yet. Be the first to share your thoughts!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="border-b border-border-custom pb-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={comment.author.avatar} alt={comment.author.name} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-heading">{comment.author.name}</p>
                        <p className="text-xs text-muted">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-body pl-11">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </Container>
      </article>
      <Footer />
    </>
  );
}
