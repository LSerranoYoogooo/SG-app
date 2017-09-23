import { Linea } from "./line";

export interface Network {
  Reference: string;
  FatherReference: string;
  Line1: [Linea];
  Line2: [Linea];
  Line3: [Linea];
  Line4: [Linea];
  Line5: [Linea];
}
