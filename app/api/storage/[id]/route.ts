// API Route pour supprimer une génération
import { NextRequest, NextResponse } from 'next/server';
import { deleteGeneration } from '@/lib/storage';

interface DeleteParams {
  params: {
    id: string;
  };
}

export async function DELETE(
  request: NextRequest,
  { params }: DeleteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { imageUrl, userId } = body;

    if (!id || !imageUrl || !userId) {
      return NextResponse.json(
        { error: 'ID, imageUrl et userId requis' },
        { status: 400 }
      );
    }

    // Supprimer la génération (image + DB)
    await deleteGeneration(id, imageUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression génération:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
