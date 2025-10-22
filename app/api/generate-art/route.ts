import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { image, artType } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Use Gemini Pro Vision for image understanding
    const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Convert base64 image to the format Gemini expects
    const imageData = image.replace(/^data:image\/\w+;base64,/, '');
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    // Create art type descriptions
    const artDescriptions: Record<string, string> = {
      painting: 'a beautiful framed painting with an ornate frame',
      photograph: 'a framed photograph with a modern sleek frame',
      sculpture: 'an elegant wall-mounted sculpture with interesting shadows',
      gallery_wall: 'a curated gallery wall with multiple framed artworks of various sizes',
      abstract_art: 'a vibrant abstract art piece with bold colors and geometric shapes',
      canvas_print: 'a large canvas print with contemporary artwork',
    };

    const artDescription = artDescriptions[artType] || artDescriptions.painting;

    // Step 1: Analyze the room
    const analysisPrompt = `Analyze this room image and describe:
1. The wall color, texture, and lighting
2. The room style and aesthetic (modern, traditional, minimalist, etc.)
3. Available wall space and where art could be placed
4. The perspective and camera angle
5. Existing colors and decor elements

Be specific and concise.`;

    const analysisResult = await visionModel.generateContent([
      analysisPrompt,
      {
        inlineData: {
          data: imageData,
          mimeType: mimeType,
        },
      },
    ]);

    const roomAnalysis = analysisResult.response.text();

    // Step 2: Generate description for image generation
    const imageGenPrompt = `Based on this room analysis:
${roomAnalysis}

Create a detailed prompt to generate an image of the same room but with ${artDescription} added to the wall. The prompt should describe:
1. The exact room as it appears in the original image (walls, furniture, lighting, colors)
2. The artwork placed naturally on the wall with realistic perspective
3. Proper shadows and lighting that match the room
4. The same camera angle and composition

Make the prompt detailed and photorealistic. Start the prompt with "A photograph of" and make it one continuous description.`;

    const promptResult = await visionModel.generateContent(imageGenPrompt);
    const generationPrompt = promptResult.response.text();

    // Step 3: Generate the new image using Imagen
    const imagenModel = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' });

    const imageResult = await imagenModel.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: generationPrompt
        }]
      }],
      generationConfig: {
        numberOfImages: 1,
      }
    });

    // Extract generated image
    const generatedImageData = imageResult.response.candidates?.[0]?.content?.parts?.[0];

    if (generatedImageData && 'inlineData' in generatedImageData) {
      const base64Image = `data:${generatedImageData.inlineData.mimeType};base64,${generatedImageData.inlineData.data}`;

      return NextResponse.json({
        success: true,
        imageUrl: base64Image,
      });
    } else {
      throw new Error('No image generated');
    }

  } catch (error) {
    console.error('Error generating art:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image'
      },
      { status: 500 }
    );
  }
}
