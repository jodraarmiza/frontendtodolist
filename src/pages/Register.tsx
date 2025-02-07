import { useState } from "react";
import axios from "axios";
import {
  Box, Button, Input, VStack, Heading, InputGroup, InputRightElement,
  FormControl, FormLabel, IconButton, Alert, AlertIcon, useToast, Spinner
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleRegister = async () => {
    setErrorMessage("");
    setLoading(true);

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("Semua kolom harus diisi!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password harus minimal 6 karakter!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password dan Konfirmasi Password harus sama!");
      setLoading(false);
      return;
    }

    try {
      await axios.post("https://backendtodolist-production-e715.up.railway.app/register", {
        username: username.trim(),
        password: password.trim(),
      });

      // ✅ Tampilkan toast sukses
      toast({
        title: "Registrasi Berhasil!",
        description: "Akun kamu berhasil dibuat, silakan login.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setTimeout(() => navigate("/auth"), 2000);
    } catch (error: any) {
      console.error("❌ Error saat registrasi:", error.response?.data);
      setErrorMessage(error.response?.data?.message || "Gagal melakukan registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="10vh" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
      <Heading size="lg" textAlign="center" mb={6}>Register</Heading>
      
      <VStack spacing={4} align="stretch">
        {errorMessage && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <InputRightElement>
              <IconButton aria-label="Toggle password visibility" icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} onClick={togglePasswordVisibility} variant="ghost" />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <InputRightElement>
              <IconButton aria-label="Toggle confirm password visibility" icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />} onClick={toggleConfirmPasswordVisibility} variant="ghost" />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button colorScheme="blue" width="full" onClick={handleRegister} isLoading={loading}>
          {loading ? <Spinner size="sm" /> : "Register"}
        </Button>

        <Button variant="link" onClick={() => navigate("/auth")}>
          Sudah punya akun? Login di sini
        </Button>
      </VStack>
    </Box>
  );
};

export default Register;
