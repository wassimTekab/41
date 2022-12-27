import { defineStore } from "pinia";
import { authService } from "@/core/services/AuthService";
import service from "@/service";
import { Provider } from "@supabase/supabase-js";


export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      currentUser: null as any,
      accessToken: "" as string | undefined,
      refreshToken: "" as string,
      isLoggedIn: null as null | boolean,
    };
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const { session } = await authService.signInWithEmail(email, password);
        this.isLoggedIn = true;
        this.currentUser = session?.user;
        this.accessToken = session?.access_token;
        this.refreshToken = session?.refresh_token!;
        service.setBaseApiParams({
          headers: {
            Authorization: "Bearer " + session?.access_token,
          },
        });
      } catch (error: any) {
        console.log(error?.message, "error login");
      }
    },
    async loginWithProvider(provider: Provider) {
      try {
        const {result} = await authService.signInWithProvider(provider);
        this.isLoggedIn = true;
        this.currentUser = result.session?.user;
        this.accessToken = result.session?.access_token;
        this.refreshToken = result.session?.refresh_token!;
        service.setBaseApiParams({
          headers: {
            Authorization: "Bearer " + result.session?.access_token,
          },
        });
        return {data : result.session , error : null};
         

      } catch (error: any) {
        console.log(error?.message, "error login");
        return {data : null , error : error};
      }
    },
    async signUp(email: string, password: string, role: string) {
      try {
        const result = await authService.signUp(email, password, role);
        if (result.data) {
          this.isLoggedIn = true;
          this.currentUser = result?.data?.session?.user;
          this.accessToken = result?.data?.session?.access_token;
          this.refreshToken = result?.data?.session?.refresh_token!;
          service.setBaseApiParams({
            headers: {
              Authorization: "Bearer " + result?.data?.session?.access_token,
            },
          });
        }
      } catch (error) {
        console.log(error, "error signup");
      }
    },
    async resetByEmail(email: string) {
      await authService.resetByEmail(email);
    },
    async reset(password: string) {
      await authService.reset(password);
    },
    async logout() {
      await authService.signOut();
      this.currentUser = null;
      this.accessToken = "";
      this.refreshToken = "";
      this.isLoggedIn = false;
    },
    async getCurrent() {
      const result = await authService.getCurrent();
      this.isLoggedIn = result.isLoggedIn;
      if (result.session) {
        this.currentUser = result.session.user;
        this.accessToken = result.session.access_token;
        this.refreshToken = result.session.refresh_token!;
      } else {
        this.currentUser = null;
        this.accessToken = "";
        this.refreshToken = "";
      }
      console.log("isLoggedIn ", this.isLoggedIn);
      return result;
    },

    // async getCurrent() {
    //   try {
    //     const result = await authService.getCurrentUser();
    //     if (result?.data) {
    //       this.isLoggedIn = result?.isLoggedIn;
    //       this.currentUser = result?.data;
    //       this.accessToken = result?.access_token;
    //       this.refreshToken = result?.refresh_token;
    //     } else {
    //       this.currentUser = null;
    //       this.accessToken = "";
    //       this.refreshToken = "";
    //       this.isLoggedIn = false;
    //     }
    //   } catch (error) {
    //     console.log(error, "error get current user");
    //   }
    // },
  },
});
