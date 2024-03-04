type Balance = {
  account: string;
  balance: number;
};

type Links = {
  next: null | string;
};

export type BalanceResponseType = {
  timestamp: string;
  balances: Balance[];
  links: Links;
};