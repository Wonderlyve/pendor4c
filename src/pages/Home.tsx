import React, { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import EnergyDrinkAd from '../components/EnergyDrinkAd';
import Bet from '../components/Bet';
import Post from '../components/Post';
import { usePosts } from '../context/PostContext';
import CreatePredictionButton from '../components/CreatePredictionButton';

export default function Home() {
  const [selectedMatch, setSelectedMatch] = React.useState<any>(null);
  const [isBetModalOpen, setIsBetModalOpen] = React.useState(false);
  const { posts, loading, hasMore, fetchMorePosts } = usePosts();
  const observer = useRef<IntersectionObserver>();

  // Utilisation d'un ref pour le dernier élément
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMorePosts();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchMorePosts]);

  useEffect(() => {
    fetchMorePosts();
  }, []);

  const handleOpenBetModal = (match: any) => {
    setSelectedMatch(match);
    setIsBetModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.id}>
                <Post 
                  post={post}
                  onOpenBetModal={handleOpenBetModal}
                />
              </div>
            );
          } else {
            return (
              <Post 
                key={post.id} 
                post={post}
                onOpenBetModal={handleOpenBetModal}
              />
            );
          }
        })}
        
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {!loading && !hasMore && (
          <p className="text-center text-gray-500">Plus aucun pronostic à afficher</p>
        )}
      </div>

      <EnergyDrinkAd className="w-full" />

      <CreatePredictionButton />

      {selectedMatch && (
        <Bet
          isOpen={isBetModalOpen}
          onClose={() => setIsBetModalOpen(false)}
          prediction={selectedMatch}
        />
      )}
    </div>
  );
}