export type UserType = {
  email?: string;
  firstName?: string;
  id?: string;
  lastSeen?: null;
  name?: string;
  photoURL?: string;
  username: string;
  primaryEmailAddress: {
    emailAddress: string;
  };
  lastName: string;
  fullName: string;
  profileImageUrl: string;
};

export type UsersType= {
  id: string;
  data: UserType;
}
