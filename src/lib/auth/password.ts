import crypto from 'crypto';

const SCRYPT_KEY_LENGTH = 64;

function scryptAsync(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, SCRYPT_KEY_LENGTH, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(derivedKey as Buffer);
        });
    });
}

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await scryptAsync(password, salt);
    return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [salt, hashHex] = storedHash.split(':');

    if (!salt || !hashHex) {
        return false;
    }

    const computedHash = await scryptAsync(password, salt);
    const storedBuffer = Buffer.from(hashHex, 'hex');

    if (computedHash.length !== storedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(computedHash, storedBuffer);
}
