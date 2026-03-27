export const getStatusColor = (status) => {
  if (["Packing", "Shipped", "ArrivedAtCity"].includes(status)) {
    return "red";
  }
  if (status === "OutForDelivery") {
    return "yellow";
  }
  if (status === "Delivered") {
    return "green";
  }
  return "gray"; 
};