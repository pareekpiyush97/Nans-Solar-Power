// Project stages for a solar installation (ordered). One photo is kept per stage per site.
export const STAGES = [
  { key: 'survey', label: 'Site Survey' },
  { key: 'structure', label: 'Structure' },
  { key: 'panel', label: 'Panel Installation' },
  { key: 'wiring', label: 'Wiring' },
  { key: 'earthing', label: 'Earthing' },
  { key: 'net_meter', label: 'Net Meter' },
  { key: 'commissioned', label: 'Commissioned' },
]

export const STAGE_KEYS = STAGES.map((s) => s.key)
export const stageLabel = (k) => STAGES.find((s) => s.key === k)?.label || k
export const stageIndex = (k) => STAGE_KEYS.indexOf(k)
