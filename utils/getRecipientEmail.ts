import { UserType } from "./../types/UserType";
const getRecipientEmail = (
  users: [string | undefined],
  userLoggedIn: string | UserType | undefined
) =>
  users?.filter(
    (userToFilter: string | undefined) => userToFilter !== userLoggedIn
  )[0];

export default getRecipientEmail;
