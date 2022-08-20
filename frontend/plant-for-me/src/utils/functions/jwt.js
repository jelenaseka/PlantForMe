import { isExpired } from "react-jwt";
import { AuthService } from "../../services/auth/AuthService";

export const tokenIsExpired = () => {
  const user = AuthService.getCurrentUser();
  if (user === null) {
    return true;
  }
  const token = user.token.substring(7);
  return isExpired(token);
}
