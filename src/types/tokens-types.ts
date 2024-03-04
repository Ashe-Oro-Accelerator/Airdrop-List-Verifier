type Token = {
  automatic_association: boolean;
  balance: number;
  created_timestamp: string;
  freeze_status: string;
  kyc_status: string;
  token_id: string;
};

type Links = {
  next: null | string;
};

export type TokensResponseType = {
  tokens: Token[],
  links: Links;
};