export type Slot = {
  id: string
  title: string
  startTime: string
  endTime: string
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING'
  ownerId: string
}
