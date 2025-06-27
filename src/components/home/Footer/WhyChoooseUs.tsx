import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BiSolidSelectMultiple } from "react-icons/bi";
import { BsChatLeftFill, BsCoin, BsFillTrophyFill } from "react-icons/bs";
import { CiCreditCardOff } from "react-icons/ci";
import { FaLock, FaRegChartBar } from "react-icons/fa";
import { HiMiniPuzzlePiece } from "react-icons/hi2";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import heroImage from "src/assets/images/home/footer/why_choose_us.png";
import Container from "src/components/shared/Container";
import TitleWithCircleIcon from "src/components/TitleWithCircleIcon";
import CtaSession from "./CtaSession";

const GOOD_POINTS_FIRST = [
  {
    id: 1,
    icon: <BsFillTrophyFill size={28} />,
    title: "Experiência comprovada ",
    description:
      "A história do Grupo Ebinex remonta a x , quando lançamos as bases para o primeiro serviço de negociação de probabilidades fixas do mundo. Desde então, crescemos continuamente, conquistando a confiança de traders em todo o mundo.",
  },
  {
    id: 2,
    icon: <IoShieldCheckmarkSharp size={32} />,
    title: "Somos uma entidade licenciada e regulamentada",
    description:
      "A Ebinex é regulada por diversas entidades, nomeadamente a Malta Financial Services Authority (MFSA), a Labuan Financial Services Authority (Labuan FSA), a Vanuatu Financial Services Commission (VFSC) e a British Virgin Islands Financial Services Commission.",
  },
];

const GOOD_POINTS_SECOND = [
  {
    id: 1,
    icon: <BsCoin size={36} />,
    title: "Proteção dos fundos dos clientes",
    description:
      "A Ebinex não utiliza os fundos dos clientes para os seus próprios interesses comerciais. Os utilizadores podem retirar os seus fundos a qualquer momento. Os fundos são mantidos separadamente e depositados em instituições financeiras seguras. Desta forma, mesmo no caso improvável de insolvência da Ebinex, o dinheiro dos clientes será devolvido, pois nunca é misturado com os fundos da empresa.",
  },
  {
    id: 2,
    icon: <HiMiniPuzzlePiece size={32} />,
    title: "Sensibilização e gestão de risco",
    description:
      "A negociação online pode ser entusiasmante, porém, envolve riscos e pode resultar em dependência. Na Ebinex, priorizamos os interesses dos nossos clientes e incentivamos a prática de uma  . Se é novo no mundo da negociação, pode praticar com fundos virtuais ilimitados antes de arriscar o seu dinheiro.",
  },
  {
    id: 3,
    icon: <BsChatLeftFill size={28} />,
    title: "Assistência sempre que precisar",
    description:
      "A equipa de apoio ao cliente da Ebinex está disponível 24/7 via live chat - incluindo aos fins de semana. Além disso, pode encontrar respostas às suas questões no nosso Centro de ajuda e obter assistência de outros traders através da nossa Comunidade.",
  },
];

const GOOD_POINTS_THIRD = [
  {
    id: 1,
    icon: <HiMiniPuzzlePiece size={32} />,
    title: "Experiência de negociação centrada no cliente",
    description:
      "A história do Grupo Ebinex remonta a x , quando lançamos as bases para o primeiro serviço de negociação de probabilidades fixas do mundo. Desde então, crescemos continuamente, conquistando a confiança de traders em todo o mundo.",
  },
  {
    id: 2,
    icon: <FaLock size={28} />,
    title: "A sua segurança é a nossa prioridade",
    description:
      "Na Ebinex, implementamos medidas de segurança de excelência, como a encriptação SSL, para proteger a sua conta e os seus dados pessoais.",
  },
];

const WITHOUT_RISCS = [
  {
    id: 1,
    icon: <BiSolidSelectMultiple size={28} />,
    title: "Todos os mercados e plataformas",
    description:
      "Desfrute de acesso total a todos os nossos mercados e plataformas.",
  },
  {
    id: 2,
    icon: <FaRegChartBar size={28} />,
    title: "Fundos virtuais ilimitados",
    description:
      "Aprimore as suas competências de negociação com a Ebinex o tempo que desejar. Sem correr riscos, sem taxas ocultas.",
  },
  {
    id: 3,
    icon: <CiCreditCardOff size={32} />,
    title: "Não é necessário cartão de crédito",
    description:
      "Aprimore as suas competências de negociação com a Ebinex o tempo que desejar. Sem correr riscos, sem taxas ocultas.",
  },
];

