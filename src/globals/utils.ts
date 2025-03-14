export const getStatusInfo = (status: 0 | 1 | 2 | 3) => {
  switch (status) {
    case 0:
      return { color: "success", text: "Success" };
    case 1:
      return { color: "warning", text: "Pending" };
    case 2:
      return { color: "danger", text: "Failed" };
    case 3:
      return { color: "info", text: "Sending" };
  }
};
