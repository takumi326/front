"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Box, Container, Typography, TextField, Button } from "@mui/material";

import { Reset } from "@/lib/api/auth";
import { ResetParams } from "@/interface/auth-interface";

import { AlertMessage } from "@/components/alertmessage/AlertMessage";

export const ResetForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: ResetParams = {
      password: password,
      passwordConfirmation: passwordConfirmation,
      accessToken: searchParams.get("access-token"),
      client: searchParams.get("client"),
      uid: searchParams.get("uid"),
    };

    try {
      await Reset(params);
      router.push(`/login`);
    } catch (err) {
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
          パスワード再設定
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="passwordConfirmation"
            label="パスワード確認"
            type="password"
            id="passwordConfirmation"
            autoComplete="current-password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            設定
          </Button>
          <AlertMessage
            open={alertMessageOpen}
            setOpen={setAlertMessageOpen}
            severity="error"
            message="パスワードは6文字以上にしてください"
          />
        </Box>
      </Box>
    </Container>
  );
};
