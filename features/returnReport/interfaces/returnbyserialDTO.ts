export interface ReturnBySerialDto {
  fact_num: number;
  fecemis: Date | string | null;
  fecdesp: Date | string | null;
  codcli: string;
  clides: string;
  codven: string;
  vendes: string;
  codart: string;
  artdes: string;
  codbarra: string;
  serial: string;
  rif: string;
  telefonos: string;
  email: string;
  dir_ent2: string;
  prednum: number | string | null;
  pednum: number | string | null;
  zondes: string;
  codzon: string;
}

export default ReturnBySerialDto;
