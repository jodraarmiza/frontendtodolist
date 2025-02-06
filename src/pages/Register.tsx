import { useState } from "react";
import axios from "axios";
import {
  Box, Button, Input, VStack, Heading, InputGroup, InputRightElement, FormControl, FormLabel, IconButton, Text, Spinner
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loader untuk tombol

  // ✅ State untuk toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // ✅ Fungsi Handle Register
  const handleRegister = async () => {
    setErrorMessage(""); 
    setSuccessMessage(""); 
    setLoading(true); // ✅ Aktifkan loading

    // ✅ Validasi input sebelum mengirim ke backend
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedUsername || !trimmedPassword || !trimmedConfirmPassword) {
      setErrorMessage("Semua kolom harus diisi!");
      setLoading(false);
      return;
    }

    if (trimmedPassword.length < 6) {
      setErrorMessage("Password harus minimal 6 karakter!");
      setLoading(false);
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setErrorMessage("Password dan Konfirmasi Password harus sama!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.36:8080/register", {
        username: trimmedUsername,
        password: trimmedPassword
      });

      setSuccessMessage(response.data.message); // ✅ Tampilkan pesan sukses
      setTimeout(() => navigate("/auth"), 2000); // ✅ Redirect ke login setelah 2 detik
    } catch (error: any) {
      console.error("❌ Error saat registrasi:", error.response?.data);
      setErrorMessage(error.response?.data?.message || "Gagal melakukan registrasi");
    } finally {
      setLoading(false); // ✅ Matikan loading setelah request selesai
    }
  };

  return (
    <Box 
      maxW="md" mx="auto" mt="10vh" p={8} 
      borderWidth={1} borderRadius="lg" boxShadow="lg" 
      bg="white" _dark={{ bg: "gray.800" }}
    >
      <Heading size="lg" textAlign="center" mb={6}>Register</Heading>
      
      <VStack spacing={4} align="stretch">
        {/* ✅ Tampilkan pesan sukses atau error */}
        {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        {successMessage && <Text color="green.500">{successMessage}</Text>}

        {/* ✅ Input Username */}
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>

        {/* ✅ Input Password */}
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

        {/* ✅ Input Confirm Password */}
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement>
              <IconButton 
                aria-label="Toggle confirm password visibility"
                icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />} 
                onClick={toggleConfirmPasswordVisibility} 
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* ✅ Tombol Register */}
        <Button colorScheme="blue" width="full" onClick={handleRegister} isLoading={loading}>
          {loading ? <Spinner size="sm" /> : "Register"}
        </Button>

        {/* ✅ Link ke Login */}
        <Button variant="link" onClick={() => navigate("/auth")}>
          Sudah punya akun? Login di sini
        </Button>
      </VStack>
    </Box>
  );
};

export default Register;
