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
}
