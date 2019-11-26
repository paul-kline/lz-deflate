abstract class Token {
  abstract toString(): string;
}
class Literal extends Token {
  constructor(public literal: string) {
    super();
  }
  toString() {
    return this.literal;
  }
}
class Match extends Token {
  constructor(public length: number, public distance: number) {
    super();
  }
  toString() {
    return "<" + this.length + "," + this.distance + ">";
  }
}
export default class LZ {
  //   frequencyMap: Map<string, number>;
  private _tokens: Token[] | undefined;
  public encodedMessage: string = "";
  public decodedMessage: string = "";
  /**
   * the token array: every element is either a Literal or Match
   */
  get tokens() {
    if (!this._tokens) {
      this._tokens = this.lz();
    }
    return this._tokens;
  }
  constructor() {
    // this.frequencyMap = frequencies(message);
    // this.tokens = this.lz();
  }
  /**
   *
   * @param message the message to decode. Assumed in string form "a<1,5>" which would decode to "aaaaaa"
   *
   * updates encodedMessage property to message, tokens, and decodedMessage
   */
  public decodeString(message: string): string {
    this.encodedMessage = message;
    this.decodedMessage = this.decodeTokens(toTokens(message));
    return this.decodedMessage;
  }
  private decodeTokens(tokens: Token[]): string {
    this._tokens = tokens;
    let r: string[] = [];
    tokens.forEach(t => {
      //   console.log(r.join(""));
      if (t instanceof Literal) {
        r.push(t.toString());
      } else if (t instanceof Match) {
        // console.log("match!", t);
        //got a match.
        let j = 0;
        const i = r.length;
        for (let j = 0; j < t.length; j++) {
          r.push(r[i - t.distance + j]);
        }
      } else {
        // console.log("impossible,", t);
      }
    });
    return r.join("");
  }
  /**
   *
   * @param message string to encode. For example, "aaaaaab" will become "a<1,5>b"
   *
   * updates decodedMessage,  encodedMessage, and tokens
   */
  public encodeString(message: string) {
    this.decodedMessage = message;
    this._tokens = this.lz();
    this.encodedMessage = this.toString();
    return this.encodedMessage;
  }
  private lz(arr: string[] = this.decodedMessage.split("")): Token[] {
    const result: (Match | Literal)[] = [];
    let i = 0;
    const dic = new Map<string, Set<number>>();
    const bestMatchF = bestMatchFactory(dic, arr);
    while (i < arr.length - 2) {
      const triplet = arr[i] + arr[i + 1] + arr[i + 2];
      const bestMatch = bestMatchF(triplet, i);
      if (bestMatch) {
        // console.log("match at :", i);
        //before setting, make sure next isn't a better match.
        if (i + 3 < arr.length) {
          const triplet2 = arr[i + 1] + arr[i + 2] + arr[i + 3];
          const bestMatch2 = bestMatchF(triplet2, i + 1);
          if (
            !bestMatch2 ||
            (bestMatch2 && bestMatch.length > bestMatch2.length)
          ) {
            //match is a keeper.
            result.push(new Match(bestMatch.length, i - bestMatch.index));
            //skip ahead;
            const starti = i;
            while (i < starti + bestMatch.length) {
              insert(arr[i] + arr[i + 1] + arr[i + 2], dic, i);
              i++;
            }
          } else {
            //next match is better.
            insert(triplet, dic, i);
            result.push(new Literal(arr[i]));
            i++;
          }
        }
      } else {
        //no best match exists. put literal and move on.
        result.push(new Literal(arr[i]));
        insert(triplet, dic, i);
        i++;
      }
    }
    while (i < arr.length) {
      result.push(new Literal(arr[i]));
      i++;
    }
    return result;
  }
  toString() {
    return this.tokens.map(x => x.toString()).join("");
  }
}
function toTokens(str: string): Token[] {
  const arr = str.split("");
  const r: Token[] = [];
  let i = 0;
  while (i < arr.length) {
    const c = arr[i];

    if (c == "<") {
      let myI = i + 1;
      //attempt parsing
      let numstr1 = "";
      while (myI < arr.length && arr[myI].match(/\d/)) {
        numstr1 += arr[myI];
        myI++;
      }
      if (myI < arr.length && arr[myI] == ",") {
        myI++;
        //keep attempting parse, otherwise it wasn't an lz pair
        let numstr2 = "";
        while (myI < arr.length && arr[myI].match(/\d/)) {
          numstr2 += arr[myI];
          myI++;
        }
        if (myI < arr.length && arr[myI] == ">") {
          //make a gd token.
          r.push(
            new Match(
              Number.parseInt(numstr1, 10),
              Number.parseInt(numstr2, 10)
            )
          );
          i = myI + 1;
        } else {
          //oops, whole thing wasn't lz pair.
          r.push(new Literal(c));
          i++;
        }
      } else {
        //make c a token and move on.
        r.push(new Literal(c));
        i++;
      }
    } else {
      //not an lt so parse as lit.
      r.push(new Literal(c));
      i++;
    }
  }
  return r;
}
function matchLength(arr: string[], i1: number, i2: number): number {
  let i = 0;
  while (arr[i1 + i] == arr[i2 + i]) {
    i++;
  }
  return i;
}
function bestMatchFactory(dic: Map<string, Set<number>>, arr: string[]) {
  return function(triplet: string, starti: number) {
    const s = dic.get(triplet);
    if (s) {
      let besti = -1;
      let bestDistance = 0;
      s.forEach(v => {
        const matchLen = matchLength(arr, v, starti);
        if (bestDistance <= matchLen) {
          bestDistance = matchLen;
          besti = v;
        }
      });
      return { index: besti, length: bestDistance };
    } else {
      return null;
    }
  };
}

function insert(triplet: string, dic: Map<string, Set<number>>, i: number) {
  const s = dic.get(triplet) || new Set();
  s.add(i);
  dic.set(triplet, s);
}
