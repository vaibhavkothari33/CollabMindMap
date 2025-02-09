// utils/roomUtils.js
import { customAlphabet } from 'nanoid';

// Create a custom nanoid with a specific alphabet for readable room IDs
const generateRoomId = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 8);

export const createRoomId = () => generateRoomId();

export const isValidRoomId = (roomId) => {
  // Check if roomId matches the expected format
  const roomIdRegex = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/;
  return roomIdRegex.test(roomId);
};