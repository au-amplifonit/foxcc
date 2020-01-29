export interface Common {
  code?: string;
  description: string;
  rowGuid: string;
  sourceCode?: string;
}

export interface State {
  code: string;
  name: string;
  stateCounter: number;
  defaultAreaCode: string;
  rowGuid: string;
}

