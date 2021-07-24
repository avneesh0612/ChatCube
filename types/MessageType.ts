export type MessageType = {
  user: string;
  timestamp: number;
  photoURL: string;
  image?: string;
  message: string;
  edited?: boolean;
};
