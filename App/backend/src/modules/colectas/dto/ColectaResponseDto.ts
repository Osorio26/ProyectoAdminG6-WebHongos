export interface ColectaResponseDto {
  id: string;
  idHeredado: string | null;
  Colector: string | null;
  Fecha: string | null;
  Temperatura: number | null;
  Humedad: number | null;
  pH: number | null;
  TieneCoordenadas: boolean;
  ContienePlanta: boolean;
  idSitio: string | null;
  idCoordenadas: string | null;
  idPlanta: string | null;
}
