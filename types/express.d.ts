// Create a file `types/express.d.ts` (or another appropriate name)
import { User } from "your-user-model"; // Adjust this import to your user model

declare global {
  namespace Express {
    interface Request {
      user?: User; // Adjust the type according to your user object
    }
  }
}
