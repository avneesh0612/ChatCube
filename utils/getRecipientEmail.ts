const getRecipientEmail = (users: [string | undefined], userLoggedIn: string | undefined) =>
  users?.filter((userToFilter: string | undefined) => userToFilter !== userLoggedIn)[0];

export default getRecipientEmail;
