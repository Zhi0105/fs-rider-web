
export interface FieldInterface {
  value?: string | number,
  type?: string,
  autoComplete?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>  | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => void,
  id?: string,
  name?: string,
  placeholder?: string,
  required?: boolean,
  disabled?: boolean
}

export interface SelectInterface extends FieldInterface {
  ariaPlaceHolder?: string,
  data: any
}