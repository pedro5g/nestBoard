export abstract class Encrypter {
  /**
   *
   * @param payload received anything object then convert it in a encrypted format
   * @returns a token in a JWT format
   */
  abstract encrypt(payload: Record<string, unknown>): Promise<string>;
}
