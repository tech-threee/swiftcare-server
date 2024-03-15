import ApiError from '../utils/apiError';

export interface IFileFilterCallback {
  (error: ApiError | null, acceptFile: boolean): void;
}
