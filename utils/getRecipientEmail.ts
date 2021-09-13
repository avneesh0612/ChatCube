const getRecipientEmail = (users: any, userLoggedIn: any) =>
  users?.filter((userToFilter: any) => userToFilter !== userLoggedIn)[0];

export default getRecipientEmail;
