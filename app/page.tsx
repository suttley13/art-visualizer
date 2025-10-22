'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [artType, setArtType] = useState('painting');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateArt = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-art', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          artType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImage(data.imageUrl);
      } else {
        alert('Error: ' + (data.error || 'Failed to generate image'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Art Visualizer
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            See how art would look in your space
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6">
          {/* Upload Section */}
          {!selectedImage ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <div className="text-6xl">📸</div>
                  <div>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                      Upload a photo of your room
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Take or select a photo of a wall in your home
                    </p>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-full transition-colors">
                    Choose Photo
                  </button>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative rounded-xl overflow-hidden">
                <Image
                  src={generatedImage || selectedImage}
                  alt="Room preview"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  unoptimized
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p>Visualizing art in your space...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Art Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Type of art to visualize:
                </label>
                <select
                  value={artType}
                  onChange={(e) => setArtType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="painting">Painting</option>
                  <option value="photograph">Framed Photograph</option>
                  <option value="sculpture">Wall Sculpture</option>
                  <option value="gallery_wall">Gallery Wall</option>
                  <option value="abstract_art">Abstract Art</option>
                  <option value="canvas_print">Canvas Print</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateArt}
                  disabled={isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-full transition-colors"
                >
                  {isLoading ? 'Generating...' : generatedImage ? 'Regenerate' : 'Visualize Art'}
                </button>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setGeneratedImage(null);
                  }}
                  disabled={isLoading}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-3 px-6 rounded-full transition-colors"
                >
                  New Photo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Powered by Gemini 2.5 Flash Image (Nano Banana)</p>
        </div>
      </main>
    </div>
  );
}
