import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Tour } from "../custom/tuer";
import ReleaseNotesModal from "./ReleaseNotes";

const MODAL_KEYS = {
  RELEASE_NOTES: "releaseNotes",
  TOUR: "tour",
};

const modalQueue = [MODAL_KEYS.RELEASE_NOTES, MODAL_KEYS.TOUR];

export default function ModalManager() {
  const [currentModal, setCurrentModal] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // Verificar qual modal ainda não foi exibido
    for (const modalKey of modalQueue) {
      if (
        !localStorage.getItem(modalKey) &&
        (modalKey !== MODAL_KEYS.TOUR || !isMobile)
      ) {
        setCurrentModal(modalKey);
        break;
      }
    }
  }, []);

  const handleCloseModal = () => {
    if (currentModal) {
      // Salvar no localStorage que o modal foi exibido
      localStorage.setItem(currentModal, "true");

      // Exibir o próximo modal na fila
      const currentIndex = modalQueue.indexOf(currentModal);
      const nextModal = modalQueue[currentIndex + 1] || null;

      if (nextModal === MODAL_KEYS.TOUR && isMobile) {
        localStorage.setItem(nextModal, "true");
        setCurrentModal(null);
        return;
      }
      setCurrentModal(nextModal);
    }
  };



  // Se todos os modais já foram exibidos, não renderiza nada
  if (!currentModal) {
    return null;
  }

  return (
    <>
      {currentModal === MODAL_KEYS.RELEASE_NOTES && (
        <ReleaseNotesModal onClose={handleCloseModal} />
      )}
      {currentModal === MODAL_KEYS.TOUR && <Tour onFinish={handleCloseModal} />}
    </>
  );
}
