import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";

import LoginForm from "src/components/forms/LoginForm";
import Logo from "../../components/Logo";
import gtm from "../../lib/gtm";

import BgImage from "../../assets/images/bg_f_1.png";

const Login: FC = () => {
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  return (
    <>
      <Helmet>
        <title>Login | Ebinex</title>
      </Helmet>
      <Box
        sx={{
          backgroundImage: `url(${BgImage})`,
          backgroundColor: "background.default",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm" sx={{ py: "80px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 8,
            }}
          >
            <RouterLink to="/">
              <Logo
                sx={{
                  height: 70,
                  width: "auto",
                }}
              />
            </RouterLink>
          </Box>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 4,
              }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <div>
                  <Typography
                    color="textPrimary"
                    alignItems={"center"}
                    gutterBottom
                    variant="h4"
                  >
                    Seja bem-vindo à Revolução
                  </Typography>
                  <Typography color="textSecondary" variant="body2" mb={1}>
                    Faça login para entrar na primeira, melhor e única corretora
                    de novas opções no mundo.
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                <LoginForm mode="form" showForgetPassword={false} />
              </Box>
              <Divider sx={{ my: 3 }} />

              <Stack direction={"row"} justifyContent={"space-between"}>
                <Link
                  color="textSecondary"
                  component={RouterLink}
                  sx={{ mt: 1 }}
                  to="/"
                  variant="body2"
                >
                  Home
                </Link>
                <Link
                  color="textSecondary"
                  component={RouterLink}
                  sx={{ mt: 1 }}
                  to="/register"
                  variant="body2"
                >
                  Não tem uma conta? Registre-se
                </Link>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
