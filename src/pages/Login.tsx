import { useState } from "react";  
import axios from "axios";
import {
  Box, Button, Input, VStack, Heading, InputGroup, InputRightElement, FormControl, FormLabel, Text, Spinner, IconButton
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Toggle visibility password
  const togglePasswordVisibility = () => {
    console.log("👁️ Tombol intip password diklik");
    setShowPassword((prev) => !prev);
  };

  // Handle login function
  const handleLogin = async () => {
    setErrorMessage(""); 
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username dan Password harus diisi!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.36:8080/login", {
        username,
        password
      });

      localStorage.setItem("token", response.data.token);
      alert("Login berhasil!");
      navigate("/home"); 
    } catch (error: any) {
      console.error("❌ Error saat login:", error.response?.data);
      setErrorMessage(error.response?.data?.message || "Gagal melakukan login");
    } finally {
      setLoading(false);
    }
  };

  // Menjalankan login saat menekan Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
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
        {errorMessage && <Text color="red.500">{errorMessage}</Text>}

        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress} 
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
              onKeyDown={handleKeyPress} 
            />
            <InputRightElement width="3rem">
              <IconButton
                aria-label="Toggle password visibility"
                icon={showPassword ? <ViewOffIcon color="black" boxSize={5} /> : <ViewIcon color="black" boxSize={5} />}
                onClick={togglePasswordVisibility}
                size="md"
                variant="ghost"
                _hover={{ bg: "gray.200" }}
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
