declare abstract class Token {
    abstract toString(): string;
}
export default class LZ {
    private _tokens;
    encodedMessage: string;
    decodedMessage: string;
    readonly tokens: Token[];
    constructor();
    decodeString(message: string): string;
    private decodeTokens;
    encodeString(message: string): string;
    private lz;
    toString(): string;
}
export declare function toTokens(str: string): Token[];
export {};
