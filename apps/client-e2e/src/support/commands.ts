import { CredentialSubject } from '@dvp/api-interfaces';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      /**
       * Navigates to a pages with auth then logs in
       */
      login(): void;
      /**
       * Upload's a file to input of type file input
       * @param fileName the dir / name for the file from the fixtures
       * @param options file upload options
       */
      uploadFile(
        testId: string,
        fileName: string,
        options?: Partial<Cypress.SelectFileOptions>
      ): void;
      /**
       * Gets a page element by the data-testid
       * @param testId the test id
       */
      getElementByTestId(testId: string): Chainable;
      /**
       * Wait for API calls to finish before continuing.
       */
      waitForAPICalls(): Chainable;
      /**
       * Called before tests to monitor/intercept all network called
       */
      interceptRequests(): Chainable;

      /**
       * checks the cypress download storage for a file
       * @param fileName name of the file downloaded
       */
      checkForDownloadedFile(fileName: string): Chainable;
      /**
       * checks the whole url of the current page matches using provided sub [ath and base config url
       * @param subPath sub path
       */
      urlEquals(subPath: string): Chainable;
      /**
       * Navigate cypress to the verify page
       * @param options standard visit options from cypress cy.visit
       */
      visitVerify(options?: Partial<Cypress.VisitOptions>): Chainable;

      /**
       * Checks the current clipboard for value
       * @param value the value being checked for
       */
      checkClipboardForValue(value: string): void;
      /**
       * Takes a VC file from the fixtures folder and extracts the Credential subject
       * @param fileName the dir / name for the file from the fixtures folder
       * @param stringify return results as a string
       */
      getVCCredentialSubjectFromFixtureFile(
        fileName: string,
        stringify?: boolean
      ): Chainable<CredentialSubject | string>;

      /**
       * Gets an iframe's body
       */
      getIframeBody(): Cypress.Chainable<JQuery<any>>;
    }
  }
}

const fixturesPath = './src/fixtures/';

Cypress.Commands.add('login', () => {
  const username = Cypress.env('username') as string;
  const password = Cypress.env('password') as string;
  cy.session(
    `auth-${username}`,
    () => {
      Cypress.log({
        displayName: 'COGNITO LOGIN',
        message: [`🔐 Authenticating | ${username}`],
        autoEnd: false,
      });
      //Issue has auth
      cy.visit('/issue');
      //Cognito UI dosn't have test ids
      cy.get('input[name="username"]:visible').type(username);
      cy.get('input[name="password"]:visible').type(password, {
        log: false,
      });
      cy.get('button:contains("Sign in")').click();

      // check for issue header
      cy.getElementByTestId('issue-header').contains('Issue document');
    },
    {
      validate() {
        cy.visit('/');
        cy.getElementByTestId('button:logout').contains('LOGOUT');
      },
    }
  );
});

Cypress.Commands.add('uploadFile', (testId, fileName, options) => {
  cy.getElementByTestId(testId).selectFile(fixturesPath + fileName, options);
});

Cypress.Commands.add('getElementByTestId', (testId: string) => {
  cy.get(`[data-testid=${testId}]`);
});

Cypress.Commands.add('interceptRequests', () => {
  cy.intercept({ path: '/api/*' }, (req) => {
    req.continue();
  }).as('apiRequests');
});

Cypress.Commands.add('waitForAPICalls', () => {
  cy.wait('@apiRequests');
});

Cypress.Commands.add('checkForDownloadedFile', (fileName: string) => {
  cy.readFile(`cypress/downloads/${fileName}`).should('exist');
});

Cypress.Commands.add('urlEquals', (subPath: string) => {
  const baseURL = Cypress.config().baseUrl;
  return cy.url().should('eq', baseURL + subPath);
});

Cypress.Commands.add(
  'visitVerify',
  (options?: Partial<Cypress.VisitOptions>) => {
    return cy.visit('/verify', options);
  }
);

Cypress.Commands.add('checkClipboardForValue', (value: string) => {
  cy.window()
    .its('navigator.clipboard')
    .invoke('readText')
    .should('equal', value);
});

Cypress.Commands.add(
  'getVCCredentialSubjectFromFixtureFile',
  (fileName: string, stringify?: boolean) => {
    const val = cy.readFile(fixturesPath + fileName).then((val) => {
      const subject = val.credentialSubject as CredentialSubject;
      return stringify ? JSON.stringify(subject, null, 2) : subject;
    });
    return val;
  }
);

Cypress.Commands.add('getIframeBody', () => {
  return cy
    .get('iframe')
    .its('0.contentDocument')
    .should('exist')
    .its('body')
    .should('not.be.undefined')
    .then((val) => cy.wrap(val));
});
