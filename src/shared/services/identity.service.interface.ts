export abstract class IIdentityService {
  abstract id: number;
  abstract email: string;
  abstract fullName: string | null;
  abstract isSuperAdmin: boolean | null;
  abstract roleId: string;
  abstract imageUrl: string | null;
  abstract isExternal: boolean;
  abstract phoneNumber: string;
  abstract refferalId: string | null;
  abstract emailVerified: boolean;
  abstract subAccountStr: string | null;
  abstract isGoogleAuthenticationEnable: boolean;
  abstract googleAuthenticationSecretKey: string | null;
  abstract googleAuthenticationManualEntryKey: string | null;
  abstract googleAuthenticationUrl: string | null;
}
