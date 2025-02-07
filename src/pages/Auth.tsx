import { useState } from "react";
import {
  Box, Button, Input, VStack, Heading, FormControl, FormLabel, InputGroup, InputRightElement,
  useToast, IconButton
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const navigate = useNavigate();
  const toast = useToast();  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // ✅ Handle login
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Login Gagal!",
        description: "Username dan Password harus diisi!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      const response = await axios.post("https://backendtodolist-production-e715.up.railway.app/login", {
        username,
        password
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        toast({
          title: "Login Berhasil!",
          description: "Anda berhasil masuk.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        setTimeout(() => navigate("/home"), 1500);
      }
    } catch (error) {
      toast({
        title: "Gagal Login!",
        description: "Periksa username dan password.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // ✅ Klik Enter untuk login
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="10vh" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading size="lg" textAlign="center" mb={6}>Login</Heading>
      
      <VStack spacing={4} align="stretch">
        {/* ✅ Input Username */}
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress} 
          />
        </FormControl>

        {/* ✅ Input Password dengan Toggle Visibility */}
        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress} 
            />
            <InputRightElement width="3rem">
              <IconButton
                aria-label="Toggle password visibility"
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={togglePasswordVisibility}
                size="sm"
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* ✅ Tombol Login */}
        <Button colorScheme="blue" width="full" onClick={handleLogin}>
          Login
        </Button>

        <Button variant="link" onClick={() => navigate("/register")}>
          Belum punya akun? Register di sini
        </Button>
      </VStack>
    </Box>
  );
};

export default Auth;
