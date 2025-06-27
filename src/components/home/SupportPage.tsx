import CircleIcon from "@mui/icons-material/Circle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaQuestion } from "react-icons/fa6";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import MOCK_ASKS from "../../__mocks__/MOCK_ASKS.json";
import ContactSection from "./ContactSection";
import SocialMediaSection from "./SocialMediaSection";

const SupportStyled = {
  mt: 1,
  justifyContent: "center",

  "& .right_card": {
    background: "#070f14",
    padding: "1.5rem",
    borderRadius: "16px",
  },
  "& .email_button": {
    borderRadius: "16px",
  },
  "& .social_button": {
    background: "#0e161c",
    borderRadius: "16px",
    "&:hover": {
      background: "#111b23",
    },
  },

  "& .icon_box": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "& svg": {
      color: "rgb(1, 219, 151)",
      background: "#0E181C",
      width: "50px",
      height: "50px",
      padding: "12px",
      borderRadius: "50%",
    },
  },
  "& .header_support": {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    p: 2,
    background: "#070f14",
    color: "#EEE",
    borderRadius: "8px",
  },
  "& .content_support": {
    paddingTop: "2rem",
  },
  "& .search_input": {
    width: "100%",
    paddingBottom: "0.3rem",
    fontSize: "0.875rem",
    color: "#FFF",
    background: "transparent",
    border: 0,
    borderBottom: "1px solid #0e1619",
    outline: "none",
  },
  "& .categories_content": {
    paddingTop: "2rem",
    "& .MuiPaper-root": {
      padding: "0.75rem 0",
      background: "transparent",
    },
    "& .MuiAccordionDetails-root": {
      color: "#AAA",
    },
  },
  "& .categories_wrapper": {
    display: "flex",
    gap: "1rem",
    paddingTop: "2rem",
    "@media (max-width: 600px)": {
      flexDirection: "column",
    },
  },
  "& .categories_tabs": {
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    backgroundColor: "transparent",
    border: 0,
    outline: "1px solid #0E181C",

    "&.active, &:hover": {
      backgroundColor: "#00895e",
    },
  },
  "& .contact_wrapper_support": {
    paddingTop: "2rem",
  },
  "& .contact_header": {
    borderBottom: "1px solid #111d22",
  },
  "& .contact_footer": {
    marginTop: "2rem",
    padding: "2rem",
    background: "#061016",
    borderRadius: "8px",

    "& .highlight": {
      color: "#01DB97",
      textDecoration: "none",
    },
  },
};

