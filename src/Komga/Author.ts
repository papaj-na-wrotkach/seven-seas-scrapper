import Person from './Person'

export enum AuthoringRole {
  Writer,
  Penciller,
  Inker,
  Colorist,
  Letterer,
  Cover,
  Editor,
  Translator,
}

export default interface Author extends Person {
  roles: Array<AuthoringRole>
}
