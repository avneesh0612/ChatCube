const getRecipientEmail = (users: [string], userLoggedIn: string) =>
  users?.filter((userToFilter: string) => userToFilter !== userLoggedIn)[0];

export default getRecipientEmail;
