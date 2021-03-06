import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
} from "@chakra-ui/core";
import { setCookie } from "nookies";
import { withRouter } from "next/router";

import { AUTH_API_URL } from "../../config";

const SignUpForm = ({ router }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("password mismatch");
      return;
    }

    const response = await fetch(`${AUTH_API_URL}/signup`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        confirmPassword,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const data = await response.json();
    console.info("signup response data", data);

    if (response.status !== 200) {
      setError(data.message || "Something went wrong! Please try again.");
    } else {
      setCookie({}, "X-Hasura-User-Id", data.id, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      setCookie({}, "token", data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      // setCookie({}, "X-Hasura-User-Role", data.roles[0] || "user", {
      //   maxAge: 30 * 24 * 60 * 60,
      //   path: "/",
      // });
      router.push("/");
    }
  };

  const errorsNode = () => {
    if (!error) return false;
    return (
      <Alert status="error" mb={8} rounded="md" variant="left-accent">
        <AlertIcon />
        {error}
      </Alert>
    );
  };

  return (
    <Box
      w="100%"
      minH="70vh"
      p={4}
      d="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box w="500px" p={8} bg="gray.50" rounded="md">
        <form onSubmit={handleSubmit}>
          {errorsNode()}
          <FormControl mb={8}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              id="email"
              aria-describedby="john@email.com"
              value={email}
              isRequired
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl mb={8}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              id="password"
              aria-describedby="*****"
              value={password}
              isRequired
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl mb={8}>
            <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
            <Input
              type="password"
              id="confirm-password"
              aria-describedby="*****"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!!confirmPassword && confirmPassword !== password && (
              <FormHelperText id="confirm-password">
                Passwords do not match
              </FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <Button type="submit">Sign Up</Button>
          </FormControl>
        </form>
      </Box>
    </Box>
  );
};

export default withRouter(SignUpForm);
