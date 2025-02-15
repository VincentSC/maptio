/*
 * Please do not add anything here. Let's slowly migrate to the current
 * standard location for Angular configuration files at src/app/environments
 */

export const environment = {
  BLOG_URL: 'https://medium.com/maptio',
  GITHUB_URL: 'https://github.com/maptio/maptio',
  SUPPORT_EMAIL: 'support@maptio.com',
  MAPTIO_API_URL: 'https://app.maptio.com/api/v1',
  MIXPANEL_TOKEN: 'de90e67220137ed9cab9510a84ba7ecf',
  FULLSTORY_APP_ID: '8HKGB',
  LOGROCKET_APP_ID: 'w3vkbz/maptio',
  CLOUDINARY_CLOUDNAME: 'hgkbm0qes',
  CLOUDINARY_UPLOAD_PRESET: 'rk6tzs5q',
  CLOUDINARY_PROFILE_TAGNAME: 'profile',

  KB_URL_HOME: 'https://learning.maptio.com',
  KB_URL_PERMISSIONS: 'https://learning.maptio.com/user-permission-types',
  KB_URL_ROLE_TYPES: 'https://learning.maptio.com/working-with-roles',
  KB_URL_MARKDOWN: 'https://learning.maptio.com/adding-text-formatting',

  // To be removed soon
  KB_URL_INTEGRATIONS:
    'https://maptio.outseta.com/support/kb#/articles/2amRZEmJ/integrations',

  MESSAGE_PERMISSIONS_DENIED_EDIT: "You don't have permissions to edit this",

  IMPORT_USERS_TEMPLATE_URL:
    'assets/other/Maptio - Import template - Users.csv',

  SLACK_CLIENT_ID: '97212882021.321753214899',

  DEFAULT_AUTHORITY_TERMINOLOGY: $localize`:@@onboarding-terminology-6:Lead`,
  DEFAULT_HELPER_TERMINOLOGY: $localize`:@@onboarding-terminology-7:Contributor`,

  BILLING_TEST_PLAN:
    'https://maptio-test.chargebee.com/hosted_pages/plans/standard-plan',

  BILLING_PORTAL: 'https://maptio.chargebeeportal.com/portal/login',
  BILLING_TEST_PORTAL: 'https://maptio-test.chargebeeportal.com/portal/login',

  DEFAULT_MAP_BACKGOUND_COLOR: '#3599af',
  DEFAULT_MAP_TEXT_COLOR: '#242c2e',
  DEFAULT_PRESETS_COLORS: [
    '#3599af',
    '#e4e24a',
    '#9735af',
    '#57af35',
    '#af4a35',
    '#242c2e',
  ],
  DEFAULT_PRESETS_LABEL: ' ',
  SCREENSHOT_URL: 'assets/images/screenshot.webp',
  SCREENSHOT_URL_FALLBACK: 'assets/images/screenshot.png',
};
