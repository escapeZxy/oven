export declare class PasswordHasherService {
    hash(password: string): Promise<string>;
    verify(password: string, storedHash: string): Promise<boolean>;
    private parseStoredHash;
}
