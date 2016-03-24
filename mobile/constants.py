from mobile.services.mobile_redirector_service import OfficerSessionDesktopToMobileRedirector, \
    AllegationSessionDesktopToMobileRedirector

DEFAULT_REDIRECT_URL = '/mobile'

DEFAULT_REDIRECTORS = [
    OfficerSessionDesktopToMobileRedirector,
    AllegationSessionDesktopToMobileRedirector
]

MOBILE_SALT = '8qTCKQzt5jYYTADWcUO8'
