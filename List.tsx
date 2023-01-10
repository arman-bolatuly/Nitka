import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Checkbox, Drawer, FormControlLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTranslation } from "react-i18next";
import { get, capitalize } from 'lodash';

import CustomButton from "@ui/Button";
import DeleteModal from "@components/DeleteModal";
import Form from "./Form";
import { serviceDict } from "@services/dictionary";
import { initialFilter } from "./models";
import Pagination from "@ui/Pagination";
import { IDictionary } from "@interfaces/index";

const List = () => {
  const navigate = useNavigate();
  const { dictCode } = useParams();
  const { t } = useTranslation(["dictionary", "common"]);
  const lng = localStorage.getItem("i18nextLng") || "kz";

  const { common } = useTheme().palette;
  const [lists, setLists] = useState<IDictionary[]>([]);
  const [count, setCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [filter, setFilter] = useState<{ search: string; isActive: boolean }>(
    initialFilter
  );

  const searchByName = (searchValue: string) => {
    const new_filter = { ...filter, search: searchValue };
    setFilter(new_filter);
  };

  const searchByActiveness = (checked: boolean) => {
    const new_filter = { ...filter, isActive: checked };
    setFilter(new_filter);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [state, setState] = useState({
    create: false,
  });

  const toggleDrawer =
    (anchor: "create", open: boolean, id: number | null) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }
        setState({ ...state, [anchor]: open });
        setSelectedId(id);
      };

  const create = () => <Box sx={{ width: 784 }}></Box>;

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const handleOpenDeleteWindow = () => setOpenDeleteModal(true);
  const handleCloseDeleteWindow = () => setOpenDeleteModal(false);

  const deleteRecord = (id: number | null) => {
    if (dictCode) {
      serviceDict.deleteDictionary(dictCode, id).then((res) => {
        if (res.status === 200) {
          setLists(lists.filter((item) => item.id !== id));
          handleCloseDeleteWindow();
          alert("Запись успешно удален");
        } else {
          handleCloseDeleteWindow();
          alert("Вы не можете удалить запись, так как данный запись используется в курсе");
        };
      });
    };
  };

  useEffect(() => {
    if (dictCode) {
      serviceDict
        .getDictionaryList(dictCode, {
          pageNumber: currentPage,
          size: rowsPerPage,
          filter,
        })
        .then((res) => {
          setLists(res.data.dtoList);
          setCount(res.data.totalElements);
        });
    }
  }, [currentPage, rowsPerPage, filter, dictCode]);

  return (
    <Box>
      <Box sx={{ display: 'flex', mb: '24px', alignItems: 'center' }}>
        <Typography sx={{ cursor: 'pointer' }} onClick={() => navigate('/dict')}>{t("DICTIONARIES")}</Typography>
        <ArrowForwardIosIcon sx={{ width: '10px', height: '10px', mt: '1.5px', ml: '9px' }} />
        <Typography sx={{ ml: '9px' }}>{t(`${dictCode}`)}</Typography>
      </Box>
      <Typography sx={{ fontWeight: 500, fontSize: '36px', lineHeight: '44px', mb: '38px' }}>
        {t(`${dictCode}`)}
      </Typography>

      <Box sx={{
        border: `1px solid ${common.borderSecondary}`, backgroundColor: common.fontWhite,
        borderRadius: '24px', p: '24px'
      }}>
        <TableContainer>
          <Table sx={{ border: 'none', borderCollapse: 'none', }}>
            <TableRow>
              <TableCell sx={{ fontSize: 18, width: '50%', border: 'none' }}>
                <TextField
                  label={t("common:placeholders.SEARCH_BY_NAME")}
                  color="primary"
                  size="small"
                  name="searchValue"
                  onChange={(e) => searchByName(e.target.value)}
                  sx={{
                    width: '80%', ml: '-15px', '& label.Mui-focused': { color: common.primaryColor },
                    '& .MuiInput-underline:after': { borderBottomColor: common.primaryColor },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: common.primaryColor },
                      '&.Mui-focused fieldset': { borderColor: common.primaryColor }
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontSize: 18, width: '30%', border: 'none' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filter.isActive}
                      onChange={(e) => searchByActiveness(e.target.checked)}
                      sx={{
                        marginLeft: 2, color: common.primaryColor, "&, &.Mui-checked": {
                          color: common.primaryColor,
                        },
                      }}
                    />
                  }
                  label={t("NOT_USED")}
                  labelPlacement="end"
                  sx={{ ml: '-28px' }}
                />
              </TableCell>
              <TableCell sx={{ border: 'none' }}>
                <Box sx={{ fontSize: 18, display: 'flex', justifyContent: 'flex-end' }}>
                  <Box sx={{ border: `1px solid ${common.primaryColor}`, borderRadius: '9px', mr: '-15px' }}>
                    <CustomButton
                      backgroundColor={common.fontWhite}
                      borderRadius="8px"
                      fontColor={common.primaryColor}
                      sx={{
                        fontWeight: "500",
                        fontSize: "14px",
                        lineHeight: "20px",
                        alignItems: "center",
                      }}
                      onClick={toggleDrawer("create", true, null)}
                    >
                      {t("common:actions.ADD")}
                    </CustomButton>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>

        <TableContainer component={Paper} sx={{ mt: '38px' }}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: 18, width: '50%' }}>{t("TITLE")}</TableCell>
                <TableCell sx={{ fontSize: 18, width: '30%' }}>{t("USAGE_STATUS")}</TableCell>
                <TableCell sx={{ fontSize: 18 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: '25px' }}>{t("ACTION")}</Box>
                </TableCell>
              </TableRow>
            </TableHead>

            {lists?.length && lists.length > 0 ? (
              <TableBody>
                {lists?.map((list: any, index: any) => {
                  return (
                    <TableRow key={`${index}_${list.id}`}>
                      <TableCell sx={{ fontSize: 16 }}>
                        {get(list, `name${capitalize(lng)}`)}
                      </TableCell>
                      <TableCell sx={{ fontSize: 16 }}>
                        {list.active ? t("NOT_USED") : t("IS_USED")}
                      </TableCell>
                      <TableCell sx={{ display: 'flex', justifyContent: 'flex-end', pr: '60px' }}>
                        <EditIcon
                          color="info"
                          onClick={toggleDrawer("create", true, list.id)}
                          sx={{ cursor: "pointer" }}
                        />
                        <DeleteOutlineIcon sx={{ cursor: "pointer", color: "#FD0053" }}
                          onClick={() => {
                            handleOpenDeleteWindow();
                            setSelectedId(list.id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t("EMPTY")}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
          <Pagination
            count={count}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
      <Drawer
        anchor={"right"}
        open={state["create"]}
        onClose={toggleDrawer("create", false, null)}
      >
        {create()}
        <Form
          toggleDrawer={toggleDrawer}
          state={state}
          setState={setState}
          selectedId={selectedId}
          lists={lists}
          setLists={setLists}
          dictCode={dictCode}
        />
      </Drawer>
      <DeleteModal
        handleClose={handleCloseDeleteWindow}
        openDeleteModal={openDeleteModal}
        deleteItem={() => deleteRecord(selectedId || null)}
      />
    </Box>
  )
}

export default List;