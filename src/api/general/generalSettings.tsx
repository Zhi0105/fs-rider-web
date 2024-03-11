import { devClient } from "http-commons";
import { useQuery } from "@tanstack/react-query";
import { generalSettingsInterface } from "@_types/GeneralSettings.tsx/interface";

export const GeneralSettings = () => {

    return useQuery<generalSettingsInterface>({
        queryKey: ['generalsettings'],
        queryFn: async () => {
            try {
                const response = await devClient.get('general-settings');
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        staleTime: 5 * 60000,
        refetchOnWindowFocus: true,
    });
};