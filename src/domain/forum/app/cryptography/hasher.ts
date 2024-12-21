export abstract class Hasher {
  abstract hash(value: string): Promise<string>;
  abstract compare(password: string, hash: string): Promise<boolean>;
}
