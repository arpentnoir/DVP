import { CredentialSubject } from '@dvp/api-interfaces';

export const viewerSelectors = {
  documentValidBox: 'valid-box',
  documentIssuedBy: 'issued-by',
  documentProof: 'proof',
  documentRevokeStatus: 'status',
  qrCodeButton: 'uri-dropdown-button',
  downloadButton: 'download-button',
  printButton: 'print-button',
  renderTabButton: 'render_tab',
  renderTab: 'tab-panel-0',
  jsonTabButton: 'json_tab',
  jsonTab: 'tab-panel-1',
  qrCode: 'qrcode',
  qrURICopyButton: 'copy-uri-button',
  qrURITextInput: 'input-vc-uri',
  vcJsonElement: 'json-vc-data',
};
export const viewerAssertions = {
  viewerSubPath: 'viewer',
  validBoxValidVC: 'Valid',
  validBoxInvalidVC: 'Invalid',
  tabVisible: 'be.visible',
  validVC: {
    documentIssuedBy: 'dvp.ha.showthething.com',
    documentProof: 'Document has not been tampered with',
    documentStatus: 'Document has not been revoked',
  },
  inValidVC: {
    documentProof: 'Document has been tampered with',
  },
};

/**
 * Checks the viewer page for valid results for an OA document
 * @param checkedFile document that is being checked to be valid, used to verify and json renders
 * @param downloadedFileName expected name of downloaded file
 */
export const checkValidOAResults = (
  checkedFile: string,
  downloadedFileName: string
) => {
  cy.getElementByTestId(viewerSelectors.documentValidBox).contains(
    viewerAssertions.validBoxValidVC
  );
  cy.getElementByTestId(viewerSelectors.documentIssuedBy).contains(
    viewerAssertions.validVC.documentIssuedBy
  );
  cy.getElementByTestId(viewerSelectors.documentProof).contains(
    viewerAssertions.validVC.documentProof
  );
  cy.getElementByTestId(viewerSelectors.documentRevokeStatus).contains(
    viewerAssertions.validVC.documentStatus
  );

  checkDownloadButton(downloadedFileName);
  checkQRButton();
  checkPrintButton();

  cy.getVCCredentialSubjectFromFixtureFile(checkedFile).then(
    (val: CredentialSubject) => {
      const stringified = JSON.stringify(val, null, 2);
      checkForJsonTab(stringified);
      checkForRenderTab([
        val.iD as string,
        val.supplyChainConsignment.exportCountry.name as string,
        val.supplyChainConsignment.importCountry.name as string,
        val.supplyChainConsignment.consignor.name as string,
        val.supplyChainConsignment.consignee.name as string,
      ]);
    }
  );
};

/**
 * Checks the viewer page for valid results for an SVIP document
 * @param checkedFile document that is being checked to be valid, used to verify json render
 * @param downloadedFileName expected name of downloaded file
 */
export const checkValidSVIPResults = (
  checkedFile: string,
  downloadedFileName: string
) => {
  cy.getElementByTestId(viewerSelectors.documentValidBox).contains(
    viewerAssertions.validBoxValidVC
  );
  cy.getElementByTestId(viewerSelectors.documentIssuedBy);

  cy.getElementByTestId(viewerSelectors.documentProof).contains(
    viewerAssertions.validVC.documentProof
  );

  cy.getVCCredentialSubjectFromFixtureFile(checkedFile, true).then(
    (val: string) => {
      checkForJsonTab(val);
    }
  );

  checkDownloadButton(downloadedFileName);
  checkQRButton();
};

/**
 * Checks viewer results for a document that has been tampered with
 */
export const checkForTamperedDocument = () => {
  //check for verification page items
  cy.getElementByTestId(viewerSelectors.documentValidBox).contains(
    viewerAssertions.validBoxInvalidVC
  );
  cy.getElementByTestId(viewerSelectors.documentProof).contains(
    viewerAssertions.inValidVC.documentProof
  );
};
/**
 * Checks the download function/button
 * @param downloadedFileName name of file expected to be downloaded
 */
export const checkDownloadButton = (downloadedFileName: string) => {
  cy.getElementByTestId(viewerSelectors.downloadButton).click();
  cy.checkForDownloadedFile(downloadedFileName);
};

/**
 * Checks the QR code
 */
export const checkQRButton = () => {
  cy.getElementByTestId(viewerSelectors.qrCodeButton).click();
  cy.getElementByTestId(viewerSelectors.qrCode);
  cy.getElementByTestId(viewerSelectors.qrURICopyButton).click();
  cy.getElementByTestId(viewerSelectors.qrURITextInput)
    .invoke('val')
    .then((value) => {
      cy.checkClipboardForValue(value as string);
    });
};

/**
 * Checks Print button
 */
export const checkPrintButton = () => {
  cy.getElementByTestId(viewerSelectors.printButton);
};

/**
 * Checks the render tab for valid rendering
 * @param iframeContainsValues text to check exist within the IFrame
 */
export const checkForRenderTab = (iframeContainsValues: string[]) => {
  cy.getElementByTestId(viewerSelectors.renderTabButton).click();
  cy.getElementByTestId(viewerSelectors.renderTab).should(
    viewerAssertions.tabVisible
  );
  iframeContainsValues.forEach((value) => {
    cy.getIframeBody().contains(value);
  });
};
/**
 * Checks the json tab and its contents.
 * @param jsonData json data from document to be compared to rendered json
 */
export const checkForJsonTab = (jsonData: string) => {
  cy.getElementByTestId(viewerSelectors.jsonTabButton).click();
  cy.getElementByTestId(viewerSelectors.jsonTab).should(
    viewerAssertions.tabVisible
  );
  cy.getElementByTestId(viewerSelectors.vcJsonElement).contains(jsonData);
};
