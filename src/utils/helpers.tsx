import dayjs from "dayjs";

export const getOrderPrefix = (order?:any) => {
  const order_prefix = order.split("-")[0]
  return order_prefix.toLowerCase()
}

export const setGMT = (order: any) => {
  if(getOrderPrefix(order) === "FS".toLowerCase()) { return "GMT+0800" }
  else if(getOrderPrefix(order) === "PO".toLowerCase()) { return "GMT+0800" }
  else if(getOrderPrefix(order) === "TH".toLowerCase()) { return "GMT+0700" }
  else if(getOrderPrefix(order) === "VN".toLowerCase()) { return "GMT+0700" }
  return "GMT+0800"
}

export const DateFormatter = (date: any, order?: any) => {
  return `${dayjs(date).format("MM")}/${dayjs(date).format("DD")}/${dayjs(
    date
  ).format("YYYY")} ${dayjs(date).format("HH")}:${dayjs(date).format(
    "mm"
  )} ${setGMT(order)}`;
};

export const breakTextIntoLines = (text: any, context: any, maxWidth: any) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  words.forEach((word: any) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = context.measureText(testLine).width;

    if (testWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  lines.push(currentLine);
  return lines;
};
