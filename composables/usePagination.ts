import { ref, unref, isRef, watch } from "vue";
import type { Ref } from "vue";
import { useApi } from "./useApi";

export function usePagination<T>({
  endpoint,
  options,
  sortValue,
}: {
  endpoint?: Ref<string | null> | string;
  options?: { autoFetch?: boolean };
  sortValue?: string;
}) {
  const autoFetch = options?.autoFetch ?? true;
  const page = ref(1);
  const size = ref(20);
  const sort = ref(sortValue || "");
  const search = ref("");
  const filters = ref<Record<string, any>>({}); // New filters ref
  const data = ref<T[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<any>(null);

  const fetchData = async () => {
    const currentEndpoint = unref(endpoint);
    if (!currentEndpoint) {
      data.value = [];
      total.value = 0;
      return;
    }
    loading.value = true;
    try {
      const params: any = {
        page: page.value - 1,
        size: size.value,
        sort: sort.value,
        ...filters.value, // Add filters to params
      };
      if (search.value) {
        params.keyword = search.value;
      }


      const response = await useApi().fetch(currentEndpoint, {
        params: params,
      });

      console.log("responsee", response.data.value);

      const responseData = response.data.value;

      if (
        responseData &&
        response.headers?.get &&
        response.headers.get("x-total-count") &&
        Array.isArray(responseData.content)
      ) {
        data.value = responseData.content as T[];
        total.value = parseInt(
          response.headers.get("x-total-count") || "0",
          10,
        );
      } else if (
        response.headers?.get &&
        response.headers.get("x-total-count")
      ) {
        const totalStr = response.headers.get("x-total-count");
        data.value = (responseData as T[]) || [];
        total.value = parseInt(totalStr || "0", 10);
      } else {
        data.value = (responseData as T[]) || [];
        total.value = (responseData as T[])?.length || 0;
      }
    } catch (e) {
      error.value = e;
      console.error("API Error:", e);
    } finally {
      loading.value = false;
    }
  };

  const onPageChange = (newPage: number) => {
    page.value = newPage;
    // fetchData();
  };

  const onSizeChange = (newSize: number) => {
    size.value = newSize;
    // fetchData();
  };

  const onSortChange = (newSort: string) => {
    sort.value = newSort;
    // fetchData();
  };

  const onSearchChange = (newSearch: string) => {
    search.value = newSearch;
    page.value = 1;
    fetchData();
  };

  const onFiltersChange = (newFilters: Record<string, any>) => {
    filters.value = newFilters;
    page.value = 1;
    fetchData();
  };

  if (isRef(endpoint)) {
    watch(endpoint, () => {
      page.value = 1;
      fetchData();
    });
  }

  if (autoFetch) {
    fetchData();
  }

  return {
    page,
    size,
    sort,
    search,
    filters, // Expose filters
    data,
    total,
    loading,
    error,
    fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,
    onSearchChange,
    onFiltersChange, // Expose onFiltersChange
  };
}
