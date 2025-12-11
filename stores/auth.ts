import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import type { Profile } from "~/types";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  verificationId: string
  phone: string
  expiryTime: string
  twoFactorToken:string
  permissions: string[];
  profile: Partial<Profile> | null;
  role: {};
  accessTokenExpiresIn:number;

}

// interface Profile {
//   merchantOperatorId: string;
//   operatorCode: string;
//   operatorRole: string;
//   firstName: string;
//   middleName: string;
//   fullName: string;
//   active: boolean;
//   user: any;
//   merchant: Merchant;
//   merchantBranch: Branch;
//   staticQrData: string;
// }

interface AuthPayload {
  isAuthenticated: boolean;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  permissions: string[];
  verificationId: string
  phone: string
  expiryTime: string
  twoFactorToken:string
  accessTokenExpiresIn:number;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    isAuthenticated: false,
    accessToken: "",
    refreshToken: "",
    refreshTokenExpiresIn: 0,
    permissions: [],
    profile: null,
    verificationId: "",
    expiryTime: "",
    phone:"",
    twoFactorToken:"",
    role: {},
    accessTokenExpiresIn:0
  }),

  actions: {
    setAuth(auth: Partial<AuthPayload>) {
      this.isAuthenticated = auth?.isAuthenticated ?? false;
      this.accessToken = auth?.accessToken ?? "";
      this.refreshToken = auth?.refreshToken ?? "";
      this.refreshTokenExpiresIn = auth?.refreshTokenExpiresIn ?? 0;
      this.accessTokenExpiresIn = auth?.accessTokenExpiresIn ?? 0;
    },
    setProfile(profile: Partial<Profile>) {
      this.profile = profile;
    },

    setPermissions(auth: { permissions: string[] }) {
      this.permissions = auth?.permissions ?? [];
    },

    setOTPValues(auth: { verificationId: string, expiryTime:string, phone:string, accessTokenExpiresIn?:number }) {
      this.verificationId = auth?.verificationId ?? "";
      this.expiryTime = auth?.expiryTime ?? "";
      this.phone = auth?.phone ?? "";
      this.accessTokenExpiresIn = auth?.accessTokenExpiresIn ?? 0;
    },

    setTwoFactorToken(auth: { twoFactorToken: string}) {
      this.twoFactorToken = auth?.twoFactorToken ?? "";
    },


    $reset() {
      this.isAuthenticated = false;
      this.accessToken = "";
      this.refreshToken = "";
      this.refreshTokenExpiresIn = 0;
      this.permissions = [];
      this.profile = null;
      this.verificationId = "";
      this.expiryTime = "";
      this.phone = "";
      this.accessTokenExpiresIn = 0;
    },
  },
  getters: {
    hasPermissions: (state) => {
      return (permission: string) => state?.permissions.includes(permission);
    },

    // hasRole: (state) => {
    //   return (role: string) => state.roles.includes(role);
    // }
  },
  persist: {
    // storage: persistedState.cookies,
    storage: sessionStorage,
  },
});
