import React from 'react';

function TailwindTest() {
  return (
    <div className="p-8 bg-blue-100 rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Test Tailwind CSS</h2>
      <p className="text-gray-700 mb-4">
        Si vous voyez ce composant bien stylé avec un fond bleu clair, des coins arrondis et une ombre, 
        alors Tailwind CSS fonctionne correctement !
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
        Bouton Tailwind
      </button>
    </div>
  );
}

export default TailwindTest;
