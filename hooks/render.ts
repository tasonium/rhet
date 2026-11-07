const mononuclear = [
  'antithesis',
  'background',
  'circumstance',
  'concession',
  'condition',
  'elaboration',
  'enablement',
  'evaluation',
  'evidence',
  'interpretation',
  'justify',
  'means',
  'motivation',
  'non-volitional-cause',
  'non-volitional-result',
  'otherwise',
  'preparation',
  'purpose',
  'restatement',
  'solutionhood',
  'summary',
  'unconditional',
  'unless',
  'volitional-cause',
  'volitional-result',
]

const multinuclear = [
  'conjunction',
  'contrast',
  'disjunction',
  'joint',
  'list',
  'multinuclear-restatement',
  'sequence',
]

export function render(src: string): string {
  let pos = 0
  let claims = 0

  function eat(token: string): boolean {
    while (/\s/.test(src.charAt(pos))) pos++
    if (src[pos] !== token) return false
    pos++
    return true
  }

  function take(pattern: RegExp): string {
    const match = pattern.exec(src.slice(pos))
    if (!match) throw new Error(`unexpected input at ${pos}`)
    pos += match[0].length
    return match[1]
  }

  function relation(close: string, separator: string, child: () => string): string {
    const name = take(/^\s*([a-z-]+)/)
    const children: string[] = []
    let nuclei = 0
    do {
      if (eat('*')) nuclei++
      children.push(child())
    } while (eat(','))
    if (!eat(close)) throw new Error(`expected ${close} at ${pos}`)

    const isMononuclear = mononuclear.includes(name)
    if (!isMononuclear && !multinuclear.includes(name)) throw new Error(`unknown relation ${name}`)
    if (children.length < 2 || nuclei !== (isMononuclear ? 1 : 0)) throw new Error(`${name} has the wrong children`)
    return children.join(separator)
  }

  function inline(): string {
    if (eat('!')) claims++
    if (eat('{')) return relation('}', '', inline)
    return take(/^\s*"((?:[^"\\]|\\["\\])*)"/).replace(/\\(["\\])/g, '$1')
  }

  function block(): string {
    if (eat('!')) claims++
    return eat('[') ? relation(']', '\n\n', block) : inline()
  }

  const output = block()
  take(/^\s*$/)
  if (claims !== 1) throw new Error(`expected one !, found ${claims}`)
  return output
}
