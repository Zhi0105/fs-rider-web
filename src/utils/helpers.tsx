import dayjs from "dayjs"

export const DateFormatter = (date:any) => {
  return `${dayjs(date).format("MM")}/${dayjs(date).format("DD")}/${dayjs(date).format("YYYY")} ${dayjs(date).format("HH")}:${dayjs(date).format("mm")} GMT+0800`
  
}