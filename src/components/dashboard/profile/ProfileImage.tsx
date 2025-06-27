import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import numeral from "numeral";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiSolidPencil } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import BarraProgressoDupla from "src/components/BarraProgressoDupla";
import { Check2FAandKYCToChangeColor } from "src/components/Check2FAandKYCToChangeColor";
import EyeShowSensitiveInfo from "src/components/EyeShowSensitiveInfo";
import PersonalDataModal from "src/components/modals/PersonalDataModal";
import SensitiveInfo from "src/components/SensitiveInfo";
import AvatarSkeleton from "src/components/skeleton/AvatarSkeleton";
import { apiDelete, apiPost } from "src/services/apiService";
import useAccountsBalance from "src/swr/use-accounts-balance";
import usePixTransactionVolumeNew from "src/swr/use-pix-transaction-volume-new";
import useUser from "src/swr/use-user";
import { dateFormatMonthAndYear } from "src/utils";
import { notifySuccess } from "src/utils/toast";
import { mutate } from "swr";

const style = {
  p: 3,
  mb: 2,
  height: "100%",
  background: "#070f14",
  color: "#EEE",
  borderRadius: "8px",
  border: "1px solid #164736",
  "& .photo_icon": {
    color: "#01db97",
    lineHeight: 0,
    marginLeft: "8px",
  },
  "& .personal_data_btn": {
    width: 32,
    height: 32,
    cursor: "pointer",
    borderRadius: "50%",
    background: "#00271b",
    "&:hover": {
      background: "#013425",
    },
  },
};

export default function ProfileImage() {
  const { t } = useTranslation("dashboard");
  const { user, loading: loadingUser } = useUser();
  const [openPersonalDataModal, setOpenPersonalDataModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { totalDepositsVolume, totalWithdrawalsVolume } =
    usePixTransactionVolumeNew();

  const { totalBalance } = useAccountsBalance();

  useEffect(() => {
    console.log("totalBalance", totalBalance);
  }, []);

  const handleSaveImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files.length === 0) return;

    try {
      const formData = new FormData();

      formData.append("image", files[0]);
      await apiPost("users/avatar", formData);
      mutate("/users");
      notifySuccess("Imagem atualizada com sucesso");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveImage = async () => {
    try {
      await apiDelete("users/avatar", {});
      notifySuccess("Imagem removida com sucesso");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={style}>
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={"center"}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box>
            {loadingUser ? (
              <AvatarSkeleton width={56} height={56} />
            ) : (
              <Avatar
                alt="Remy Sharp"
                src={
                  user?.avatar ? `${user.avatar}?${new Date().getTime()}` : ""
                }
                sx={{ width: 56, height: 56, cursor: "pointer" }}
                onClick={() => fileInputRef.current?.click()}
              />
            )}
            {isMobile && (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                style={{
                  top: -20,
                  right: -35,
                  position: "relative",
                  backgroundColor: "#000000a6",
                  borderRadius: 50,
                  padding: 2,
                }}
              >
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={handleSaveImage}
                />
                <img
                  src="/static/icons/change_photo.svg"
                  style={{ width: 24, height: 24 }}
                  alt="BTC/USDT"
                />
              </IconButton>
            )}
          </Box>
          <Box sx={{ mb: 1, ml: 2, width: "100%" }}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box>
                <Typography variant="h6" fontWeight={500}>
                  {user && user.name}
                </Typography>
                <Typography fontSize={12} color="#677d8a">
                  {t("member-since")}:{" "}
                  {user?.createdAt && dateFormatMonthAndYear(user?.createdAt)}
                </Typography>
              </Box>

              <Box
                className="personal_data_btn flex_center"
                onClick={() => setOpenPersonalDataModal(true)}
              >
                <BiSolidPencil size={20} color="#01db97" />
              </Box>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              sx={{ mt: 1 }}
            >
              <Box className="flex_center">
                <Check2FAandKYCToChangeColor
                  label="2FA"
                  isUsingWhat={user?.using2fa}
                />
                <Check2FAandKYCToChangeColor
                  label="KYC"
                  isUsingWhat={user?.verified}
                />
              </Box>

              <Box className="flex_center">
                <FaRegTrashAlt
                  style={{ color: "#00DB97" }}
                  onClick={handleRemoveImage}
                  size={18}
                  cursor={"pointer"}
                />

                <label className="photo_icon" style={{ marginLeft: 12 }}>
                  <FiCamera size={20} cursor={"pointer"} />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleSaveImage}
                    ref={fileInputRef}
                  />
                </label>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Stack>

      <Box
        sx={{
          height: "1px",
          width: "100%",
          background: "#101b21",
          marginTop: 2,
        }}
      ></Box>

      <Stack py={2} gap={isMobile ? 2 : 0}>
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Typography fontWeight={400} color={"#AAA;"} variant="subtitle1">
              {t("assets-total")}
            </Typography>
            <EyeShowSensitiveInfo size={16} />
          </Box>
          <Typography fontWeight={400} variant="h5" mb={2}>
            <SensitiveInfo
              text={`R$${numeral(totalBalance).format("0,0.00")}`}
            />
          </Typography>
          <BarraProgressoDupla
            deposito={totalDepositsVolume}
            saque={totalWithdrawalsVolume}
            limite={125000}
          />
        </Box>
      </Stack>

      <PersonalDataModal
        openModal={openPersonalDataModal}
        handleCloseModal={() => setOpenPersonalDataModal(false)}
      />
    </Box>
  );
}
