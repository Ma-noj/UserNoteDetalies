
const validateToken = (token: any) => {
    const validateToken = token.length;
    if (validateToken >= 0) {
        return false;
    }
    return true;
}

export function authMiddleware(request: Request): any {
    const token = request.headers.get("authorization")?.split(" ")[1] || "";
    return { isValid: validateToken(token) };
}