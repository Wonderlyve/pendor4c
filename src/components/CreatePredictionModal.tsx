import React, { useState, useRef } from 'react';
import { X, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { usePosts } from '../context/PostContext';
import { teams, betTypes, Match } from '../data/teams';
import TeamSelect from './TeamSelect';

interface CreatePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePredictionModal({ isOpen, onClose }: CreatePredictionModalProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatch, setCurrentMatch] = useState<{
    team1: string;
    team2: string;
    betType: string;
    betValue: string;
    customBet: string;
  }>({
    team1: '',
    team2: '',
    betType: '',
    betValue: '',
    customBet: '',
  });
  
  const [newPost, setNewPost] = useState({
    text: '',
    totalOdds: '',
    confidence: 85,
    image: null as string | null,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPost } = usePosts();

  const handleAddMatch = () => {
    const team1Data = teams.find(t => t.id === currentMatch.team1);
    const team2Data = teams.find(t => t.id === currentMatch.team2);
    
    if (team1Data && team2Data && currentMatch.betType) {
      const betValue = currentMatch.betType === "Personnalisé" 
        ? currentMatch.customBet 
        : currentMatch.betValue;

      if (!betValue) return;

      setMatches([...matches, {
        team1: team1Data,
        team2: team2Data,
        betType: currentMatch.betType,
        betValue: betValue,
        customBet: currentMatch.betType === "Personnalisé" ? currentMatch.customBet : undefined
      }]);
      
      setCurrentMatch({
        team1: '',
        team2: '',
        betType: '',
        betValue: '',
        customBet: '',
      });
    }
  };

  const handleRemoveMatch = (index: number) => {
    setMatches(matches.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const matchesText = matches.map(match => 
      `${match.team1.name} vs ${match.team2.name} - ${match.betType}${match.customBet ? ' (Personnalisé)' : ''}: ${match.betValue}`
    ).join('\n');

    const fullText = `${matchesText}\n\n${newPost.text}`;

    await addPost({
      text: fullText,
      image: newPost.image,
      totalOdds: newPost.totalOdds,
      confidence: newPost.confidence,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Publier un pronostic</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Match Selection Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Ajouter des matches</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              <TeamSelect
                teams={teams}
                value={currentMatch.team1}
                onChange={(value) => setCurrentMatch({...currentMatch, team1: value})}
                placeholder="Équipe 1"
                excludeTeamId={currentMatch.team2}
              />

              <TeamSelect
                teams={teams}
                value={currentMatch.team2}
                onChange={(value) => setCurrentMatch({...currentMatch, team2: value})}
                placeholder="Équipe 2"
                excludeTeamId={currentMatch.team1}
              />

              <select
                value={currentMatch.betType}
                onChange={(e) => setCurrentMatch({...currentMatch, betType: e.target.value, betValue: '', customBet: ''})}
                className="rounded-lg border border-gray-300 p-2"
              >
                <option value="">Type de pari</option>
                {Object.keys(betTypes).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {currentMatch.betType && (
                currentMatch.betType === "Personnalisé" ? (
                  <input
                    type="text"
                    value={currentMatch.customBet}
                    onChange={(e) => setCurrentMatch({...currentMatch, customBet: e.target.value})}
                    placeholder="Entrez votre pari"
                    className="rounded-lg border border-gray-300 p-2"
                  />
                ) : (
                  <select
                    value={currentMatch.betValue}
                    onChange={(e) => setCurrentMatch({...currentMatch, betValue: e.target.value})}
                    className="rounded-lg border border-gray-300 p-2"
                  >
                    <option value="">Sélectionner</option>
                    {betTypes[currentMatch.betType as keyof typeof betTypes].map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                )
              )}
            </div>
            
            <button
              type="button"
              onClick={handleAddMatch}
              disabled={!currentMatch.team1 || !currentMatch.team2 || !currentMatch.betType || 
                (currentMatch.betType === "Personnalisé" ? !currentMatch.customBet : !currentMatch.betValue)}
              className="w-full bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Ajouter ce match
            </button>

            {/* Selected Matches List */}
            {matches.length > 0 && (
              <div className="space-y-2">
                {matches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <img src={match.team1.logo} alt={match.team1.name} className="w-6 h-6 rounded-full" />
                      <span>vs</span>
                      <img src={match.team2.logo} alt={match.team2.name} className="w-6 h-6 rounded-full" />
                      <span className="text-sm text-gray-600">
                        - {match.betType}{match.customBet ? ' (Personnalisé)' : ''}: {match.betValue}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMatch(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Votre analyse
            </label>
            <textarea
              value={newPost.text}
              onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Partagez votre analyse détaillée..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Côte totale
            </label>
            <input
              type="number"
              step="0.01"
              value={newPost.totalOdds}
              onChange={(e) => setNewPost({ ...newPost, totalOdds: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3.50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Indice de confiance: {newPost.confidence}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={newPost.confidence}
              onChange={(e) => setNewPost({ ...newPost, confidence: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (optionnel)
            </label>
            <div className="mt-1 flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ImageIcon className="h-5 w-5 text-gray-400" />
                <span>Ajouter une image</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            {newPost.image && (
              <div className="mt-2 relative">
                <img
                  src={newPost.image}
                  alt="Preview"
                  className="h-32 w-auto rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setNewPost({ ...newPost, image: null })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}