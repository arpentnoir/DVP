import { viewerAssertions } from '../viewer/viewer.page';

export const verifySelectors = {
  uploadFileInput: 'input-file-upload',
  verifyingLoading: 'verification-loading',
  vcUploadError: 'vc-upload-error',
  downloadedOAFileName: 'untitled.json',
  downloadedSVIPFileName: 'untitled.json',
};

export const verifyAssertions = {
  verifyingLoading: 'Verifying Document ...',
  uploadErrorNonVC: 'Must be a Verifiable Credential',
  uploadErrorNonJson: 'Must be a JSON file',
  uploadErrorMaxFile: 'Max file size exceeded',
};

/**
 * Takes given file and uploads it to the verify page.
 * Expects to be on verify page when run.
 * waits for api calls and checks that the redirect to viewer occurs
 * @param documentName Name of document to upload
 * @param useDragNDrop should it use drag n drop to submit file
 */
export const submitUploadableDocument = (
  documentName: string,
  useDragNDrop?: boolean
) => {
  cy.uploadFile(verifySelectors.uploadFileInput, documentName, {
    force: true,
    action: useDragNDrop ? 'drag-drop' : 'select',
  });

  //Check page is loading
  cy.getElementByTestId(verifySelectors.verifyingLoading).contains(
    verifyAssertions.verifyingLoading
  );

  cy.waitForAPICalls();
  //Wait for page to change
  cy.urlEquals(viewerAssertions.viewerSubPath);
};
