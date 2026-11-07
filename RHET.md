# rhet

## Syntax
Whitespace is allowed between tokens. `<c>` is a rule parameter, and `c` is either `block` or `inline`. A document has exactly one `!`.

```ebnf
document          ::= block
block             ::= inline | "!"? "[" relation<block> "]"
inline            ::= "!"? ( unit | "{" relation<inline> "}" )
relation<c>       ::= mononuclear nucleated<c> | multinuclear c ( "," c )+
nucleated<c>      ::= "*" c ( "," c )+ | ( c "," )+ "*" c ( "," c )*
unit              ::= '"' ( [^"\] | '\"' | '\\' )* '"'
mononuclear       ::= "antithesis" | "background" | "circumstance" | "concession" | "condition" | "elaboration" | "enablement" | "evaluation" | "evidence" | "interpretation" | "justify" | "means" | "motivation" | "non-volitional-cause" | "non-volitional-result" | "otherwise" | "preparation" | "purpose" | "restatement" | "solutionhood" | "summary" | "unconditional" | "unless" | "volitional-cause" | "volitional-result"
multinuclear      ::= "conjunction" | "contrast" | "disjunction" | "joint" | "list" | "multinuclear-restatement" | "sequence"
```

## Semantics
- `unit`: One clause. No separator is added, so put spaces and punctuation inside it
- `{…}`: Concatenates its children into one paragraph
- `[…]`: Puts each child in its own paragraph
- `*`: Marks a child as the nucleus
- `!`: Marks the central claim of the document
