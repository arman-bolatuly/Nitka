import { useState, useEffect, useRef } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { Formik, Form as FormikForm } from "formik"
import Clear from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";

import { DTO, initialDto } from './models'
import FormikInput from '@ui/formik/Input'
import FormikCheckbox from '@ui/formik/Checkbox'
import CustomButton from '@ui/Button'
import { serviceDict } from '@services/dictionary'
import { fileFormatValidationSchema, dictionaryValidationSchema } from './validation'

const Form = ({ toggleDrawer, state, setState, lists, setLists, selectedId, dictCode }: any) => {
  const [initialData, setInitialData] = useState<DTO>(initialDto);
  const { common } = useTheme().palette;
  const { t } = useTranslation(["dictionary", "common"]);
  const lng = localStorage.getItem("i18nextLng") || "kz";
  const [header, setHeader] = useState<string>('')

  useEffect(() => {
    if (selectedId) {
      if (dictCode) {
        serviceDict.getDictionary(dictCode, selectedId).then((res) => {
          setInitialData(res.data);
          setHeader(res.data.nameKz)
        });
      }
    }
  }, [selectedId, dictCode]);

  return (
    <Box sx={{ p: '48px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 500, fontSize: 20, paddingBottom: '24px', lineHeight: '18px' }}>
          {!selectedId ? `${t("ADD_ENTRY")}` : `${t("EDIT_ENTRY")}`}
        </Typography>
        <Clear
          sx={{ color: "red", cursor: "pointer" }}
          onClick={toggleDrawer("create", false, null)}
        />
      </Box>

      {selectedId && (
        <Typography sx={{ fontSize: 30, paddingBottom: '24px', }}>
          {header}
        </Typography>
      )}
      <Box>
        <Formik
          initialValues={initialData}
          enableReinitialize
          validationSchema={dictCode === 'FILE_TYPE' ? fileFormatValidationSchema : dictionaryValidationSchema}
          onSubmit={(values) => {
            if (!selectedId) {
              if (dictCode === 'FILE_TYPE') {
                values.nameRu = values.nameKz;
                values.nameEn = values.nameKz;
              }
              serviceDict.createDictionary(dictCode, values)
                .then((res) => {
                  if (res.status === 200) {
                    setLists([...lists, res.data]);
                    setState({ ...state, create: false });
                  }
                })
            }
            else {
              serviceDict.createDictionary(dictCode, values).then((res) => {
                if (res.status === 200) {
                  const index = [...lists].findIndex((x) => x.id === selectedId);
                  setLists([
                    ...lists.slice(0, index),
                    res.data,
                    ...lists.slice(index + 1),
                  ]);
                  setState({ ...state, create: false });
                }
              })
            }
          }}
        >
          {({ values, submitForm, isSubmitting }) => (
            <FormikForm>
              {
                dictCode === "FILE_TYPE" ? (
                  <FormikInput label={
                    lng === "kz" ? `${t("NAME_IN_KAZAKH")}` : lng === "ru" ? `${t("NAME_IN_RUSSIAN")}` : `${t("NAME_IN_ENGLISH")}`
                  } name='nameKz' disabled={initialData.isStandard} type="expansion" />
                ) : (
                  <>
                    <Box sx={{ mb: '12px' }}><FormikInput label={t("NAME_IN_KAZAKH")} name='nameKz' disabled={initialData.isStandard} /></Box>
                    <Box sx={{ mb: '12px' }}><FormikInput label={t("NAME_IN_RUSSIAN")} name='nameRu' disabled={initialData.isStandard} /></Box>
                    <Box sx={{ mb: '12px' }}><FormikInput label={t("NAME_IN_ENGLISH")} name='nameEn' disabled={initialData.isStandard} /></Box>
                  </>
                )}

              <Box sx={{ ml: '-12px', mt: '12px' }}>
                <FormikCheckbox name='active' label={t("NOT_USED")} labelPlacement='end' />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "end", mt: '12px' }}>
                <CustomButton
                  width="150px"
                  backgroundColor={common.primaryColor}
                  borderRadius="6px"
                  fontColor={common.fontWhite}
                  sx={{
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '130%',
                  }}
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  {!selectedId ? `${t("common:actions.ADD")}` : `${t("common:actions.SAVE")}`}
                </CustomButton>
              </Box>
            </FormikForm>
          )}
        </Formik>
      </Box>
    </Box >
  )
}

export default Form