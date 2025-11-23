export interface CreateColectaDto {
  idHeredado?: string;
  Colector?: string;
  Fecha?: string;
  Temperatura?: number;
  Humedad?: number;
  pH?: number;
  idSitio?: string;
  TieneCoordenadas: boolean;
  idCoordenadas?: string;
  ContienePlanta: boolean;
  idPlanta?: string;
}