const style = {
  position: "relative",
  pt: { xs: 4, md: 24 },

  "& .hero_image": {
    width: "100%",
    maxWidth: "400px",
  },

  "& .without_riscs_session .box_wrapper": {
    background: "#030B10",
    padding: "2rem",
    borderRadius: "16px",
    border: "1px solid #081b27",
    height: "100%",
    minHeight: "220px",
  },
  "& .client_focus_session .box_wrapper": {
    background: "#030B10",
    padding: "2rem",
    borderRadius: "16px",
    border: "1px solid #081b27",
  },
  "& .client_focus_session": {
    padding: "4rem 0",
    textAlign: "center",
  },
  "& .our_values_session": {
    textAlign: "center",
  },
  "& .divider": {
    background: "linear-gradient(317deg, #00A667, #004329)",
    width: "120px",
    height: "6px",
    borderRadius: "24px",
    marginTop: 1,
  },
};

const WhyChoooseUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ ...style, marginTop: isMobile ? "4rem" : "8rem" }}>
      <Container>
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid
            className="left_hero"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            size={{ sm: 12, md: 5 }}
          >
            <Stack spacing={2}>
              <Typography variant="h3">
                <span style={{ color: "#00A667", display: "block" }}>
                  Porque escolher a{" "}
                </span>{" "}
                ebinex?
              </Typography>
              <Typography variant="body1" color="#CCC">
                Orgulhamo-nos de adotar uma abordagem focada no cliente,
                assegurando que os seus interesses sejam sempre a nossa
                principal prioridade. O nosso historial comprovado em negociação
                regulamentada, aliado à robusta proteção dos fundos dos
                clientes, torna-nos a escolha natural para os traders.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ md: 1 }} />
          <Grid size={{ sm: 12, md: 5 }}>
            <Box className="logo_box">
              <img
                src={heroImage}
                className="hero_image"
                alt="Imagem de criptomoedas"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box className="client_focus_session" sx={{ my: isMobile ? 2 : 8 }}>
        <Container>
          <Grid size={{ xs: 12, md: 12 }} pb={{ xs: 4, md: 6 }}>
            <Stack alignItems="center" justifyContent={"center"}>
              <Typography variant="h4">
                Uma plataforma focada no cliente
              </Typography>
              <Box className="divider"></Box>
            </Stack>
          </Grid>

          <Grid container sx={{ justifyContent: "center", gap: 2, mb: 2 }}>
            {GOOD_POINTS_FIRST.map((item) => (
              <Grid
                size={{ sm: 12, md: 5 }}
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  "& .box_wrapper": {
                    alignItems: "center",
                    margin: 0,
                  },
                }}
              >
                <TitleWithCircleIcon
                  label={item.title}
                  description={item.description}
                  descriptionColor="#80909a"
                  flexDirection="column"
                  icon={item.icon}
                  circleSize={56}
                />
              </Grid>
            ))}
          </Grid>

          <Grid container sx={{ justifyContent: "center", gap: 2, mt: 2 }}>
            {GOOD_POINTS_SECOND.map((item) => (
              <Grid
                size={{ sm: 12, md: 3.8 }}
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  "& .box_wrapper": {
                    alignItems: "center",
                    margin: 0,
                  },
                }}
              >
                <TitleWithCircleIcon
                  label={item.title}
                  description={item.description}
                  descriptionColor="#80909a"
                  flexDirection="column"
                  icon={item.icon}
                  circleSize={56}
                />
              </Grid>
            ))}
          </Grid>

          <Grid container sx={{ justifyContent: "center", gap: 2, mt: 2 }}>
            {GOOD_POINTS_THIRD.map((item) => (
              <Grid
                size={{ sm: 12, md: 5 }}
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  "& .box_wrapper": {
                    alignItems: "center",
                    margin: 0,
                  },
                }}
              >
                <TitleWithCircleIcon
                  label={item.title}
                  description={item.description}
                  descriptionColor="#80909a"
                  flexDirection="column"
                  icon={item.icon}
                  circleSize={56}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box className="available_tripto_session">
        <Container>
          <Grid
            container
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Grid size={{ xs: 12 }} pb={{ xs: 4, md: 6 }}>
              <Stack
                alignItems="center"
                justifyContent={"center"}
                textAlign={"center"}
              >
                <Typography variant="h4">
                  Negocie sem riscos com uma conta de <br /> demonstração
                  gratuita
                </Typography>
                <Box className="divider"></Box>
              </Stack>
            </Grid>

            {WITHOUT_RISCS.map((item) => (
              <Grid size={{ sm: 12, md: 4 }}>
                <Stack spacing={4} pb={2}>
                  <Box className="without_riscs_session">
                    <TitleWithCircleIcon
                      label={item.title}
                      description={item.description}
                      descriptionColor="#80909a"
                      fontSize={18}
                      icon={item.icon}
                      circleSize={48}
                      flexDirection="column"
                    />
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container>
        <CtaSession
          title={
            <>
              Negocie com uma corretora de <br /> confiança
            </>
          }
          ctaLabel="Negocie agora"
        />
      </Container>
    </Box>
  );
};

export default WhyChoooseUs;
