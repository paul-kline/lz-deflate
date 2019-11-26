# lz-deflate
the LZ portion of the deflate algorithm

Example usage:

```javascript
import LZ from "lz-deflate";

const lz = new LZ();
const encoded = lz.encodeString(
  "we had everything we before us, we had nothing before us, we were"
);
//encoded := "we had everything <3,18>before us, <7,32>no<6,29><14,26>were"
//sets tokens.
const decoded = lz.decodeString(encoded);
//sets tokens. lz.tokens
//decoded := "we had everything we before us, we had nothing before us, we were"
```