const platformRulesContent = (
  <Box>
    <Typography variant="body1" paragraph>
      Ao acessar e utilizar os serviços da <strong>Ebinex</strong>, o cliente
      declara ter lido, compreendido e aceitado integralmente os termos e
      condições estabelecidos neste documento. O descumprimento de qualquer
      regra aqui descrita poderá resultar em medidas corretivas, inclusive a
      suspensão permanente da conta e retenção de valores.
    </Typography>

    <Paper
      elevation={0}
      sx={{
        padding: 1,
        marginBottom: 3,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        1) Proibição de Scripts, Bots e Automação
      </Typography>

      <Typography variant="body1" paragraph>
        A <strong>Ebinex</strong> proíbe terminantemente o uso de qualquer tipo
        de script, bot, algoritmo automatizado ou ferramenta de automação para
        realizar operações na plataforma.
      </Typography>

      <Typography variant="body1" paragraph>
        Essas práticas comprometem a integridade do ambiente de negociação e são
        classificadas como violações graves.
      </Typography>

      <Typography variant="body1" paragraph>
        Em caso de detecção do uso de soluções automatizadas, a{" "}
        <strong>Ebinex</strong> poderá:
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Cancelar integralmente os lucros obtidos por meio dessas práticas;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Restringir ou encerrar a conta do usuário, sem aviso prévio;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Reembolsar somente os depósitos comprovadamente realizados, desde que a conta esteja validada por meio do processo de KYC (Know Your Customer);" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Tomar medidas legais cabíveis, quando houver indício de fraude." />
        </ListItem>
      </List>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        padding: 2,
        marginBottom: 3,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        2) Limitação de Contas por Usuário
      </Typography>

      <Typography variant="body1" paragraph>
        Cada cliente (pessoa física ou jurídica) pode manter apenas uma conta
        ativa na <strong>Ebinex</strong>.
      </Typography>

      <Typography variant="body1" paragraph>
        É vedado o cadastro de múltiplas contas utilizando o mesmo CPF/CNPJ,
        documentos correlatos ou dados identificáveis.
      </Typography>

      <Typography variant="body1" paragraph>
        Se for identificado o uso de contas secundárias:
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Todas as contas envolvidas poderão ser suspensas ou encerradas imediatamente;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores ganhos nas contas secundárias serão anulados;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores depositados poderão ser retidos a critério exclusivo da Ebinex, especialmente em casos de tentativa de manipulação ou fraude." />
        </ListItem>
      </List>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        padding: 2,
        marginBottom: 3,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        3) Compromisso com a Integridade e Antifraude
      </Typography>

      <Typography variant="body1" paragraph>
        A Ebinex mantém tolerância zero com qualquer tipo de fraude, manipulação
        do sistema ou uso indevido da plataforma.
      </Typography>

      <Typography variant="body1" paragraph>
        Práticas como adulteração de dados, tentativas de burlar regras ou obter
        vantagens indevidas serão tratadas com rigor e poderão acarretar:
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Encerramento definitivo da conta;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Retenção de valores e lucros irregulares;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Adoção de medidas legais e comunicação às autoridades competentes, quando aplicável." />
        </ListItem>
      </List>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        padding: 2,
        marginBottom: 3,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        4) Do Uso Pessoal e Intransferível
      </Typography>

      <Typography variant="body1" paragraph>
        A conta registrada na Ebinex é de uso individual, pessoal e
        intransferível.
      </Typography>

      <Typography variant="body1" paragraph>
        O compartilhamento de acesso, login ou senha com terceiros é proibido.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Todas as contas envolvidas poderão ser suspensas ou encerradas imediatamente;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores ganhos nas contas secundárias serão anulados;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores depositados poderão ser retidos a critério exclusivo da Ebinex, especialmente em casos de tentativa de manipulação ou fraude." />
        </ListItem>
      </List>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        padding: 2,
        marginBottom: 3,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        5) Origem Lícita dos Fundos
      </Typography>

      <Typography variant="body1" paragraph>
        Todos os depósitos devem ser realizados com fundos de origem
        comprovadamente lícita, provenientes de contas de titularidade do
        próprio usuário.
      </Typography>

      <Typography variant="body1" paragraph>
        Saques só serão permitidos para contas bancárias ou carteiras digitais
        em nome do titular da conta Ebinex.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Todas as contas envolvidas poderão ser suspensas ou encerradas imediatamente;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores ganhos nas contas secundárias serão anulados;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores depositados poderão ser retidos a critério exclusivo da Ebinex, especialmente em casos de tentativa de manipulação ou fraude." />
        </ListItem>
      </List>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        padding: 2,
        marginBottom: 3,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        6) Segurança e Responsabilidade
      </Typography>

      <Typography variant="body1" paragraph>
        O usuário é inteiramente responsável por manter seus dados de acesso
        protegidos.
      </Typography>

      <Typography variant="body1" paragraph>
        A Ebinex não se responsabiliza por acessos indevidos causados por
        negligência do usuário.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Todas as contas envolvidas poderão ser suspensas ou encerradas imediatamente;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores ganhos nas contas secundárias serão anulados;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores depositados poderão ser retidos a critério exclusivo da Ebinex, especialmente em casos de tentativa de manipulação ou fraude." />
        </ListItem>
      </List>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        padding: 2,
        marginBottom: 3,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        7) Suspensão e Encerramento de Conta
      </Typography>

      <Typography variant="body1" paragraph>
        A Ebinex pode suspender, limitar, bloquear ou encerrar o acesso à conta
        de qualquer usuário que viole estas regras, a qualquer momento e sem
        aviso prévio.
      </Typography>

      <Typography variant="body1" paragraph>
        Operações suspeitas ou incompatíveis com as regras de integridade da
        plataforma serão analisadas, retidas ou canceladas.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Todas as contas envolvidas poderão ser suspensas ou encerradas imediatamente;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores ganhos nas contas secundárias serão anulados;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores depositados poderão ser retidos a critério exclusivo da Ebinex, especialmente em casos de tentativa de manipulação ou fraude." />
        </ListItem>
      </List>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        padding: 2,
        marginBottom: 3,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        8) Atualizações das Regras
      </Typography>

      <Typography variant="body1" paragraph>
        Estas regras podem ser alteradas a qualquer momento.
      </Typography>

      <Typography variant="body1" paragraph>
        O uso contínuo da plataforma implica na aceitação automática das
        atualizações.
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Todas as contas envolvidas poderão ser suspensas ou encerradas imediatamente;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores ganhos nas contas secundárias serão anulados;" />
        </ListItem>

        <ListItem>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <CircleIcon sx={{ fontSize: 8 }} />
          </ListItemIcon>
          <ListItemText primary="Os valores depositados poderão ser retidos a critério exclusivo da Ebinex, especialmente em casos de tentativa de manipulação ou fraude." />
        </ListItem>
      </List>
    </Paper>
  </Box>
);

