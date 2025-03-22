import NodeRSA from "node-rsa";
import bcrypt from "bcrypt";

export function validateSHA256(hash: string): boolean {
  return /^[a-f0-9]{64}$/.test(hash);
}

export function validatePublicKey(publicKey: string): boolean {
  if (publicKey.length !== 736) return false;

  // Check if the public key is a valid RSA public key by attempting to encrypt a test string
  try {
    const key = new NodeRSA();
    key.importKey(publicKey, "pkcs8-public-pem");
    key.encrypt("test", "base64");
    return true;
  } catch (_) {
    return false;
  }
}

export function validatePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function validateToken(token: string): boolean {
  return /^[A-Za-z0-9]{128}$/.test(token);
}
