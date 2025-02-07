import { useState } from "react";  
import axios from "axios";
import {
  Box, Button, Input, VStack, Heading, InputGroup, InputRightElement,
  FormControl, FormLabel, IconButton, useToast, Alert, AlertIcon, Spinner
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();  // ✅ Inisialisasi toast Chakra UI
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // ✅ Handle login function
  const handleLogin = async () => {
    setErrorMessage("");
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username dan Password harus diisi!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://backendtodolist-production-e715.up.railway.app/login", {
        username: username.trim(),
        password: password.trim(),
      });

      localStorage.setItem("token", response.data.token);

      // ✅ Tampilkan notifikasi sukses
      toast({
        title: "Login Berhasil!",
        description: "Anda berhasil masuk.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setTimeout(() => navigate("/home"), 1500);
    } catch (error: any) {
      console.error("❌ Error saat login:", error.response?.data);

      // ✅ Gunakan notifikasi error Chakra UI
      toast({
        title: "Gagal Login!",
        description: error.response?.data?.message || "Username atau Password salah!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setErrorMessage(error.response?.data?.message || "Gagal melakukan login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      maxW="md" mx="auto" mt="10vh" p={8} 
      borderWidth={1} borderRadius="lg" boxShadow="lg" 
      bg="white" _dark={{ bg: "gray.800" }}
    >
      <Heading size="lg" textAlign="center" mb={6}>Login</Heading>
      
      <VStack spacing={4} align="stretch">
        {errorMessage && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label="Toggle password visibility"
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={togglePasswordVisibility}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button colorScheme="blue" width="full" onClick={handleLogin} isLoading={loading}>
          {loading ? <Spinner size="sm" /> : "Login"}
        </Button>

        <Button variant="link" onClick={() => navigate("/register")}>
          Belum punya akun? Daftar di sini
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
