import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "~/components/ui/checkbox";
import BranchesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { Branch } from "~/types";
import { h } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (
  refetch: RefetchFunction
): ColumnDef<Branch>[] => [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        "onUpdate:checked": (value: boolean) =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "branchName",
    header: "Branch Name",
    cell: ({ row }) => {
      const route = useRoute();
      const merchantBranchId = row.original?.merchantBranchId;
      const branchName = row.original.branchName;
      return branchName
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/branches/branchDetails/${merchantBranchId}`,
            },
            branchName ? branchName : "View Brach"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "branchCode",
    header: "Branch Code",
    cell: ({ row }) => {
      const branchCode = row.original.branchCode;
      return branchCode
        ? h(
            "div",
            {
              class: "whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("branchCode")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "businessPhoneNumber",
    header: "Business Phone Number",
    cell: ({ row }) => {
      const businessPhoneNumber = row.original.businessPhoneNumber;
      return businessPhoneNumber
        ? h(
            "div",
            {
              class: "whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("businessPhoneNumber")
          )
        : h("p", "-");
    },
  },
  {
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        "div",
        { class: "relative" },
        h(BranchesDataTableRowActionsVue, {
          row,
          refetch,
        })
      );
    },
  },
];
