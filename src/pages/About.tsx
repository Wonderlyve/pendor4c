import React from 'react';
import { Trophy, Users, Globe, Shield, Heart, Target } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Users,
      title: "Communauté de Passionnés",
      description: "Rejoignez une communauté dynamique de passionnés de sport et de paris sportifs."
    },
    {
      icon: Target,
      title: "Pronostics de Qualité",
      description: "Accédez à des analyses détaillées et des pronostics vérifiés par notre communauté."
    },
    {
      icon: Shield,
      title: "Sécurité et Confiance",
      description: "Un environnement sécurisé avec des pronostiqueurs vérifiés et des systèmes de notation transparents."
    },
    {
      icon: Heart,
      title: "Expérience Personnalisée",
      description: "Suivez vos pronostiqueurs préférés et recevez des recommandations adaptées à vos intérêts."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <Trophy className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Bienvenue sur Pendor</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          La plateforme sociale dédiée aux pronostics et actualitées sportifs, 
          où expertise et communauté se rencontrent pour une expérience unique.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Globe className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold">Notre Mission</h2>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Pendor a été créé avec une vision claire : démocratiser l'accès aux pronostics sportifs 
          de qualité tout en créant une communauté bienveillante et engagée. Nous croyons en la 
          force du collectif et en l'importance du partage de connaissances pour progresser ensemble.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-4">
              <feature.icon className="h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Community Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Notre Communauté en Chiffres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">10K+</div>
            <div className="text-blue-100">Membres Actifs</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-blue-100">Pronostics Partagés</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">85%</div>
            <div className="text-blue-100">Taux de Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Join CTA */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Rejoignez l'Aventure</h2>
        <p className="text-gray-600 mb-6">
          Créez votre compte gratuitement et commencez à partager vos pronostics 
          avec notre communauté grandissante.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Commencer Maintenant
        </button>
      </div>
    </div>
  );
}