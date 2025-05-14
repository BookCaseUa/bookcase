import express from "express";
import { sendEmail } from "../config/email_config.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendEmail({
      to: "Uabookcase@gmail.com",
      subject: `Nuevo mensaje de ${email}`,
      text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #007bff; text-align: center;">📩 Nuevo mensaje de contacto</h2>
          <hr style="border: none; border-top: 2px solid #007bff;" />
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
            ${message}
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="font-size: 0.9em; color: #777;">Este mensaje fue enviado desde el formulario de contacto de <strong>My Book Journal</strong>.</p>
        </div>
      `,
    });
    res.status(200).send("Correo enviado correctamente.");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send("Error al enviar el correo.");
  }
});

export default router;
