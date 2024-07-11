"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Box, Container, Typography, TextField, Button } from "@mui/material";

import { ResetPassword } from "@/lib/api/auth";
import { ResetParams } from "@/interface/auth-interface";

import { AlertMessage } from "@/components/alertmessage/AlertMessage";

export const PasswordReset: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: ResetParams = {
      email: email,
      redirect_url: "http://localhost:8000/reset",
    };

    try {
      await ResetPassword(params);
      router.push(`/login`);
    } catch (err) {
      setAlertMessageOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          py: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          パスワードリセット
        </Typography>
        <Typography className="mt-24">
          登録されているメールアドレスにパスワードリセットのメールを送信します
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 8 }}>
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 8, mb: 2 }}
          >
            送信
          </Button>
          <AlertMessage
            open={alertMessageOpen}
            setOpen={setAlertMessageOpen}
            severity="error"
            message="メールアドレスが無効です"
          />
        </Box>
      </Box>
    </Container>
  );
};
