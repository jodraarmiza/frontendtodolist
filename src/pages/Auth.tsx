import { useState } from "react";
import { Box, Button, Input, VStack, Heading, FormControl, FormLabel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.36:8080/login", { username, password });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Simpan token JWT
        alert("Login sukses!");
        navigate("/home"); // Pindah ke halaman home
      }
    } catch (error) {
      alert("Login gagal! Periksa username dan password.");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="10vh" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading size="lg" textAlign="center" mb={6}>Login</Heading>
      
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>

        <Button colorScheme="blue" width="full" onClick={handleLogin}>Login</Button>
        <Button variant="link" onClick={() => navigate("/register")}>Belum punya akun? Register di sini</Button>
      </VStack>
    </Box>
  );
};

export default Auth;
