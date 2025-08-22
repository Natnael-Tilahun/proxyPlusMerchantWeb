import type { MenuItem } from "~/types";
import { PermissionConstants } from "./permissions";

export const mainLinks: MenuItem[] = [
  {
    title: "Dashboard",
    icon: "ri:home-8-line",
    link: "/",
    size: "22",
    // permission: "VIEW_DASHBOARD",
  },
  {
    title: "Transactions",
    icon: "uil:transaction",
    // link: "/transactions",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "Mine", link: "/transactions/mine", permission: ""},
      { title: "All Merchant Transactions", link: "/transactions", permission: PermissionConstants.READ_MERCHANT_TRANSACTION},
    ],
  },
  {
    title: "Operators",
    icon: "uil:users-alt",
    link: "/operators",
    size: "22",
    showDropdown: false,
    permission: PermissionConstants.READ_MERCHANT_OPERATOR
  },
  {
    title: "Branches",
    icon: "material-symbols:partner-exchange-outline-rounded",
    link: "/branches",
    size: "22",
    showDropdown: false,
    permission: PermissionConstants.READ_MERCHANT_BRANCH
  }
];