import { JwtPayload } from "../dto/jwt-payload";
import multer from "multer";

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}
declare global {
	namespace Express {
		interface Request {
			file?: multer.File;
		}
	}
}
