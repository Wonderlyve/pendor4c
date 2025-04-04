import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthPopup from './AuthPopup';
import CreatePredictionModal from './CreatePredictionModal';

export default function CreatePredictionButton() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const { user } = useAuth();

  const handleCreatePost = () => {
    if (!user) {
      setShowAuthPopup(true);
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <>
      <button
        onClick={handleCreatePost}
        className="fixed bottom-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 flex items-center justify-center"
      >
        <Plus className="h-6 w-6" />
      </button>

      {showCreateModal && (
        <CreatePredictionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      <AuthPopup
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        message="Veuillez vous connecter pour pronostiquer"
      />
    </>
  );
}