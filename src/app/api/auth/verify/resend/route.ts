import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { sendVerificationEmail } from "../../../../../../lib/mailer";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (user.emailVerified) {
            return NextResponse.json(
                { error: "Email already verified" },
                { status: 400 }
            );
        }

        // Generate new verification token
        const verificationToken = Math.random().toString(36).substring(2, 15);
        
        // Update user with new token
        await prisma.user.update({
            where: { email },
            data: { verificationToken }
        });

        // Send new verification email
        await sendVerificationEmail(email, verificationToken);

        return NextResponse.json(
            { message: "Verification email sent successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error resending verification email:", error);
        return NextResponse.json(
            { error: "Failed to resend verification email" },
            { status: 500 }
        );
    }
}