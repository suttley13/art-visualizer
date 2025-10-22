import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { image, artType } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Initialize Gemini with the new SDK
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Convert base64 image to the format required
    const imageData = image.replace(/^data:image\/\w+;base64,/, '');
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    // Create detailed art descriptions for different types
    const artDescriptions: Record<string, string> = {
      painting: 'a beautiful, high-quality framed painting with an elegant ornate gold frame. The painting should be a tasteful landscape or abstract artwork with rich colors that complement the room',
      photograph: 'a professionally framed photograph with a modern, sleek black frame. The photograph should be a striking artistic photo (landscape, cityscape, or artistic portrait) that fits the room\'s aesthetic',
      sculpture: 'an elegant three-dimensional wall-mounted sculpture with interesting textures and shadows. The sculpture should be modern and artistic, creating visual interest on the wall',
      gallery_wall: 'a professionally curated gallery wall featuring 5-7 framed artworks of various sizes arranged in an aesthetically pleasing pattern. The frames should be a mix of styles and the artwork should be cohesive',
      abstract_art: 'a large, vibrant abstract art piece with bold colors, dynamic brushstrokes, and geometric or organic shapes that create visual energy. The piece should be properly framed or on canvas',
      canvas_print: 'a large stretched canvas print featuring contemporary artwork with modern styling. The canvas should be frameless with gallery-wrapped edges, showing a striking image that complements the space',
    };

    const artDescription = artDescriptions[artType] || artDescriptions.painting;

    // Create the prompt for image editing using Gemini 2.5 Flash Image
    const prompt = [
      {
        inlineData: {
          mimeType: mimeType,
          data: imageData,
        },
      },
      {
        text: `Using the provided image of a room, please add ${artDescription} to the wall.

The artwork should:
- Be placed on the most prominent wall visible in the image
- Have realistic perspective and proportions that match the room's geometry
- Include proper lighting and shadows that match the existing room lighting
- Be properly sized for the space (not too large or too small - approximately proportional to the wall space)
- Look professionally installed and naturally integrated into the room
- Maintain all other elements of the room exactly as they appear in the original image

Generate a photorealistic image showing how this room would look with the artwork installed. The result should look like a professional interior design visualization.`
      },
    ];

    // Use Gemini 2.5 Flash Image for native image editing
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        responseModalities: ['Image'],
      },
    });

    // Extract the generated image from the response
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No candidates in response');
    }

    const candidate = response.candidates[0];
    if (!candidate.content || !candidate.content.parts) {
      throw new Error('No content or parts in candidate');
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const generatedImageData = part.inlineData.data;
        const generatedMimeType = part.inlineData.mimeType;
        const base64Image = `data:${generatedMimeType};base64,${generatedImageData}`;

        return NextResponse.json({
          success: true,
          imageUrl: base64Image,
        });
      }
    }

    // If we get here, no image was found in the response
    throw new Error('No image generated in response');

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
