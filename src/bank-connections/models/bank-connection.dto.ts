export interface BankConnectionDto {
  id: number;
  provider: string;
  status: 'CR' | 'EX' | 'GA' | 'GC' | 'LN' | 'RJ' | 'SA' | 'SU' | 'UA';
  accounts: string[];
  created_at: Date;
  link: string;
}
