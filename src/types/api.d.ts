export interface ApiError {
  detail?: string | Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[] | string;
}