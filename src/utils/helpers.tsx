import dayjs from "dayjs";

export const DateFormatter = (date: any) => {
  return `${dayjs(date).format("MM")}/${dayjs(date).format("DD")}/${dayjs(
    date
  ).format("YYYY")} ${dayjs(date).format("HH")}:${dayjs(date).format(
    "mm"
  )} GMT+0800`;
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
