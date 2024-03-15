import { IPropertyBase } from "./ipropertybase";
import { Photo } from "./photo";

export class Property implements IPropertyBase{
  id: number;
  sellRent: number;
  name: string;
  propertyTypeId: number;
  propertyType: string;
  bhk: number;
  furnishingTypeId: number;
  furnishingType: string;
  price: number;
  builtArea: number;
  carpetArea?: number;
  address: string;
  address2?: string;
  cityId: number;
  city: string;
  floorNo?: string;
  totalFloors?: string;
  readyToMove: boolean;
  age?: string;
  mainEntrance?: string;
  Security?: number;
  gated?: boolean;
  maintenance?: number;
  estPossessionOn?: string;
  photo?: string;
  description?: string;
  photos?: Photo[];
}