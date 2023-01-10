import * as yup from 'yup';

export const dictionaryValidationSchema = yup.object({
    id: yup.number().nullable(),
    nameKz: yup.string().required('Обязательное поле'),
    nameRu: yup.string().required('Обязательное поле'),
    nameEn: yup.string().required('Обязательное поле'),
    active: yup.boolean()
});

export const fileFormatValidationSchema = yup.object({
    id: yup.number().nullable(),
    nameKz: yup.string().required('Обязательное поле'),
    nameRu: yup.string(),
    nameEn: yup.string(),
    active: yup.boolean()
});