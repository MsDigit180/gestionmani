import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_super_securisee';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Vérification des champs requis
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // 2. Recherche de l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    // 3. Vérification du mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    // 4. Génération du token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5. Création de la réponse avec le cookie HTTP-only
    const response = NextResponse.json(
      {
        message: 'Connexion réussie',
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 200 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 1 jour en secondes
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Erreur API POST /api/auth/login:', error);
    return NextResponse.json(
      { message: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}