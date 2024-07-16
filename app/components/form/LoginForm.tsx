"use client";
import React, { useState, useContext } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";

import { authContext } from "@/context/auth-context";
import { signIn } from "@/lib/api/auth";
import { signInParams } from "@/interface/auth-interface";

import { AlertMessage } from "@/components/alertmessage/AlertMessage";

export const LoginForm: React.FC = () => {
  const router = useRouter();

  const {
    setcurrentUserId,
    setIsSignedIn,
    setCurrentUser,
    setcurrentUserEmail,
  } = useContext(authContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: signInParams = {
      email: email,
      password: password,
    };

    try {
      const res = await signIn(params);

      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        setcurrentUserId(res.data.data.id);
        setcurrentUserEmail(res.data.data.uid);

        router.push(`/money`);
      } else {
        setAlertMessageOpen(true);
      }
    } catch (err) {
      console.log(err);
      setAlertMessageOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          py: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ログイン
          </Button>
          <AlertMessage
            open={alertMessageOpen}
            setOpen={setAlertMessageOpen}
            severity="error"
            message="メールアドレスかパスワードが無効です"
          />
          <Typography className="mt-12">
            <Link href="/passreset" color="primary" underline="hover">
              パスワードをお忘れの場合
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
