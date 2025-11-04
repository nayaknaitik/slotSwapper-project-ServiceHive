import { prisma } from '../config/db';
import { SlotStatus } from '@prisma/client';


export const createEvent = async (ownerId: string, title: string, startTime: string, endTime: string) => {
  return prisma.event.create({
    data: { title, startTime: new Date(startTime), endTime: new Date(endTime), ownerId },
  });
};

export const getMyEvents = async (userId: string) => {
  return prisma.event.findMany({ where: { ownerId: userId }, orderBy: { startTime: 'asc' } });
};

export const getSwappableSlots = async (userId: string) => {
  const slots = await prisma.event.findMany({
    where: {
      status: 'SWAPPABLE',
      ownerId: { not: userId } 
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  return slots;
};

export const updateEventStatus = async (userId: string, eventId: string, status: string) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event || event.ownerId !== userId) {
    throw new Error('Unauthorized or event not found');
  }

  // ✅ Validate status against the enum
  if (!Object.values(SlotStatus).includes(status as SlotStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }

  return prisma.event.update({
    where: { id: eventId },
    data: { status: status as SlotStatus } // 👈 the cast fixes the type error
  });
};