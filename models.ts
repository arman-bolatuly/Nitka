export interface DTO {
    id: string | null;
    nameKz: string;
    nameRu: string;
    nameEn: string;
    active: boolean;
    isStandard?: boolean;
}

export const initialDto: DTO = {
    id: null,
    nameKz: "",
    nameRu: "",
    nameEn: "",
    active: false,
    isStandard: false,
}

export interface IFilter {
    search: string;
    isActive: boolean;
}

export const initialFilter: IFilter = {
    search: "",
    isActive: false,
};

