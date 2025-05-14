import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Uabookcase@gmail.com",
    pass: "whpr cpeu yljn febk", // Contraseña generada en Gmail
  },
});

export async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: "Uabookcase@gmail.com", // Correo del remitente
    to, // Correo del destinatario
    subject, // Asunto del correo
    text, // Texto plano (opcional)
    html, // Formato HTML del correo
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.response);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
}
