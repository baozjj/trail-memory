import multer from "multer";
import { AppError } from "../../types/app-error.js";
import { ensureImprintCoverTempDir, IMPRINT_COVER_TEMP_DIR } from "../../lib/imprint-types-dir.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/** 印记类型封面上传（单张原图） */
export const imprintCoverUploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      ensureImprintCoverTempDir();
      cb(null, IMPRINT_COVER_TEMP_DIR);
    },
    filename: (_req, file, cb) => {
      const ext = file.originalname.toLowerCase().endsWith(".jpg") ? ".jpg" : ".png";
      cb(null, `raw-${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new AppError("仅支持 JPEG、PNG、WebP 图片", 400, "INVALID_FILE_TYPE"));
      return;
    }
    cb(null, true);
  },
}).single("file");
