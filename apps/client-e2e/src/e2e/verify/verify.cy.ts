import '../../support/commands';
import {
  checkForTamperedDocument,
  checkValidOAResults,
  checkValidSVIPResults,
} from '../viewer/viewer.page';
import {
  submitUploadableDocument,
  verifyAssertions,
  verifySelectors,
} from './verify.page';

describe('Verification Flow', () => {
  beforeEach(() => {
    cy.visitVerify();
  });

  it('should verify a valid OA VC', () => {
    submitUploadableDocument('validVCs/valid_OA.json', true);
    checkValidOAResults(
      'validVCs/valid_OA.json',
      verifySelectors.downloadedOAFileName
    );
  });

  it('should verify a valid SVIP VC', () => {
    submitUploadableDocument('validVCs/valid_SVIP.json');
    checkValidSVIPResults(
      'validVCs/valid_SVIP.json',
      verifySelectors.downloadedSVIPFileName
    );
  });
  it('should fail verification if SVIP VC has been tampered with', () => {
    submitUploadableDocument('tamperedVCs/tampered_SVIP.json');
    checkForTamperedDocument();
  });
  it('should fail verification if OA VC has been tampered with', () => {
    submitUploadableDocument('tamperedVCs/tampered_OA.json');
    checkForTamperedDocument();
  });
  it('should fail verification of a non VC json', () => {
    cy.uploadFile(verifySelectors.uploadFileInput, 'other/non_VC.json', {
      force: true,
    });
    cy.getElementByTestId(verifySelectors.vcUploadError).contains(
      verifyAssertions.uploadErrorNonVC
    );
  });
  it('should fail verification of non json File', () => {
    cy.uploadFile(verifySelectors.uploadFileInput, 'other/non_Json.text', {
      force: true,
    });
    cy.getElementByTestId(verifySelectors.vcUploadError).contains(
      verifyAssertions.uploadErrorNonJson
    );
  });
  it('should reject file over 3mb', () => {
    cy.uploadFile(
      verifySelectors.uploadFileInput,
      'other/oversized_Json.json',
      {
        force: true,
      }
    );
    cy.getElementByTestId(verifySelectors.vcUploadError).contains(
      verifyAssertions.uploadErrorMaxFile
    );
  });
});
