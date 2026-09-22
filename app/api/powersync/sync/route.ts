import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 1. Vérifier l'authentification de l'utilisateur (ex: via session/JWT/Supabase)
    const token = request.headers.get('authorization');

    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // 2. Générer ou retourner le jeton JWT PowerSync
    const powersyncUrl = process.env.POWERSYNC_URL || 'https://dashboard.powersync.com/org/6ab146f988083500079d0af3/project/6ab14ba82e21dd000770c0e3';

    return NextResponse.json({
      token: token,
      powersync_url: powersyncUrl
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}