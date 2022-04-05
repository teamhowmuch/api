export interface Carrosserie {
  carrosserie_volgnummer: number
  carrosserietype: string
  type_carrosserie_europese_omschrijving: string
}

export interface A {
  wettelijk_toegestane_maximum_aslast: number
  technisch_toegestane_maximum_aslast: number
  aantal_assen: number
  as_nummer: number
  spoorbreedte: number
}

export interface Brandstof {
  brandstofverbruik_gecombineerd: number
  geluidsniveau_stationair: number
  brandstofverbruik_stad: number
  uitstoot_deeltjes_licht: number
  brandstof_volgnummer: number
  emissiecode_omschrijving: string
  nettomaximumvermogen: number
  brandstof_omschrijving: string
  uitlaatemissieniveau: string
  co2_uitstoot_gecombineerd: number
  brandstofverbruik_buiten: string
  toerental_geluidsniveau: number
  milieuklasse_eg_goedkeuring_licht: string
}

export interface VoertuigGegevens {
  typegoedkeuringsnummer: string
  datum_eerste_toelating: string
  eerste_kleur: string
  code_toelichting_tellerstandoordeel: string
  type: string
  export_indicator: boolean
  wam_verzekerd: boolean
  cilinderinhoud: number
  maximum_massa_samenstelling: number
  variant: string
  maximum_trekken_massa_geremd: number
  kentekenplaat: string
  carrosserie: Carrosserie[]
  taxi_indicator: boolean
  aantal_zitplaatsen: number
  voertuigsoort: string
  catalogusprijs: number
  as: A[]
  massa_rijklaar: number
  plaats_chassisnummer: string
  vermogen_massarijklaar: number
  aantal_wielen: number
  datum_tenaamstelling: string
  wielbasis: number
  datum_eerste_tenaamstelling_in_nederland_dt: Date
  sidecode: number
  aantal_deuren: number
  jaar_laatste_registratie_tellerstand: string
  aantal_cilinders: number
  zuinigheidsclassificatie: string
  datum_eerste_tenaamstelling_in_nederland: string
  volgnummer_wijziging_eu_typegoedkeuring: number
  europese_voertuigcategorie: string
  datum_eerste_toelating_dt: Date
  kenteken: string
  vervaldatum_apk: string
  toegestane_maximum_massa_voertuig: number
  brandstof: Brandstof[]
  merk: string
  uitvoering: string
  tellerstandoordeel: string
  openstaande_terugroepactie_indicator: boolean
  bruto_bpm: number
  technische_max_massa_voertuig: string
  handelsbenaming: string
  inrichting: string
  massa_ledig_voertuig: number
  maximum_ondersteunende_snelheid: number
  vervaldatum_apk_dt: Date
  tenaamstellen_mogelijk: string
  maximum_massa_trekken_ongeremd: number
  datum_tenaamstelling_dt: Date
}
