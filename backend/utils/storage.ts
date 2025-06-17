import multer from "multer";
import path from "path";
import { Request } from "express";

// Configure storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = path.join(__dirname, "..db/uploads");
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, file.fieldname + "-" + uniqueSuffix + ext);
	},
});

// Multer upload middleware
export const upload = multer({ storage });

// Function to get file access link
export function getFileLink(
	req: Request,
	folder: string,
	filename: string
): string {
	// Assuming static files are served from '/uploads' route
	const protocol = req.protocol;
	const host = req.get("host");
	return `${protocol}://${host}/uploads/${folder}/${filename}`;
}
