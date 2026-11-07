import type { Register } from 'claude-code'
import { render } from './render.ts'

const INSTRUCTION =
  'Write every text reply to the user in rhet. It is rendered to Markdown for display.'

export const register: Register = (on) => {
  const buffers = new Map<string, string>()

  on('classic.SessionStart', async ($, e, next) => {
    const result = await next(e)
    const spec = await $.fs.read(`${$.plugin.root}/RHET.md`)
    return { ...result, additionalContext: [...(result.additionalContext ?? []), `${spec}\n${INSTRUCTION}`] }
  })

  on('classic.MessageDisplay', async ($, e, next) => {
    const reply = (buffers.get(e.message_id) ?? '') + e.delta
    buffers.set(e.message_id, reply)
    if (!e.final) return { displayContent: '' }
    try {
      return { displayContent: `${render(reply)}\n` }
    } catch {
      return { displayContent: reply }
    }
  })

  on('classic.Stop', async ($, e, next) => {
    try {
      render(e.last_assistant_message ?? '')
      return next(e)
    } catch (error) {
      return { block: `Your last reply is not valid rhet. Rewrite the whole reply as rhet.\n${error}` }
    }
  })
}
