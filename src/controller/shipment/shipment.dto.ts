export interface addShipmentDTO {
  to: string;
  shipment_date: string;
  cosignee_name: string;
  phone_number: number;
  address: string;
  coordinates: Array<number>;
}
