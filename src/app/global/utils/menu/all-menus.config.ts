type ALL_MENUS_MODEL =
  | 'CLIENT'
  | 'MENU'
  | 'OPERATOR'
  | 'OPERATIONS'
  | 'AGENT'
  | 'BALANCES'
  | 'MERCHANT'
  | 'SHORTCUTS';

export const MENU_KEYS: { [key in ALL_MENUS_MODEL]: { key: string } } = {
  CLIENT: { key: '' },
  MENU: { key: '' },
  OPERATOR: { key: '' },
  AGENT: { key: '' },
  BALANCES: { key: '' },
  MERCHANT: { key: '' },
  OPERATIONS: { key: '' },
  SHORTCUTS: { key: '' },
};
