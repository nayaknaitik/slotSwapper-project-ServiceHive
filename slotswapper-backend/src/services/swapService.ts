import { prisma } from '../config/db';

export const createSwapRequest = async (fromUserId: string, mySlotId: string, theirSlotId: string) => {
  const mySlot = await prisma.event.findUnique({ where: { id: mySlotId } });
  const theirSlot = await prisma.event.findUnique({ where: { id: theirSlotId } });

  if (!mySlot || !theirSlot) throw new Error('Invalid slots');
  if (mySlot.ownerId !== fromUserId) throw new Error('You do not own this slot');
  if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE')
    throw new Error('Slots not available for swap');

  return prisma.$transaction(async (tx) => {
    await tx.event.updateMany({
      where: { id: { in: [mySlotId, theirSlotId] } },
      data: { status: 'SWAP_PENDING' },
    });

    return tx.swapRequest.create({
      data: {
        fromUserId,
        toUserId: theirSlot.ownerId,
        mySlotId,
        theirSlotId,
      },
    });
  });
};

export const respondToSwap = async (userId: string, requestId: string, accept: boolean) => {
  return prisma.$transaction(async (tx) => {
    const sr = await tx.swapRequest.findUnique({ where: { id: requestId } });
    if (!sr) throw new Error('Request not found');
    if (sr.toUserId !== userId) throw new Error('Not authorized');
    if (sr.status !== 'PENDING') throw new Error('Already processed');

    if (accept) {
      const mySlot = await tx.event.findUnique({ where: { id: sr.mySlotId } });
      const theirSlot = await tx.event.findUnique({ where: { id: sr.theirSlotId } });

      await tx.event.update({ where: { id: mySlot!.id }, data: { ownerId: sr.toUserId, status: 'BUSY' } });
      await tx.event.update({ where: { id: theirSlot!.id }, data: { ownerId: sr.fromUserId, status: 'BUSY' } });
      await tx.swapRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED' } });
    } else {
      await tx.event.updateMany({
        where: { id: { in: [sr.mySlotId, sr.theirSlotId] } },
        data: { status: 'SWAPPABLE' },
      });
      await tx.swapRequest.update({ where: { id: requestId }, data: { status: 'REJECTED' } });
    }
  });
};

export const getIncomingRequests = async (userId: string) => {
  return prisma.swapRequest.findMany({
    where: { toUserId: userId },
    orderBy: { createdAt: 'desc' },
    include: { mySlot: true, theirSlot: true },
  });
};

export const getOutgoingRequests = async (userId: string) => {
  return prisma.swapRequest.findMany({
    where: { fromUserId: userId },
    orderBy: { createdAt: 'desc' },
    include: { mySlot: true, theirSlot: true },
  });
};
