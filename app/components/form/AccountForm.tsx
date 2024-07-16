"use client";
import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { Box, Container, Typography, TextField, Button } from "@mui/material";

import { authContext } from "@/context/auth-context";
import { UpdateUser } from "@/lib/api/auth";
import { UpdateParams } from "@/interface/auth-interface";

import { AlertMessage } from "@/components/alertmessage/AlertMessage";

export const AccountForm: React.FC = () => {
  const router = useRouter();
  const {
    setcurrentUserId,
    setCurrentUser,
    currentUserEmail,
    setcurrentUserEmail,
  } = useContext(authContext);

  const [currentEmail, setCurrentEmail] = useState(currentUserEmail);
  const [newEmail, setNewEmail] = useState("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setCurrentEmail(currentUserEmail);
  }, [currentUserEmail]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(newEmail));
  }, [newEmail]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: UpdateParams = {
      email: newEmail,
      accessToken: Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    };

    try {
      if (isEmailValid) {
        const res = await UpdateUser(params);

        if (res.status === 200) {
          // Cookies.set("_access_token", res.headers["access-token"]);
          // Cookies.set("_client", res.headers["client"]);
          Cookies.set("_uid", res.headers["uid"]);

          setCurrentUser(res.data.data);
          setcurrentUserId(res.data.data.id);
          setcurrentUserEmail(res.data.data.uid);
        }
      } else {
        setAlertMessageOpen(true);
      }
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
          アカウント設定
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Typography component="h3" variant="body2" sx={{ mt: 3, mb: 2 }}>
            現在のメールアドレス
          </Typography>
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 2, fontSize: "1.5rem" }}
          >
            {String(currentEmail)}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="newEmail"
            label="新しいメールアドレス"
            name="newEmail"
            autoComplete="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isEmailValid}
          >
            編集確定
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
