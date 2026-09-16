import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET : Récupérer la liste des utilisateurs
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error('Erreur API GET /api/users:', error);
    return NextResponse.json(
      { message: error?.message || 'Erreur lors du chargement des utilisateurs' },
      { status: 500 }
    );
  }
}

// POST : Créer un nouvel utilisateur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "L'email et le mot de passe sont requis" },
        { status: 400 }
      );
    }

    // Vérification d'existence
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Erreur Serveur POST /api/users:', error);
    return NextResponse.json(
      { message: error?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}