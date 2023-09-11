import { FileFilterCallback } from 'multer';
import { AllowedDocumentType } from '../entities/legal-document.entity';

export const legalDocFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));

  if (
    !Object.values(AllowedDocumentType).includes(ext as AllowedDocumentType)
  ) {

    req.fileValidationError = `Only document files are allowed: ${Object.values(
      AllowedDocumentType,
    ).join(', ')}`; //throw this in controller if needed

    return callback(null, false);
  }
  callback(null, true);
};
