import { Router } from "express";
import path from "node:path";
import multer from "multer";
import {
  requerirAutorizacion,
} from "../middlewares.js";

const router = Router();

const __dirname = import.meta.dirname;
const carpetaRaiz = path.join(__dirname, "..", "..");

//setup para subir imagenes
const storage = multer.diskStorage({
  destination: path.join(carpetaRaiz, "public", "static", "imagenes"),
  filename: (req, file, call) => {
    const nombreUnico = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    call(null, nombreUnico + ext);
  },
});

const fileFilter = (req, file, call) => {
  const tiposValidos = ["image/jpeg", "image/png"];
  if (tiposValidos.includes(file.mimetype)) {
    call(null, true);
  } else {
    call(new Error("Tipo de archivo invalido."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

//guarda imagen en la base de datos
router.post(
  "/subirImagen",
  requerirAutorizacion,
  upload.single("imagen"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No se subio ninguna imagen" });
    }

    //aca armo el string del url de la imagen
    const nombreFile = req.file.filename;
    const rutaImg = `/public/static/imagenes/${nombreFile}`;

    //aca añadimos el url al producto

    res.status(201).json({ imagen: rutaImg });
  },
);

export default router;