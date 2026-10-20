// RJ Techno-style PM Surya Ghar workflow: 11 ordered stages, each owned by a role
// (no sub-vendor — those stages are owned by the Employee). One photo per stage per site.
export const STAGES = [
  { key: 'survey',       label: 'Site Survey & Electricity Bill Analysis', owner: 'Employee' },
  { key: 'design',       label: 'System Design & Capacity Planning',       owner: 'Employee' },
  { key: 'quotation',    label: 'Quotation & Proposal',                    owner: 'Vendor' },
  { key: 'approval',     label: 'Customer Approval & Order Confirmation',  owner: 'Vendor' },
  { key: 'feasibility',  label: 'Technical Feasibility & Approvals',       owner: 'Employee' },
  { key: 'procurement',  label: 'Procurement & Material Delivery',         owner: 'Vendor' },
  { key: 'structure',    label: 'Mounting Structure Installation',         owner: 'Employee' },
  { key: 'installation', label: 'Solar Panel & Inverter Installation',     owner: 'Employee' },
  { key: 'testing',      label: 'Electrical Testing & Commissioning Prep', owner: 'Employee' },
  { key: 'net_meter',    label: 'Net Metering & DISCOM Inspection',        owner: 'Employee' },
  { key: 'handover',     label: 'Final Commissioning & Customer Handover', owner: 'Employee' },
]

export const STAGE_KEYS = STAGES.map((s) => s.key)
export const stageLabel = (k) => STAGES.find((s) => s.key === k)?.label || k
export const stageOwner = (k) => STAGES.find((s) => s.key === k)?.owner || ''
export const stageIndex = (k) => STAGE_KEYS.indexOf(k)