const SupportPage = () => {
  const { t } = useTranslation("dashboard");
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    "panel1"
  );
  const [activeTabs, setActiveTabs] = useState(["how_it_works"]);
  const [searchTerm, setSearchTerm] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tabs = [
    { id: "how_it_works", title: "Como funciona" },
    { id: "withdraw_deposit", title: "Saque e Depósito" },
    { id: "taxes", title: "Taxas" },
    { id: "security", title: "Segurança" },
    { id: "rules", title: "Regras" },
  ];

  const handleChangeAccordion =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpandedAccordion(newExpanded ? panel : false);
    };

  const normalizeText = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,!?]/g, "")
      .toLowerCase();

  useEffect(() => {
    if (searchTerm) {
      const searchTermNormalized = normalizeText(searchTerm);
      const foundTabs = Object.keys(MOCK_ASKS).filter((category) =>
        MOCK_ASKS[category].some((item) => {
          const question = normalizeText(item.question);
          const answer = normalizeText(item.answer);

          return (
            question.includes(searchTermNormalized) ||
            answer.includes(searchTermNormalized)
          );
        })
      );
      setActiveTabs(foundTabs);
    } else {
      setActiveTabs(["how_it_works"]);
    }
  }, [searchTerm]);

  return (
    <Grid container spacing={2} sx={SupportStyled}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Box className="header_support">
          <TitleWithCircleIcon
            icon={<FaQuestion color="#01DB97" size={24} />}
            circleSize={isMobile ? 40 : 50}
            fontWeight="500"
            fontSize={isMobile ? 16 : 20}
            label="Perguntas Frequentes"
            description=" Tente resolver suas dúvidas com as perguntas mais feitas em nosso suporte."
          />
        </Box>
        <Box className="content_support">
          <Box>
            <Typography variant="body1" pb={0.5} color={"#EEE"}>
              Filtrar por assunto
            </Typography>
            <input
              type="text"
              className="search_input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite sua busca..."
            />
          </Box>
          <Box className="categories_wrapper">
            {tabs.map((item) => (
              <Button
                key={item.id}
                className={
                  activeTabs.includes(item.id)
                    ? "categories_tabs active"
                    : "categories_tabs"
                }
                onClick={() => setActiveTabs([item.id])} // Mantém a aba clicada como ativa
                variant="contained"
              >
                {item.title}
              </Button>
            ))}
          </Box>
          <Box className="categories_content">
            {activeTabs.map((tab) =>
              MOCK_ASKS[tab]
                .filter((item) => {
                  const searchTermNormalized = normalizeText(searchTerm);
                  const question = normalizeText(item.question);
                  const answer = normalizeText(item.answer);

                  return (
                    question.includes(searchTermNormalized) ||
                    answer.includes(searchTermNormalized)
                  );
                })
                .map((item, index) => (
                  <Accordion
                    key={`${tab}-${index}`}
                    expanded={expandedAccordion === `panel${tab}-${index}`}
                    onChange={handleChangeAccordion(`panel${tab}-${index}`)}
                    elevation={0}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${tab}-${index}-content`}
                      id={`panel${tab}-${index}-header`}
                    >
                      <Typography>{item.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {item.question ===
                      "Regras de Uso da Plataforma Ebinex" ? (
                        platformRulesContent
                      ) : (
                        <Typography>
                          <span
                            dangerouslySetInnerHTML={{ __html: item.answer }}
                          />
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
            )}
          </Box>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ContactSection />
        <SocialMediaSection />
      </Grid>
    </Grid>
  );
};

export default SupportPage;
