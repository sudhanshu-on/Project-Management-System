import { text } from "express";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options)=>{
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanagelink.com"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHtml = mailGenerator.generate(options.mailgenContent);
    
    const transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS,
        }
    })

    const mail = {
        from: "mail.taskmanagaer@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }

    try {
        await transport.sendMail(mail)
    } catch (error) {
        console.error("Email service failed silently")
    }
}

const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            username: username,
            intro: "Welcome to Project Management System! We're very excited to have you on board.",
            action: {
                instructions: "To get started with PMS, please click here:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Confirm your account",
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

const resetPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            projectName: username,
            intro: "Welcome to PMS! We got a request to reset the password of your account.",
            action: {
                instructions: "To reset password with PMS, please click here:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Reset your password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

export {resetPasswordMailgenContent, emailVerificationMailgenContent, sendEmail};