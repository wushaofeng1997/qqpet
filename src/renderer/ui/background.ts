import { goodOf } from '../pet/data/goods'
import { onGoodsChange } from '../pet/goods'
import { onSettingsChange, save } from '../pet/store'

const petEl = document.getElementById('pet')!

/**
 * HD redraws of the equipped scene ship as `name@repair.png` (full-size redraws, not 2x
 * upscales). The shop and the info panel keep the @2x twins served by the protocol; only
 * the scene behind the pet uses the repair art. b0000000 (no background) has no twin.
 */
const sceneUrl = (id: string): string => {
  const url = goodOf('background', id).url
  return save.settings.hd ? url.replace(/\.\w+$/, '@repair.png') : url
}

/** Peek SWFs only draw a sliver; the original hid the scene so just the pet peeks from the edge. */
let peeking = false

/** The equipped scene sits behind the transparent action players and moves with the pet. */
function draw(): void {
  const bg = save.selfGoodUseOption.background
  petEl.style.backgroundImage =
    !peeking && bg && bg.left > 0 && bg.id !== 'b0000000' ? `url("${sceneUrl(bg.id)}")` : ''
}

/** Hide or restore the equipped scene when the pet slips into or out of an edge peek. */
export function setBackgroundPeeking(on: boolean): void {
  if (peeking === on) return
  peeking = on
  draw()
}

draw()
onGoodsChange((type) => {
  if (type === 'background') draw()
})
// The scene is an inline style, so the hd toggle can switch the art at once (other hd assets wait for a restart).
onSettingsChange((change) => {
  if (change.hd !== undefined) draw()
})
