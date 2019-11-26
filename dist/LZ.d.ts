declare abstract class Token {
    abstract toString(): string;
}
export default class LZ {
    private _tokens;
    encodedMessage: string;
    decodedMessage: string;
    /**
     * the token array: every element is either a Literal or Match
     */
    readonly tokens: Token[];
    constructor();
    /**
     *
     * @param message the message to decode. Assumed in string form "a<1,5>" which would decode to "aaaaaa"
     *
     * updates encodedMessage property to message, tokens, and decodedMessage
     */
    decodeString(message: string): string;
    private decodeTokens;
    /**
     *
     * @param message string to encode. For example, "aaaaaab" will become "a<1,5>b"
     *
     * updates decodedMessage,  encodedMessage, and tokens
     */
    encodeString(message: string): string;
    private lz;
    toString(): string;
}
export {};
