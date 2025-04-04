import React from 'react';
import { X, Facebook, Twitter, Apple as WhatsApp, Link as LinkIcon, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onShare?: () => void;
}

export default function ShareModal({ isOpen, onClose, postId, onShare }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);
  const currentUrl = window.location.href;

  const handleShare = async (platform: string) => {
    let shareUrl = '';
    const text = encodeURIComponent("Découvrez ce pronostic intéressant sur Pendor !");
    const url = encodeURIComponent(`${currentUrl}#post-${postId}`);

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }

    // Open share window
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    // Increment share count
    try {
      const { error } = await supabase
        .from('posts')
        .update({ shares: supabase.sql`shares + 1` })
        .eq('id', postId);

      if (error) throw error;

      if (onShare) {
        onShare();
      }
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${currentUrl}#post-${postId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Increment share count
      const { error } = await supabase
        .from('posts')
        .update({ shares: supabase.sql`shares + 1` })
        .eq('id', postId);

      if (error) throw error;

      if (onShare) {
        onShare();
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Partager</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleShare('facebook')}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Facebook className="h-8 w-8 text-blue-600" />
            <span className="text-sm mt-2">Facebook</span>
          </button>
          
          <button
            onClick={() => handleShare('twitter')}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Twitter className="h-8 w-8 text-blue-400" />
            <span className="text-sm mt-2">Twitter</span>
          </button>
          
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-green-50 transition-colors"
          >
            <WhatsApp className="h-8 w-8 text-green-500" />
            <span className="text-sm mt-2">WhatsApp</span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-500">Lien copié !</span>
              </>
            ) : (
              <>
                <LinkIcon className="h-5 w-5 text-gray-500" />
                <span>Copier le lien</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}