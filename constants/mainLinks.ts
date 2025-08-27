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
      { title: "My Transactions", link: "/transactions/mine", permission: "" },
      {
        title: "My Branch Transactions",
        link: "/transactions/myBranch",
        permission: PermissionConstants.READ_MERCHANT_BRANCH_TRANSACTION,
      },
      {
        title: "All Transactions",
        link: "/transactions",
        permission: PermissionConstants.READ_MERCHANT_TRANSACTION,
      },
    ],
  },
  {
    title: "Operators",
    icon: "uil:users-alt",
    // link: "/operators",
    size: "22",
    showDropdown: false,
    // permission: PermissionConstants.READ_MERCHANT_OPERATOR
    dropdown: [
      {
        title: "My Branch Operators",
        link: "/operators/myBranch",
        permission: PermissionConstants.READ_MERCHANT_OPERATOR,
      },
      {
        title: "All Branch Operators",
        link: "/operators",
        permission: PermissionConstants.READ_MERCHANT_OPERATOR,
        effectiveToAllBranch: true,
      },
    ],
  },
  {
    title: "Branches",
    icon: "material-symbols:partner-exchange-outline-rounded",
    // link: "/branches",
    size: "22",
    showDropdown: false,
    // permission: PermissionConstants.READ_MERCHANT_BRANCH
    dropdown: [
      {
        title: "My Branch",
        link: "/branches/mine",
        permission: PermissionConstants.READ_MERCHANT_BRANCH,
      },
      {
        title: "All Branches",
        link: "/branches",
        permission: PermissionConstants.READ_MERCHANT_BRANCH,
        effectiveToAllBranch: true,
      },
    ],
  },
];