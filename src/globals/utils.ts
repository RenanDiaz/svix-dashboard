export const channelNames = (channel: string) => {
  switch (channel) {
    case "0":
      return "Public";
    case "1":
      return "Deposits";
    case "2":
      return "Withdrawals";
    case "3":
      return "Authorizations";
    case "4":
      return "Refunds";
    case "5":
      return "Domains";
    default:
      return "Unknown";
  }
};
