import { useQuery } from "@tanstack/react-query";
import { API_URL, apiRequest } from "@/lib/utils/apiRequest";
import { APIResponse } from "@/lib/types/api";
import { Bike } from "@/lib/types/bike";

export const useHomePageData = () => {
    return useQuery({
        queryKey: ['home-page-data'],
        queryFn: () => apiRequest<APIResponse<{ bikes: Bike[] }>>('/home/', {}, `${API_URL}/`),
    });
};