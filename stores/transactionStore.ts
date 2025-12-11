import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

interface TransactionFilterState {
    paymentStatus: string;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    expirationDate: string;
    initiatedDate: string;
    completedDate: string;
    transactionInitiator: string;
    merchantTransactionId: string;
    dynamicId: string;
    transactionRefId: string;
    amountGreaterThanOrEqual: number | string,
    amountLessThanOrEqual: number | string,
    paymentReference: string;
    mbTransactionId: string;
    coreTransactionId: string;
    merchantAccountNumber: string;
    payerAccountNumber: string;
    payerId: string;
    payerName: string;
    payerPhone: string;
    merchantId:string
    merchantOperatorId:string
    merchantBranchId:string
}

export const useTransactionFilterStore = defineStore("transactionStore", {
    state: (): TransactionFilterState => ({
        paymentStatus: "COMPLETED",
        pageNumber: 0,
        pageSize: 20,
        sortBy: "DESC",
        transactionInitiator: "",
        amountGreaterThanOrEqual: 0,
        amountLessThanOrEqual: 0,
        payerName: "",
        payerPhone: "",
        payerAccountNumber: "",
        payerId: "",
        paymentReference: "",
        dynamicId: "",
        mbTransactionId: "",
        coreTransactionId: "",
        merchantAccountNumber: "",
        merchantBranchId: "",
        merchantOperatorId: "",
        initiatedDate: "",
        completedDate: "",
        expirationDate: "",
        merchantTransactionId: "",
        transactionRefId: "",
        merchantId: "",
    }),

    actions: {
        setFilter(filter: Partial<TransactionFilterState>) {
            this.paymentStatus = filter?.paymentStatus ?? "";
            this.pageNumber = filter?.pageNumber ?? 0;
            this.pageSize = filter?.pageSize ?? 20;
            this.sortBy = filter?.sortBy ?? "DESC";
            this.expirationDate = filter?.expirationDate ? new Date(filter.expirationDate).toISOString() : "";
            this.completedDate = filter?.completedDate ? new Date(filter.completedDate).toISOString() : "";
            this.initiatedDate = filter?.initiatedDate ? new Date(filter.initiatedDate).toISOString() : "";
            this.transactionInitiator = filter?.transactionInitiator ?? "";
            this.merchantTransactionId = filter?.merchantTransactionId ?? "";
            this.dynamicId = filter?.dynamicId ?? "";
            this.transactionRefId = filter?.transactionRefId ?? "";
            this.amountGreaterThanOrEqual = filter?.amountGreaterThanOrEqual ?? "";
            this.amountLessThanOrEqual = filter?.amountLessThanOrEqual ?? "";
            this.paymentReference = filter?.paymentReference ?? "";
            this.mbTransactionId = filter?.mbTransactionId ?? "";
            this.coreTransactionId = filter?.coreTransactionId ?? "";
            this.merchantAccountNumber = filter?.merchantAccountNumber ?? "";
            this.payerAccountNumber = filter?.payerAccountNumber ?? "";
            this.payerId = filter?.payerId ?? "";
            this.payerName = filter?.payerName ?? "";
            this.payerPhone = filter?.payerPhone ?? "";
            this.merchantId = filter?.merchantId ?? "";
            this.merchantOperatorId = filter?.merchantOperatorId ?? "";
            this.merchantBranchId = filter?.merchantBranchId ?? "";
        },


        $reset() {
            this.paymentStatus = "";
            this.pageNumber = 0;
            this.pageSize = 20;
            this.sortBy = "desc";
            this.expirationDate = "";
            this.initiatedDate = "";
            this.completedDate = "";
            this.transactionInitiator = "";
            this.merchantTransactionId = "";
            this.dynamicId = "";
            this.transactionRefId = "";
            this.amountLessThanOrEqual = 0;
            this.amountGreaterThanOrEqual = 0;
            this.paymentReference = "";
            this.mbTransactionId = "";
            this.coreTransactionId = "";
            this.merchantAccountNumber = "";
            this.payerAccountNumber = "";
            this.payerId = "";
            this.payerName = "";
            this.payerPhone = "";
            this.merchantId = "";
            this.merchantOperatorId = "";
            this.merchantBranchId = "";
        },
    },
    persist: {
        storage: persistedState.cookies,
    },
});
