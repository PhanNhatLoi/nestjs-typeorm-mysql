import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IIdentityService } from 'src/shared/services/identity.service.interface';

@Injectable({ scope: Scope.REQUEST })
export class IdentityService implements IIdentityService {
  @Inject(REQUEST)
  private readonly request: Request;

  private get _user(): any {
    return (this.request.user as any)?.response;
  }

  get id(): number {
    return this._user?.id;
  }

  get email(): string {
    return this._user?.email;
  }

  get fullName(): string {
    return this._user?.fullName;
  }

  get isSuperAdmin(): boolean {
    return this._user?.isSuperAdmin;
  }

  get roleId(): string {
    return this._user?.roleId;
  }

  get imageUrl(): string {
    return this._user?.imageUrl;
  }

  get isExternal(): boolean {
    return this._user?.isExternal;
  }

  get phone(): string {
    return this._user?.phone;
  }

  get refferalId(): string {
    return this._user?.refferalId;
  }

  get emailVerified(): boolean {
    return this._user?.emailVerified;
  }
}
